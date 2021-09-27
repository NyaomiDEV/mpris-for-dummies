import { ClientInterface, ProxyObject } from "dbus-next";
import ProxyAbstraction from "../proxyabstraction";
import { getProperty, setProperty } from "../props";
import Player from "./player";
import { marshallVariants } from "../utils";

export default class MediaPlayer2 extends ProxyAbstraction{

	private _interfaceName: string = "org.mpris.MediaPlayer2";
	private _interface: ClientInterface;

	private _ready: boolean = false;

	CanRaise: boolean = false;
	CanQuit: boolean = false;
	CanSetFullscreen: boolean = false;
	HasTrackList: boolean = false;
	Identity: string = "";
	DesktopEntry: string = "";
	SupportedUriSchemes: string[] = [];
	SupportedMimeTypes: string[] = [];

	private _Fullscreen: boolean = false;

	Player: Player;

	constructor(proxyObject: ProxyObject){
		super(proxyObject);
		this._interface = this._proxyObject.getInterface(this._interfaceName);

		const props = this._proxyObject.getInterface("org.freedesktop.DBus.Properties");
		props.on("PropertiesChanged", (iface, changed, invalidated) => {
			if (iface !== "org.mpris.MediaPlayer2") return;

			for (let key in changed){
				const value = changed[key];
				if(key === "Fullscreen") key = "_Fullscreen";
				this[key] = marshallVariants(value);
			}

			for (let key of invalidated){
				if (key === "Fullscreen") key = "_Fullscreen";
				delete this[key];
			}

			this.emit("PropertiesChanged", marshallVariants(changed), invalidated);
		});

		this._init();
		this.Player = new Player(this._proxyObject, props);
	}

	async _init(): Promise<void> {
		this.CanRaise = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "CanRaise"));
		this.CanQuit = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "CanQuit"));
		this.CanSetFullscreen = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "CanSetFullscreen"));
		this.HasTrackList = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "HasTrackList"));
		this.Identity = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "Identity"));
		this.DesktopEntry = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "DesktopEntry"));
		this.SupportedUriSchemes = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "SupportedUriSchemes"));
		this.SupportedMimeTypes = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "SupportedMimeTypes"));
		this._Fullscreen = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "Fullscreen"));

		await this.Player.whenReady();
		this._ready = true;
	}

	async whenReady(): Promise<void> {
		while(!this._ready)
			await new Promise(resolve => setTimeout(resolve, 100));
		return;
	}

	async Raise(): Promise<void> {
		await this._interface.Raise();
	}

	async Quit(): Promise<void> {
		await this._interface.Quit();
	}

	get Fullscreen(): boolean {
		return this._Fullscreen;
	}

	set Fullscreen(value: boolean) {
		this._Fullscreen = value;
		setProperty(
			this._proxyObject,
			this._interfaceName,
			"Fullscreen",
			"b",
			value
		);
	}
} 