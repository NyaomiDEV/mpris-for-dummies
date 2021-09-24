/// <reference types="node" />
import events from "events";
declare type MPRIS2 = {
    Raise: () => void;
    Quit: () => void;
    canRaise: boolean;
    canQuit: boolean;
    HasTrackList: boolean;
    Identity: string;
    DesktopEntry: string;
    SupportedUriSchemes: string[];
    SupportedMimeTypes: string[];
};
export default class Player extends events.EventEmitter {
    _monitorFunction: (name: string, oldOwner: string, newOwner: string) => void;
    available: boolean;
    app: Partial<MPRIS2>;
    constructor(dbusProxy: any);
    dispose(): void;
    static parseMetadataFromVariant(metadata: any): any;
    static basicMetadata(metadata: any): {
        title: any;
        artist: any;
        album: any;
        length: number;
    };
}
export {};
//# sourceMappingURL=player.d.ts.map