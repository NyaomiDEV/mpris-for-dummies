/// <reference types="node" />
import events from "events";
import dbus from "dbus-next";
export interface MPRIS2 {
    Raise?: () => Promise<void>;
    Quit?: () => Promise<void>;
    canRaise?: Promise<boolean>;
    canQuit?: Promise<boolean>;
    HasTrackList?: Promise<boolean>;
    Identity?: Promise<string>;
    DesktopEntry?: Promise<string>;
    SupportedUriSchemes?: Promise<string[]>;
    SupportedMimeTypes?: Promise<string[]>;
}
export interface MPRIS2Player {
    available: boolean;
    app: MPRIS2;
    Next?: () => Promise<void>;
    Previous?: () => Promise<void>;
    Pause?: () => Promise<void>;
    PlayPause?: () => Promise<void>;
    Stop?: () => Promise<void>;
    Play?: () => Promise<void>;
    Seek?: () => Promise<void>;
    SetPosition?: () => Promise<void>;
    OpenUri?: () => Promise<void>;
    PlaybackStatus?: Promise<string>;
    LoopStatus?: Promise<string>;
    Rate?: Promise<number>;
    Shuffle?: Promise<boolean>;
    Metadata?: Promise<Array<{
        [x: string]: any;
    }>>;
    Volume?: Promise<number>;
    Position?: Promise<BigInt>;
    MinimumRate?: Promise<number>;
    MaximumRate?: Promise<number>;
    CanGoNext?: Promise<boolean>;
    CanGoPrevious?: Promise<boolean>;
    CanPlay?: Promise<boolean>;
    CanPause?: Promise<boolean>;
    CanSeek?: Promise<boolean>;
    CanControl?: Promise<boolean>;
}
export default class Player extends events.EventEmitter implements MPRIS2Player {
    _monitorFunction: (name: string, oldOwner: string, newOwner: string) => void;
    private _proxyObject;
    available: boolean;
    app: MPRIS2;
    constructor(dbusProxy: dbus.ProxyObject);
    dispose(): void;
    private _bindProxyObject;
    static parseMetadataFromVariant(metadata: any): any;
    static basicMetadata(metadata: any): {
        title: any;
        artist: any;
        album: any;
        length: number;
    };
}
//# sourceMappingURL=player.d.ts.map