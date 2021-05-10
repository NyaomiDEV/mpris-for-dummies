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

import { sessionBus, Message, MessageBus } from "dbus-next";
import player from "./player";

export default class PlayerFactory {
	bus: MessageBus;
	
	constructor(){
		this.bus = sessionBus();
	}
	
	async getPlayerNames(){
		const message = new Message({
			destination: "org.freedesktop.DBus",
			path: "/org/freedesktop/DBus",
			interface: "org.freedesktop.DBus",
			member: "ListNames"
		});
		const reply = await this.bus.call(message);
		const body = reply?.body[0].filter(x => x.match(/org\.mpris\.MediaPlayer2/) !== null);
		return body;
	}
	
	async getPlayer(playerServiceName?){
		if(playerServiceName === null){
			const playerNames = await this.getPlayerNames();
			if(playerNames.length === 0) return undefined;
			playerServiceName = playerNames[0];
		}
		const proxy = await this.bus.getProxyObject(playerServiceName, "/org/mpris/MediaPlayer2");
		return new player(proxy);
	}
	
}
