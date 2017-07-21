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
    if (utils_1.isTargetType(metadata, 'string')) {
        decoratorMetaData = { name: metadata };
    }
    else if (utils_1.isTargetType(metadata, 'object')) {
        decoratorMetaData = metadata;
    }
    return Reflect.metadata(JSON_META_DATA_KEY, decoratorMetaData);
}
exports.JsonProperty = JsonProperty;
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
function mapFromJson(decoratorMetadata, instance, json, key) {
    var decoratorName = decoratorMetadata.name;
    var innerJson = json && json[decoratorName];
    if (innerJson == null) {
        return void 0;
    }
    var clazz = getClazz(instance, key);
    if (utils_1.isArrayClass(clazz)) {
        var metadata_1 = getJsonProperty(instance, key);
        if (metadata_1 && metadata_1.clazz) {
            return innerJson.map(function (item) { return deserialize(metadata_1.clazz, item); });
        }
        else {
            return innerJson;
        }
    }
    if (clazz != null) {
        return deserialize(clazz, innerJson);
    }
    return json ? json[decoratorName] : undefined;
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
    // support for primitive Constructors to ensure primitive types values in targeted class
    if (utils_1.isPrimitiveClass(Clazz)) {
        var PrimitiveFactory = Clazz;
        // if (typeof json !== primitivesMap[PrimitiveFactory.name]) {
        // maybe throw here
        // }
        return PrimitiveFactory(json);
    }
    if (!utils_1.isTargetType(json, 'object')) {
        return void 0;
    }
    var instance = new Clazz();
    Object.keys(instance).forEach(function (key) {
        // default name = key, if not defined manually
        var decoratorMetaData = __assign({ name: key }, getJsonProperty(instance, key));
        if (decoratorMetaData.customConverter) {
            instance[key] = decoratorMetaData.customConverter.fromJson(json[decoratorMetaData.name]);
        }
        else {
            instance[key] = mapFromJson(decoratorMetaData, instance, json, key);
        }
    });
    return instance;
}
exports.deserialize = deserialize;
//# sourceMappingURL=index.js.map