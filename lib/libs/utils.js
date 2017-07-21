"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isTargetType(val, type) {
    return typeof val === type;
}
exports.isTargetType = isTargetType;
function isPrimitiveClass(obj) {
    return obj === String || obj === Number || obj === Boolean;
}
exports.isPrimitiveClass = isPrimitiveClass;
function isArrayOrArrayClass(clazz) {
    if (clazz === Array) {
        return true;
    }
    return Object.prototype.toString.call(clazz) === '[object Array]';
}
exports.isArrayOrArrayClass = isArrayOrArrayClass;
function isArrayClass(clazz) {
    return (clazz != null && clazz.prototype != null) && (clazz === Array || clazz.prototype instanceof Array);
}
exports.isArrayClass = isArrayClass;
//# sourceMappingURL=utils.js.map