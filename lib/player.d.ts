/// <reference types="node" />
import events from "events";
export default class Player extends events.EventEmitter {
    _monitorFunction: (name: string, oldOwner: string, newOwner: string) => void;
    available: boolean;
    constructor(dbusProxy: any);
    dispose(): void;
    static parseMetadata_raw(metadata: any): {};
    static parseMetadata_tidy(metadataRaw: any): any;
    static basicMetadata(metadataTidy: any): {
        title: any;
        artist: any;
        album: any;
        duration: any;
    };
}
//# sourceMappingURL=player.d.ts.map