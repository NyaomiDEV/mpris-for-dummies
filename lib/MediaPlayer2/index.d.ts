import { ProxyObject } from "dbus-next";
import ProxyAbstraction from "../proxyabstraction";
import Player from "./player";
export default class MediaPlayer2 extends ProxyAbstraction {
    private _interfaceName;
    private _interface;
    private _ready;
    CanRaise: boolean;
    CanQuit: boolean;
    CanSetFullscreen: boolean;
    HasTrackList: boolean;
    Identity: string;
    DesktopEntry: string;
    SupportedUriSchemes: string[];
    SupportedMimeTypes: string[];
    private _Fullscreen;
    Player: Player;
    private propsListener;
    constructor(proxyObject: ProxyObject);
    destruct(): void;
    _init(): Promise<void>;
    whenReady(): Promise<void>;
    Raise(): Promise<void>;
    Quit(): Promise<void>;
    get Fullscreen(): boolean;
    set Fullscreen(value: boolean);
}
//# sourceMappingURL=index.d.ts.map