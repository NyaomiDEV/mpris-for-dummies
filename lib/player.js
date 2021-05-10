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
const events_1 = __importDefault(require("events"));
const dbus_next_1 = __importDefault(require("dbus-next"));
class Player extends events_1.default.EventEmitter {
    constructor(dbusProxy) {
        super();
        this.available = true;
        this._monitorFunction = (name, oldOwner, newOwner) => {
            if (name === dbusProxy.name) {
                if (oldOwner === "") {
                    this.available = true;
                    this.emit("connected");
                }
                else if (newOwner === "") {
                    this.available = false;
                    this.emit("disconnected");
                }
            }
        };
        dbus_next_1.default.sessionBus().getProxyObject("org.freedesktop.DBus", "/org/freedesktop/DBus").then((dbusPO) => __awaiter(this, void 0, void 0, function* () {
            const iface = yield dbusPO.getInterface("org.freedesktop.DBus");
            iface.on("NameOwnerChanged", this._monitorFunction);
        }));
        const player = dbusProxy.getInterface("org.mpris.MediaPlayer2.Player");
        const props = dbusProxy.getInterface("org.freedesktop.DBus.Properties");
        console.log(player);
        for (let method of player.$methods) {
            Object.defineProperty(this, method.name, {
                get: () => player[method.name]
            });
        }
        for (let property of player.$properties) {
            const binder = {};
            binder.get = () => __awaiter(this, void 0, void 0, function* () {
                const result = yield props.Get("org.mpris.MediaPlayer2.Player", property.name);
                if (property.type === "a{sv}") {
                    let obj = {};
                    for (let key in result.value)
                        obj[key] = result.value[key].value;
                    result.value = obj;
                }
                return result.value;
            });
            if (property.access === "readwrite") {
                binder.set = (value) => __awaiter(this, void 0, void 0, function* () {
                    const variant = new dbus_next_1.default.Variant();
                    variant.signature = property.type;
                    variant.value = value;
                    return props.Set("org.mpris.MediaPlayer2.Player", property.name, variant);
                });
            }
            Object.defineProperty(this, property.name, binder);
        }
        props.on("PropertiesChanged", (_iface, changed) => {
            if (changed.Metadata) {
                let _changed = Player.parseMetadataFromVariant(changed.Metadata.value);
                this.emit("musicChanged", _changed);
            }
            else if (changed.PlaybackStatus)
                this.emit("playbackStatusChanged", changed.PlaybackStatus.value);
            else {
                for (let key in changed)
                    this.emit("propertyChanged", key, changed[key].value);
            }
        });
        player.on("Seeked", (seekedToPos) => {
            this.emit("seeked", Number(seekedToPos) / 1000000);
        });
    }
    dispose() {
        this.removeAllListeners();
        dbus_next_1.default.sessionBus().getProxyObject("org.freedesktop.DBus", "/org/freedesktop/DBus").then((dbusPO) => __awaiter(this, void 0, void 0, function* () {
            const iface = yield dbusPO.getInterface("org.freedesktop.DBus");
            iface.removeListener("NameOwnerChanged", this._monitorFunction);
        }));
    }
    static parseMetadataFromVariant(metadata) {
        if (typeof metadata == "undefined" || Object.keys(metadata).length === 0)
            return {};
        const parsed = {};
        for (let key in metadata)
            parsed[key] = metadata[key].value;
        return parsed;
    }
    static basicMetadata(metadata) {
        return {
            title: metadata["xesam:title"],
            artist: metadata["xesam:artist"].join("; "),
            album: metadata["xesam:album"],
            length: Number(metadata["mpris:length"]) / 1000000
        };
    }
}
exports.default = Player;
//# sourceMappingURL=player.js.map