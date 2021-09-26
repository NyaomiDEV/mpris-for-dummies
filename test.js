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
const PlayerFactory = require(".");

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
	console.log(names);
	for(let name of names)
		await addPlayer(name);
}

async function addPlayer(name){
	console.log("getting player", name);
	players[name] = await PlayerFactory.getPlayer(name);
	console.log("registering", name);
	players[name].whenReady().then(async () => {
		console.log("Added player", name);
		console.log(name, "Current playing song:", PlayerFactory.marshallVariants(players[name].Player.Metadata));
		console.log(name, "Current position:", Number(players[name].Player.Position) / 1000000);

		players[name].Player.on("Seeked", (to) => console.log("Seeked to", to / 1000000));
		players[name].Player.on("PropertiesChanged", (changed, invalidated) => console.log("Player Properties Changed", PlayerFactory.marshallVariants(changed), invalidated));
		players[name].on("PropertiesChanged", (changed, invalidated) => console.log("MediaPlayer2 Properties Changed", PlayerFactory.marshallVariants(changed), invalidated));
	});
}

async function deletePlayer(name){
	players[name].dispose();
	delete players[name];
	console.log("Removed player", name);
}

main();

////

/* function quickVariant(signature, value){
	const v = new dbus.Variant();
	v.signature = signature;
	v.value = value;
	return v;
}

const test = quickVariant("{sv}", {
	testVariant: quickVariant("b", true),
	testArray: quickVariant("as", ["test", "lol", quickVariant("b", true)]),
	testNested: quickVariant("{sb}", {lol: true}),
	testBasicType: true
});

console.log(PlayerFactory.marshallVariants(test)); */