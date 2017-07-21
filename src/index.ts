import 'reflect-metadata';
import {isArrayClass, isPrimitiveClass} from './libs/utils';
export type Constructor<T> = new (...args: any[]) => T
// const primitivesMap: any = {
//   String: "string",
//   Number: "number",
//   Boolean: "boolean"
// }


/**
 * provide interface to indicate the object is allowed to be traversed
 *
 * @interface
 */
export interface IGenericObject {
  [key: string]: any;
}

const JSON_META_DATA_KEY = 'JsonProperty';

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
  name?: string,
  clazz?: Constructor<T>,
  customConverter?: ICustomConverter,
  excludeToJson?: boolean
}

/**
 * JsonProperty
 *
 * @function
 * @property {IDecoratorMetaData<T>|string} metadata, encapsulate it to DecoratorMetaData for standard use
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
export function JsonProperty<T>(metadata?: IDecoratorMetaData<T> | string): PropertyDecorator {
  let decoratorMetaData: IDecoratorMetaData<T>;
  if (typeof metadata === "string") {
    decoratorMetaData = {name: metadata as string}
  }
  else if (typeof metadata === "object") {
    decoratorMetaData = metadata as IDecoratorMetaData<T>;
  }
  return Reflect.metadata(JSON_META_DATA_KEY, decoratorMetaData);
}

/**
 * getClazz
 *
 * @function
 * @property {any} target object
 * @property {string} propertyKey, used as target property
 * @return {Function} Function/Class indicate the target property type
 * @description Used for type checking, if it is not primitive type, loop inside recursively
 */
export function getClazz<T>(target: T, propertyKey: string): Constructor<T> {
  return Reflect.getMetadata('design:type', target, propertyKey)
}


/**
 * getJsonProperty
 *
 * @function
 * @property {any} target object
 * @property {string} propertyKey, used as target property
 * @return {IDecoratorMetaData<T>} Obtain target property decorator meta data
 */
function getJsonProperty<T>(target: any, propertyKey: string): IDecoratorMetaData<T> {
  return Reflect.getMetadata(JSON_META_DATA_KEY, target, propertyKey);
}


function mapFromJson<T, E>(clazz: Constructor<T>, innerJson: IGenericObject, genericType: Constructor<E>): any {
  if (innerJson == null) {
    return void 0
  }

  if (isArrayClass(clazz)) {
    if (genericType) {
      return innerJson.map(
        (item: any) => deserialize(genericType, item)
      );
    } else {
      return innerJson;
    }
  }

  if (clazz != null) {
    return deserialize(clazz, innerJson);
  }

  return innerJson
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
export function deserialize<T extends IGenericObject>(Clazz: Constructor<T>, json: IGenericObject): T {
  /**
   * As it is a recursive function, ignore any arguments that are unset
   */
  if (Clazz == null || json == null) {
    return void 0;
  }

  // primitive class
  if (isPrimitiveClass(Clazz)) {
    const PrimitiveFactory = Clazz as any
    // if (typeof json !== primitivesMap[PrimitiveFactory.name]) {
    // maybe throw here
    // }
    return PrimitiveFactory(json)
  }

  if (typeof json !== "object") {
    return void 0;
  }

  // if (isArrayClass(Clazz)) {
  //   return mapFromJson(genericType, json, Clazz)
  // }

  let instance = new Clazz();
  Object.keys(instance).forEach((key: string) => {
    // default name = key, if not defined manually
    const decoratorMetaData = {name: key, ...getJsonProperty(instance, key)}
    const innerJson = json[decoratorMetaData.name]
    if (decoratorMetaData.customConverter) {
      instance[key] = decoratorMetaData.customConverter.fromJson(innerJson);
    } else {
      instance[key] = mapFromJson(getClazz(instance, key), innerJson, decoratorMetaData.clazz)
    }
  });

  return instance;
}
