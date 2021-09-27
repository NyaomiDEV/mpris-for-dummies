import { ClientInterface, ProxyObject } from "dbus-next";
import ProxyAbstraction from "../proxyabstraction";
import { MetadataMap } from "../types";
import { getProperty, setProperty } from "../props";
import { marshallVariants } from "../utils";

export default class Player extends ProxyAbstraction {

	private _interfaceName: string = "org.mpris.MediaPlayer2.Player";
	private _interface: ClientInterface;
	private _ready: boolean = false;

	PlaybackStatus: "Playing" | "Paused" | "Stopped" = "Stopped";
	MinimumRate: number = 1;
	MaximumRate: number = 1;
	Metadata: MetadataMap = {};
	// eslint-disable-next-line no-undef
	
	CanGoNext: boolean = false;
	CanGoPrevious: boolean = false;
	CanPlay: boolean = false;
	CanPause: boolean = false;
	CanSeek: boolean = false;
	CanControl: boolean = false;

	private _LoopStatus: "None" | "Track" | "Playlist" = "None";
	private _Rate: number = 1;
	private _Shuffle: boolean = false;
	private _Volume: number = 0;

	constructor(proxyObject: ProxyObject, propsIface: ClientInterface) {
		super(proxyObject);
		this._interface = this._proxyObject.getInterface(this._interfaceName);

		propsIface.on("PropertiesChanged", (iface, changed, invalidated) => {
			if (iface !== "org.mpris.MediaPlayer2.Player") return;

			for (let key in changed) {
				const value = changed[key];
				switch(key){
					case "LoopStatus": key = "_LoopStatus"; break;
					case "Rate": key = "_Rate"; break;
					case "Shuffle": key = "_Shuffle"; break;
					case "Volume": key = "_Volume"; break;
				}
				this[key] = marshallVariants(value);
			}

			for (let key of invalidated) {
				switch (key) {
					case "LoopStatus": key = "_LoopStatus"; break;
					case "Rate": key = "_Rate"; break;
					case "Shuffle": key = "_Shuffle"; break;
					case "Volume": key = "_Volume"; break;
				}
				delete this[key];
			}

			this.emit("PropertiesChanged", marshallVariants(changed), invalidated);
		});

		// eslint-disable-next-line no-undef
		this._interface.on("Seeked", (position: BigInt) => this.emit("Seeked", position));

		this._init();
	}

	async _init(): Promise<void> {
		this.PlaybackStatus = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "PlaybackStatus"));
		this._LoopStatus = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "LoopStatus"));
		this._Rate = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "Rate"));
		this._Shuffle = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "Shuffle"));
		this._Volume = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "Volume"));
		this.Metadata = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "Metadata"));
		this.CanGoNext = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "CanGoNext"));
		this.CanGoPrevious = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "CanGoPrevious"));
		this.CanPause = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "CanPause"));
		this.CanPlay = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "CanPlay"));
		this.CanSeek = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "CanSeek"));
		this.CanControl = marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "CanControl"));

		this._ready = true;
	}

	async whenReady(): Promise<void> {
		while (!this._ready)
			await new Promise(resolve => setTimeout(resolve, 100));
		return;
	}

	async Next(): Promise<void> {
		await this._interface.Next();
	}

	async Previous(): Promise<void> {
		await this._interface.Previous();
	}

	async Pause(): Promise<void> {
		await this._interface.Pause();
	}

	async PlayPause(): Promise<void> {
		await this._interface.PlayPause();
	}

	async Stop(): Promise<void> {
		await this._interface.Stop();
	}

	async Play(): Promise<void> {
		await this._interface.Play();
	}

	async Seek(offset: number): Promise<void> {
		await this._interface.Seek(offset);
	}

	// eslint-disable-next-line no-undef
	async SetPosition(trackId: string, offset: BigInt): Promise<void> {
		await this._interface.SetPosition(trackId, offset);
	}

	// eslint-disable-next-line no-undef
	async GetPosition(): Promise<BigInt> {
		return marshallVariants(await getProperty(this._proxyObject, this._interfaceName, "Position"));
	}

	async OpenUri(uri: string): Promise<void> {
		await this._interface.OpenUri(uri);
	}

	get LoopStatus(): "None" | "Track" | "Playlist" {
		return this._LoopStatus;
	}

	set LoopStatus(value: "None" | "Track" | "Playlist") {
		this._LoopStatus = value;
		setProperty(
			this._proxyObject,
			this._interfaceName,
			"LoopStatus",
			"s",
			value
		);
	}

	get Rate(): number {
		return this._Rate;
	}

	set Rate(value: number) {
		this._Rate = value;
		setProperty(
			this._proxyObject,
			this._interfaceName,
			"Rate",
			"d",
			value
		);
	}

	get Shuffle(): boolean {
		return this._Shuffle;
	}

	set Shuffle(value: boolean) {
		this._Shuffle = value;
		setProperty(
			this._proxyObject,
			this._interfaceName,
			"Shuffle",
			"b",
			value
		);
	}

	get Volume(): number {
		return this._Volume;
	}

	set Volume(value: number) {
		this._Volume = value;
		setProperty(
			this._proxyObject,
			this._interfaceName,
			"Volume",
			"d",
			value
		);
	}
}