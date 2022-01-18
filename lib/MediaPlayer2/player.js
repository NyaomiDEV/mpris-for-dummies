"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const proxyabstraction_1 = __importDefault(require("../proxyabstraction"));
const props_1 = require("../props");
const utils_1 = require("../utils");
class Player extends proxyabstraction_1.default {
    constructor(proxyObject, propsIface) {
        super(proxyObject);
        this._interfaceName = "org.mpris.MediaPlayer2.Player";
        this._ready = false;
        this.PlaybackStatus = "Stopped";
        this.MinimumRate = 1;
        this.MaximumRate = 1;
        this.Metadata = {};
        this.CanGoNext = false;
        this.CanGoPrevious = false;
        this.CanPlay = false;
        this.CanPause = false;
        this.CanSeek = false;
        this.CanControl = false;
        this._LoopStatus = "None";
        this._Rate = 1;
        this._Shuffle = false;
        this._Volume = 0;
        this._interface = this._proxyObject.getInterface(this._interfaceName);
        propsIface.on("PropertiesChanged", (iface, changed, invalidated) => {
            if (iface !== "org.mpris.MediaPlayer2.Player")
                return;
            for (let key in changed) {
                const value = changed[key];
                switch (key) {
                    case "LoopStatus":
                        key = "_LoopStatus";
                        break;
                    case "Rate":
                        key = "_Rate";
                        break;
                    case "Shuffle":
                        key = "_Shuffle";
                        break;
                    case "Volume":
                        key = "_Volume";
                        break;
                }
                this[key] = utils_1.marshallVariants(value);
            }
            for (let key of invalidated) {
                switch (key) {
                    case "LoopStatus":
                        key = "_LoopStatus";
                        break;
                    case "Rate":
                        key = "_Rate";
                        break;
                    case "Shuffle":
                        key = "_Shuffle";
                        break;
                    case "Volume":
                        key = "_Volume";
                        break;
                }
                delete this[key];
            }
            this.emit("PropertiesChanged", utils_1.marshallVariants(changed), invalidated);
        });
        this._interface.on("Seeked", (position) => this.emit("Seeked", position));
        this._init();
    }
    _init() {
        return __awaiter(this, void 0, void 0, function* () {
            const props = utils_1.marshallVariants(yield props_1.getAllProperties(this._proxyObject, this._interfaceName));
            this.PlaybackStatus = props.PlaybackStatus;
            this._LoopStatus = props.LoopStatus;
            this._Rate = props.Rate;
            this._Shuffle = props.Shuffle;
            this._Volume = props.Volume;
            this.Metadata = props.Metadata;
            this.CanGoNext = props.CanGoNext;
            this.CanGoPrevious = props.CanGoPrevious;
            this.CanPause = props.CanPause;
            this.CanPlay = props.CanPlay;
            this.CanSeek = props.CanSeek;
            this.CanControl = props.CanControl;
            this._ready = true;
        });
    }
    whenReady() {
        return __awaiter(this, void 0, void 0, function* () {
            while (!this._ready)
                yield new Promise(resolve => setTimeout(resolve, 100));
            return;
        });
    }
    Next() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.Next();
        });
    }
    Previous() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.Previous();
        });
    }
    Pause() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.Pause();
        });
    }
    PlayPause() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.PlayPause();
        });
    }
    Stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.Stop();
        });
    }
    Play() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.Play();
        });
    }
    Seek(offset) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.Seek(offset);
        });
    }
    SetPosition(trackId, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.SetPosition(trackId, offset);
        });
    }
    GetPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            return utils_1.marshallVariants(yield props_1.getProperty(this._proxyObject, this._interfaceName, "Position"));
        });
    }
    OpenUri(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.OpenUri(uri);
        });
    }
    get LoopStatus() {
        return this._LoopStatus;
    }
    set LoopStatus(value) {
        this._LoopStatus = value;
        props_1.setProperty(this._proxyObject, this._interfaceName, "LoopStatus", "s", value);
    }
    get Rate() {
        return this._Rate;
    }
    set Rate(value) {
        this._Rate = value;
        props_1.setProperty(this._proxyObject, this._interfaceName, "Rate", "d", value);
    }
    get Shuffle() {
        return this._Shuffle;
    }
    set Shuffle(value) {
        this._Shuffle = value;
        props_1.setProperty(this._proxyObject, this._interfaceName, "Shuffle", "b", value);
    }
    get Volume() {
        return this._Volume;
    }
    set Volume(value) {
        this._Volume = value;
        props_1.setProperty(this._proxyObject, this._interfaceName, "Volume", "d", value);
    }
}
exports.default = Player;
//# sourceMappingURL=player.js.map