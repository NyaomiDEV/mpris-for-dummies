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
const player = require("./player.js");

module.exports = class PlayerFactory {
	
	constructor(){
		this.bus = dbus.sessionBus();
	}
	
	async getPlayerNames(){
		const message = new dbus.Message({
			destination: "org.freedesktop.DBus",
			path: "/org/freedesktop/DBus",
			interface: "org.freedesktop.DBus",
			member: 'ListNames'
		});
		let reply = await this.bus.call(message);
		reply = reply.body[0].filter(x => { return x.match(/org\.mpris\.MediaPlayer2/) !== null });
		return reply;
	}
	
	async getPlayer(playerServiceName = null){
		if(playerServiceName === null){
			const playerNames = await this.getPlayerNames();
			if(playerNames.length == 0) return undefined;
			playerServiceName = playerNames[0];
		}
		const proxy = await this.bus.getProxyObject(playerServiceName, "/org/mpris/MediaPlayer2");
		return new player(proxy);
	}
	
}
