import 'reflect-metadata';
export declare type Constructor<T> = new (...args: any[]) => T;
/**
 * provide interface to indicate the object is allowed to be traversed
 *
 * @interface
 */
export interface IGenericObject {
    [key: string]: any;
}
/**
 * When custom mapping of a property is required.
 *
 * @interface
 */
export interface ICustomConverter {
    fromJson(data: any): any;
}
/**
 * IDecoratorMetaData<T>
 * DecoratorConstraint
 *
 * @interface
 * @property {ICustomConverter} customConverter, will be used for mapping the property, if specified
 * @property {boolean} excludeToJson, will exclude the property for serialization, if true
 */
export interface IDecoratorMetaData<T> {
    name?: string;
    clazz?: Constructor<T>;
    customConverter?: ICustomConverter;
    excludeToJson?: boolean;
}
/**
 * JsonProperty
 *
 * @function
 * @property {IDecoratorMetaData<T>|string} metadata, encapsulate it to DecoratorMetaData for standard use
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
export declare function JsonProperty<T>(metadata?: IDecoratorMetaData<T> | string): PropertyDecorator;
export declare const dummyDecorator: PropertyDecorator;
/**
 * getClazz
 *
 * @function
 * @property {any} target object
 * @property {string} propertyKey, used as target property
 * @return {Function} Function/Class indicate the target property type
 * @description Used for type checking, if it is not primitive type, loop inside recursively
 */
export declare function getClazz<T>(target: T, propertyKey: string): Constructor<T>;
/**
 * deserialize
 *
 * @function
 * @param {Constructor<T>} Clazz, class type which is going to initialize and hold a mapping json
 * @param {Object} json, input json object which to be mapped
 *
 * @return {T} return mapped object
 */
export declare function deserialize<T extends IGenericObject>(Clazz: Constructor<T>, json: IGenericObject): T;
