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
const player_1 = __importDefault(require("./player"));
const utils_1 = require("../utils");
class MediaPlayer2 extends proxyabstraction_1.default {
    constructor(proxyObject) {
        super(proxyObject);
        this._interfaceName = "org.mpris.MediaPlayer2";
        this._ready = false;
        this.CanRaise = false;
        this.CanQuit = false;
        this.CanSetFullscreen = false;
        this.HasTrackList = false;
        this.Identity = "";
        this.DesktopEntry = "";
        this.SupportedUriSchemes = [];
        this.SupportedMimeTypes = [];
        this._Fullscreen = false;
        this.propsListener = (iface, changed, invalidated) => {
            if (iface !== "org.mpris.MediaPlayer2")
                return;
            for (let key in changed) {
                const value = changed[key];
                if (key === "Fullscreen")
                    key = "_Fullscreen";
                this[key] = (0, utils_1.marshallVariants)(value);
            }
            for (let key of invalidated) {
                if (key === "Fullscreen")
                    key = "_Fullscreen";
                delete this[key];
            }
            this.emit("PropertiesChanged", (0, utils_1.marshallVariants)(changed), invalidated);
        };
        this._interface = this._proxyObject.getInterface(this._interfaceName);
        const props = this._proxyObject.getInterface("org.freedesktop.DBus.Properties");
        props.on("PropertiesChanged", this.propsListener);
        this.Player = new player_1.default(this._proxyObject);
        this._init();
    }
    destruct() {
        this.Player.destruct();
        this.removeAllListeners();
        const props = this._proxyObject.getInterface("org.freedesktop.DBus.Properties");
        props.removeListener("PropertiesChanged", this.propsListener);
    }
    _init() {
        return __awaiter(this, void 0, void 0, function* () {
            const props = (0, utils_1.marshallVariants)(yield (0, props_1.getAllProperties)(this._proxyObject, this._interfaceName));
            this.CanRaise = props.CanRaise;
            this.CanQuit = props.CanQuit;
            this.HasTrackList = props.HasTrackList;
            this.Identity = props.Identity;
            this.DesktopEntry = props.DesktopEntry;
            this.SupportedUriSchemes = props.SupportedUriSchemes;
            this.SupportedMimeTypes = props.SupportedMimeTypes;
            this.CanSetFullscreen = props.CanSetFullscreen;
            this._Fullscreen = props.Fullscreen;
            yield this.Player.whenReady();
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
    Raise() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.Raise();
        });
    }
    Quit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._interface.Quit();
        });
    }
    get Fullscreen() {
        return this._Fullscreen;
    }
    set Fullscreen(value) {
        this._Fullscreen = value;
        (0, props_1.setProperty)(this._proxyObject, this._interfaceName, "Fullscreen", "b", value);
    }
}
exports.default = MediaPlayer2;
//# sourceMappingURL=index.js.map