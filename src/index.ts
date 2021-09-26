
import { sessionBus, Message } from "dbus-next";
import MPRIS2 from "./MediaPlayer2";
const bus = sessionBus();

export async function getPlayerNames(): Promise<string[]> {
	const message = new Message({
		destination: "org.freedesktop.DBus",
		path: "/org/freedesktop/DBus",
		interface: "org.freedesktop.DBus",
		member: "ListNames"
	});
	const reply = await bus.call(message);
	const body: string[] = reply?.body[0].filter(x => x.match(/org\.mpris\.MediaPlayer2/) !== null);
	return body;
}

export async function getPlayer(playerServiceName?): Promise<MPRIS2> {
	const proxy = await bus.getProxyObject(playerServiceName, "/org/mpris/MediaPlayer2");
	return new MPRIS2(proxy);
}

export { marshallVariants } from "./utils";