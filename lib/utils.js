"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marshallVariants = void 0;
const dbus_next_1 = require("dbus-next");
function marshallVariants(object) {
    if (object instanceof dbus_next_1.Variant)
        return marshallVariants(object.value);
    if (typeof object === "object" && object !== null) {
        for (let i in object)
            object[i] = marshallVariants(object[i]);
    }
    return object;
}
exports.marshallVariants = marshallVariants;
//# sourceMappingURL=utils.js.map