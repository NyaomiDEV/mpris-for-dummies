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
"use strict";

const events = require("events");
const dbus = require("dbus-next");

module.exports = class Player extends events.EventEmitter {
	
	constructor(dbusProxy){
		super();
		// Register a way to monitor if the player is active
		this.available = true;
		
		this._monitorFunction = (name, oldOwner, newOwner) => {
			if(name === dbusProxy.name){
				if(oldOwner == ""){
					this.available = true;
					this.emit("connected");
				}else if(newOwner == ""){
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
		
		const player = dbusProxy.getInterface('org.mpris.MediaPlayer2.Player');
		const props = dbusProxy.getInterface('org.freedesktop.DBus.Properties');
		
		console.log(player);
		
		// Register methods like play, pause etc
		for(let method of player["$methods"]){
			Object.defineProperty(this, method.name, {
				get: () => player[method.name]
			});
		}
		
		// Register properties like position, metadata etc
		for(let property of player["$properties"]){
			let binder = {};
			binder.get = async () => {
				const result = await props.Get("org.mpris.MediaPlayer2.Player", property.name);
				if(property.type == "a{sv}"){
					let obj = {};
					for(let key in result.value)
						obj[key] = result.value[key].value;
					result.value = obj;
				}
				return result.value;
			}
			
			if(property.access === "readwrite"){
				binder.set = async (value) => {
					await props.Set(
						"org.mpris.MediaPlayer2.Player",
						property.name,
						new dbus.Variant(property.type, value)
					);
				}
			}
			
			Object.defineProperty(this, property.name, binder);
		}
		
		// Register playback status and metadata events
		props.on('PropertiesChanged', (iface, changed, invalidated) => {
			if(changed.Metadata){
				// Music changed!
				let _changed = this.constructor.parseMetadata_raw(changed.Metadata.value);
				this.emit("musicChanged", _changed);
			}
			
			else if(changed.PlaybackStatus)
				// Playback status has changed!
				this.emit("playbackStatusChanged", changed.PlaybackStatus.value);
			
			else
				for(let key in changed)
					this.emit("propertyChanged", key, changed[key].value);
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
	
	static parseMetadata_raw(metadata){
		if(typeof metadata == "undefined" || Object.keys(metadata).length == 0) return {};

		let parsed = {};
		for(let key in metadata){
			parsed[key.replace("xesam:","").replace("mpris:","")] = metadata[key];
		}
		return parsed;
	}
	
	static parseMetadata_tidy(metadataRaw){
		if(metadata.length)
			metadata.length = Number(metadata.length) / 1000000;
		
		return metadata;
	}
	
	static basicMetadata(metadataTidy){
		return {
			title: metadata.title,
			artist: metadata.artist.join("; "),
			album: metadata.album,
			duration: metadata.duration
		}
	}

}
