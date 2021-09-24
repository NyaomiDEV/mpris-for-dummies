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

type Binder<T> = {
	get?: () => Promise<T>,
	// eslint-disable-next-line no-unused-vars
	set?: (value: T) => Promise<void>
}

export interface MPRIS2 {
	Raise?: () => Promise<void>,
	Quit?: () => Promise<void>,

	canRaise?: Promise<boolean>,
	canQuit?: Promise<boolean>,

	HasTrackList?: Promise<boolean>,

	Identity?: Promise<string>,
	DesktopEntry?: Promise<string>,
	SupportedUriSchemes?: Promise<string[]>,
	SupportedMimeTypes?: Promise<string[]>
}

export interface MPRIS2Player {
	available: boolean,
	app: MPRIS2,

	Next?: () => Promise<void>,
	Previous?: () => Promise<void>,
	Pause?: () => Promise<void>,
	PlayPause?: () => Promise<void>,
	Stop?: () => Promise<void>,
	Play?: () => Promise<void>,
	Seek?: () => Promise<void>,
	SetPosition?: () => Promise<void>,
	OpenUri?: () => Promise<void>,

	PlaybackStatus?: Promise<string>,
	LoopStatus?: Promise<string>,
	Rate?: Promise<number>,
	Shuffle?: Promise<boolean>,
	Metadata?: Promise<Array<{[x: string]: any}>>,
	Volume?: Promise<number>,
	// eslint-disable-next-line no-undef
	Position?: Promise<BigInt>,
	MinimumRate?: Promise<number>,
	MaximumRate?: Promise<number>,

	CanGoNext?: Promise<boolean>,
	CanGoPrevious?: Promise<boolean>,
	CanPlay?: Promise<boolean>,
	CanPause?: Promise<boolean>,
	CanSeek?: Promise<boolean>,
	CanControl?: Promise<boolean>
}

export default class Player extends events.EventEmitter implements MPRIS2Player {
	// eslint-disable-next-line no-unused-vars
	_monitorFunction: (name: string, oldOwner: string, newOwner: string) => void;
	private _proxyObject: dbus.ProxyObject;
	available: boolean;
	app: MPRIS2;
	
	constructor(dbusProxy: dbus.ProxyObject){
		super();
		// Register a way to monitor if the player is active
		this.available = true;
		this.app = {};
		this._proxyObject = dbusProxy;

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

		// Register methods like play, pause etc
		this._bindProxyObject("org.mpris.MediaPlayer2", this.app);
		this._bindProxyObject("org.mpris.MediaPlayer2.Player", this);
		
		// Register listeners to keep track of the media player's connection status
		dbus.sessionBus().getProxyObject("org.freedesktop.DBus", "/org/freedesktop/DBus").then(async (dbusPO) => {
			const iface = await dbusPO.getInterface("org.freedesktop.DBus");
			iface.on("NameOwnerChanged", this._monitorFunction);
		});
		
		// Register playback status and metadata events
		const props = dbusProxy.getInterface("org.freedesktop.DBus.Properties");
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
		this._proxyObject.getInterface("org.mpris.MediaPlayer2.Player").on("Seeked", (seekedToPos) => {
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

	private _bindProxyObject(from: string, to){
		const props = this._proxyObject.getInterface("org.freedesktop.DBus.Properties");
		const fromClient = this._proxyObject.getInterface(from);
		for (let method of fromClient.$methods as unknown as any[]) {
			Object.defineProperty(to, method.name, {
				get: () => fromClient[method.name]
			});
		}
		for (let property of fromClient.$properties as unknown as any[]) {
			const binder: Binder<any> = {};

			binder.get = async () => {
				const result = await props.Get(from, property.name);
				if (property.type === "a{sv}") {
					let obj = {};
					for (let key in result.value)
						obj[key] = result.value[key].value;
					result.value = obj;
				}
				return result.value;
			};

			if (property.access === "readwrite") {
				binder.set = async (value) => {
					const variant = new dbus.Variant();
					variant.signature = property.type;
					variant.value = value;

					return await props.Set(
						from,
						property.name,
						variant
					);
				};
			}

			Object.defineProperty(to, property.name, binder);
		}
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
