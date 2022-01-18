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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProperty = exports.getAllProperties = exports.getProperty = void 0;
const dbus_next_1 = require("dbus-next");
function getProperty(proxyObject, iface, property) {
    return __awaiter(this, void 0, void 0, function* () {
        const props = proxyObject.getInterface("org.freedesktop.DBus.Properties");
        let result;
        try {
            result = yield props.Get(iface, property);
        }
        catch (_) {
            result = undefined;
        }
        return result;
    });
}
exports.getProperty = getProperty;
function getAllProperties(proxyObject, iface) {
    return __awaiter(this, void 0, void 0, function* () {
        const props = proxyObject.getInterface("org.freedesktop.DBus.Properties");
        let result;
        try {
            result = yield props.GetAll(iface);
        }
        catch (_) {
            result = undefined;
        }
        return result;
    });
}
exports.getAllProperties = getAllProperties;
function setProperty(proxyObject, iface, property, signature, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const props = proxyObject.getInterface("org.freedesktop.DBus.Properties");
        const variant = new dbus_next_1.Variant();
        variant.signature = signature;
        variant.value = value;
        return yield props.Set(iface, property, variant);
    });
}
exports.setProperty = setProperty;
//# sourceMappingURL=props.js.map