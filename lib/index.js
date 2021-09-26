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
exports.marshallVariants = exports.getPlayer = exports.getPlayerNames = void 0;
const dbus_next_1 = require("dbus-next");
const MediaPlayer2_1 = __importDefault(require("./MediaPlayer2"));
const bus = dbus_next_1.sessionBus();
function getPlayerNames() {
    return __awaiter(this, void 0, void 0, function* () {
        const message = new dbus_next_1.Message({
            destination: "org.freedesktop.DBus",
            path: "/org/freedesktop/DBus",
            interface: "org.freedesktop.DBus",
            member: "ListNames"
        });
        const reply = yield bus.call(message);
        const body = reply === null || reply === void 0 ? void 0 : reply.body[0].filter(x => x.match(/org\.mpris\.MediaPlayer2/) !== null);
        return body;
    });
}
exports.getPlayerNames = getPlayerNames;
function getPlayer(playerServiceName) {
    return __awaiter(this, void 0, void 0, function* () {
        const proxy = yield bus.getProxyObject(playerServiceName, "/org/mpris/MediaPlayer2");
        return new MediaPlayer2_1.default(proxy);
    });
}
exports.getPlayer = getPlayer;
var utils_1 = require("./utils");
Object.defineProperty(exports, "marshallVariants", { enumerable: true, get: function () { return utils_1.marshallVariants; } });
//# sourceMappingURL=index.js.map