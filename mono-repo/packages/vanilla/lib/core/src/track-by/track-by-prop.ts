export function trackByProp<T>(prop: keyof T): (_: number, item: T) => T[keyof T] {
    return (_: number, item: T) => item[prop];
}
