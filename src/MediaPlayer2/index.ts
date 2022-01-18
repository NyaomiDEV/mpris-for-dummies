import { ClientInterface, ProxyObject } from "dbus-next";
import ProxyAbstraction from "../proxyabstraction";
import { getAllProperties, setProperty } from "../props";
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

		this.Player = new Player(this._proxyObject, props);

		this._init();
	}

	async _init(): Promise<void> {
		const props = marshallVariants(await getAllProperties(this._proxyObject, this._interfaceName));

		this.CanRaise = props.CanRaise;
		this.CanQuit = props.CanQuit;
		this.HasTrackList = props.HasTrackList;
		this.Identity = props.Identity;
		this.DesktopEntry = props.DesktopEntry;
		this.SupportedUriSchemes = props.SupportedUriSchemes;
		this.SupportedMimeTypes = props.SupportedMimeTypes;
		this.CanSetFullscreen = props.CanSetFullscreen;
		this._Fullscreen = props.Fullscreen;

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