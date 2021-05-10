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

const dbus = require("dbus-next");
const mpris = require(".");
const PlayerFactory = new mpris.PlayerFactory();

let players = {};

async function main(){
	// Register events
	dbus.sessionBus().getProxyObject("org.freedesktop.DBus", "/org/freedesktop/DBus").then(async (dbusPO) => {
		const iface = await dbusPO.getInterface("org.freedesktop.DBus");
		iface.on("NameOwnerChanged", async (name, oldOwner, newOwner) => {
			if(name.match(/org\.mpris\.MediaPlayer2/) !== null){
				if(oldOwner === "")
					await addPlayer(name);
				else if (newOwner === "")
					await deletePlayer(name);
			}
		});
	});
	
	// Add already opened players
	const names = await PlayerFactory.getPlayerNames();
	for(let name of names)
		await addPlayer(name);
}

async function addPlayer(name){
	players[name] = await PlayerFactory.getPlayer(name);
	players[name].on("musicChanged", (info) => console.log(name, "Music changed:", info));
	players[name].on("playbackStatusChanged", (info) => console.log(name, "Playback Status changed:", info));
	players[name].on("seeked", (seekedTo) => console.log(name, "Seeked to position:", seekedTo));
	players[name].on("propertyChanged", (prop, value) => console.log(name, "Property changed:", prop, value));
	
	console.log("Added player", name);
	console.log(name, "Current playing song:",
		await players[name].Metadata
	);
	console.log(name, "Current position:", Number(await players[name].Position) / 1000000);
}

async function deletePlayer(name){
	players[name].dispose();
	delete players[name];
	console.log("Removed player", name);
}

main();
