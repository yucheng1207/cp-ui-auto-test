/**
 * 创建一个单例
 * @param Fn
 * @returns
 */
export function createSingleton<T>(Fn: new (...args: any[]) => T) {
    let instance: T | null = null;

    return function (...args: any[]) {
        if (!instance) {
        instance = new Fn(...args);
        }
        return instance;
    };
}
