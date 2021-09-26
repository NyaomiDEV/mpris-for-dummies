"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
class ProxyAbstraction extends events_1.default {
    constructor(proxyObject) {
        super();
        this._proxyObject = proxyObject;
    }
}
exports.default = ProxyAbstraction;
//# sourceMappingURL=proxyabstraction.js.map