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
const dbus_next_1 = require("dbus-next");
const player_1 = __importDefault(require("./player"));
class PlayerFactory {
    constructor() {
        this.bus = dbus_next_1.sessionBus();
    }
    getPlayerNames() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = new dbus_next_1.Message({
                destination: "org.freedesktop.DBus",
                path: "/org/freedesktop/DBus",
                interface: "org.freedesktop.DBus",
                member: "ListNames"
            });
            const reply = yield this.bus.call(message);
            const body = reply === null || reply === void 0 ? void 0 : reply.body[0].filter(x => x.match(/org\.mpris\.MediaPlayer2/) !== null);
            return body;
        });
    }
    getPlayer(playerServiceName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (playerServiceName === null) {
                const playerNames = yield this.getPlayerNames();
                if (playerNames.length === 0)
                    return undefined;
                playerServiceName = playerNames[0];
            }
            const proxy = yield this.bus.getProxyObject(playerServiceName, "/org/mpris/MediaPlayer2");
            return new player_1.default(proxy);
        });
    }
}
exports.default = PlayerFactory;
//# sourceMappingURL=player_factory.js.map