export function isPrimitiveClass(obj: any): boolean {
  return obj === String || obj === Number || obj === Boolean
}

export function isArrayClass(clazz: Function): boolean {
  return (clazz != null && clazz.prototype != null) && (clazz === Array || clazz.prototype instanceof Array)
}
