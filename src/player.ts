/*
 * Copyright 2020 AryToNeX
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import events from "events";
import dbus from "dbus-next";

type Binder = {
	get?: () => any,
	// eslint-disable-next-line no-unused-vars
	set?: (value: any) => any
}

export default class Player extends events.EventEmitter {
	// eslint-disable-next-line no-unused-vars
	_monitorFunction: (name: string, oldOwner: string, newOwner: string) => void;
	available: boolean;
	
	constructor(dbusProxy){
		super();
		// Register a way to monitor if the player is active
		this.available = true;

		this._monitorFunction = (name, oldOwner, newOwner) => {
			if (name === dbusProxy.name) {
				if (oldOwner === "") {
					this.available = true;
					this.emit("connected");
				} else if (newOwner === "") {
					this.available = false;
					this.emit("disconnected");
				}
			}
		};
		
		// Register listeners to keep track of the media player's connection status
		dbus.sessionBus().getProxyObject("org.freedesktop.DBus", "/org/freedesktop/DBus").then(async (dbusPO) => {
			const iface = await dbusPO.getInterface("org.freedesktop.DBus");
			iface.on("NameOwnerChanged", this._monitorFunction);
		});
		
		const player = dbusProxy.getInterface("org.mpris.MediaPlayer2.Player");
		const props = dbusProxy.getInterface("org.freedesktop.DBus.Properties");
		
		console.log(player);
		
		// Register methods like play, pause etc
		for(let method of player.$methods){
			Object.defineProperty(this, method.name, {
				get: () => player[method.name]
			});
		}
		
		// Register properties like position, metadata etc
		for(let property of player.$properties){
			const binder: Binder = {};

			binder.get = async () => {
				const result = await props.Get("org.mpris.MediaPlayer2.Player", property.name);
				if (property.type === "a{sv}") {
					let obj = {};
					for (let key in result.value)
						obj[key] = result.value[key].value;
					result.value = obj;
				}
				return result.value;
			};

			if(property.access === "readwrite"){
				binder.set = async (value) => {
					const variant = new dbus.Variant();
					variant.signature = property.type;
					variant.value = value;

					return props.Set(
						"org.mpris.MediaPlayer2.Player",
						property.name,
						variant
					);
				};
			}
			
			Object.defineProperty(this, property.name, binder);
		}
		
		// Register playback status and metadata events
		props.on("PropertiesChanged", (_iface, changed, /*_invalidated*/) => {
			if(changed.Metadata){
				// Music changed!
				let _changed = Player.parseMetadataFromVariant(changed.Metadata.value);
				this.emit("musicChanged", _changed);
			}
			
			else if(changed.PlaybackStatus)
				// Playback status has changed!
				this.emit("playbackStatusChanged", changed.PlaybackStatus.value);
			
			else
			{for(let key in changed)
				this.emit("propertyChanged", key, changed[key].value);}
		});
		
		// Register seeked event
		player.on("Seeked", (seekedToPos) => {
			this.emit("seeked", Number(seekedToPos) / 1000000);
		});
	}

	dispose(){
		this.removeAllListeners();
		dbus.sessionBus().getProxyObject("org.freedesktop.DBus", "/org/freedesktop/DBus").then(async (dbusPO) => {
			const iface = await dbusPO.getInterface("org.freedesktop.DBus");
			iface.removeListener("NameOwnerChanged", this._monitorFunction);
		});
	}
	
	static parseMetadataFromVariant(metadata){
		if(typeof metadata == "undefined" || Object.keys(metadata).length === 0) return {};

		const parsed: any = {};
		for(let key in metadata)
			parsed[key] = metadata[key].value;
		
		return parsed;
	}
	
	static basicMetadata(metadata){
		return {
			title: metadata["xesam:title"],
			artist: typeof metadata["xesam:artist"] === "string" ? metadata["xesam:artist"] : metadata["xesam:artist"].join("; "),
			album: metadata["xesam:album"],
			length: Number(metadata["mpris:length"]) / 1000000
		};
	}

}
