import { ProxyObject } from "dbus-next";
import EventEmitter from "events";

export default class ProxyAbstraction extends EventEmitter {

	readonly _proxyObject: ProxyObject;

	constructor(proxyObject: ProxyObject) {
		super();
		this._proxyObject = proxyObject;
	}
}