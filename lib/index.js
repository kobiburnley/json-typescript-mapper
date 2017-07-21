"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var utils_1 = require("./libs/utils");
var JSON_META_DATA_KEY = 'JsonProperty';
/**
 * JsonProperty
 *
 * @function
 * @property {IDecoratorMetaData<T>|string} metadata, encapsulate it to DecoratorMetaData for standard use
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
function JsonProperty(metadata) {
    var decoratorMetaData;
    if (typeof metadata === "string") {
        decoratorMetaData = { name: metadata };
    }
    else if (typeof metadata === "object") {
        decoratorMetaData = metadata;
    }
    return Reflect.metadata(JSON_META_DATA_KEY, decoratorMetaData);
}
exports.JsonProperty = JsonProperty;
// using this to make typescript emit design type metadata decorators
exports.dummyDecorator = function (target, propertyKey) { return void 0; };
/**
 * getClazz
 *
 * @function
 * @property {any} target object
 * @property {string} propertyKey, used as target property
 * @return {Function} Function/Class indicate the target property type
 * @description Used for type checking, if it is not primitive type, loop inside recursively
 */
function getClazz(target, propertyKey) {
    return Reflect.getMetadata('design:type', target, propertyKey);
}
exports.getClazz = getClazz;
/**
 * getJsonProperty
 *
 * @function
 * @property {any} target object
 * @property {string} propertyKey, used as target property
 * @return {IDecoratorMetaData<T>} Obtain target property decorator meta data
 */
function getJsonProperty(target, propertyKey) {
    return Reflect.getMetadata(JSON_META_DATA_KEY, target, propertyKey);
}
function mapFromJson(clazz, innerJson, genericType) {
    if (innerJson == null) {
        return void 0;
    }
    if (utils_1.isArrayClass(clazz)) {
        if (genericType) {
            return innerJson.map(function (item) { return deserialize(genericType, item); });
        }
        else {
            return innerJson;
        }
    }
    if (clazz != null) {
        return deserialize(clazz, innerJson);
    }
    return innerJson;
}
/**
 * deserialize
 *
 * @function
 * @param {Constructor<T>} Clazz, class type which is going to initialize and hold a mapping json
 * @param {Object} json, input json object which to be mapped
 *
 * @return {T} return mapped object
 */
function deserialize(Clazz, json) {
    /**
     * As it is a recursive function, ignore any arguments that are unset
     */
    if (Clazz == null || json == null) {
        return void 0;
    }
    // primitive class
    if (utils_1.isPrimitiveClass(Clazz)) {
        var PrimitiveFactory = Clazz;
        // if (typeof json !== primitivesMap[PrimitiveFactory.name]) {
        // maybe throw here
        // }
        return PrimitiveFactory(json);
    }
    if (typeof json !== "object") {
        return void 0;
    }
    // if (isArrayClass(Clazz)) {
    //   return mapFromJson(genericType, json, Clazz)
    // }
    var instance = new Clazz();
    Object.keys(instance).forEach(function (key) {
        // default name = key, if not defined manually
        var decoratorMetaData = __assign({ name: key }, getJsonProperty(instance, key));
        var innerJson = json[decoratorMetaData.name];
        if (decoratorMetaData.customConverter) {
            instance[key] = decoratorMetaData.customConverter.fromJson(innerJson);
        }
        else {
            instance[key] = mapFromJson(getClazz(instance, key), innerJson, decoratorMetaData.clazz);
        }
    });
    return instance;
}
exports.deserialize = deserialize;
//# sourceMappingURL=index.js.map