"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPrimitiveClass(obj) {
    return obj === String || obj === Number || obj === Boolean;
}
exports.isPrimitiveClass = isPrimitiveClass;
function isArrayClass(clazz) {
    return (clazz != null && clazz.prototype != null) && (clazz === Array || clazz.prototype instanceof Array);
}
exports.isArrayClass = isArrayClass;
//# sourceMappingURL=utils.js.map