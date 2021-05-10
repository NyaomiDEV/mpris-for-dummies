/// <reference types="node" />
import events from "events";
export default class Player extends events.EventEmitter {
    _monitorFunction: (name: string, oldOwner: string, newOwner: string) => void;
    available: boolean;
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
//# sourceMappingURL=player.d.ts.map