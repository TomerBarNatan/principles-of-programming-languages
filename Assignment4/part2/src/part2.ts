/* 2.1 */
export const MISSING_KEY = '___MISSING___'

type PromisedStore<K, V> = {
    get(key: K): Promise<V>,
    set(key: K, value: V): Promise<void>,
    delete(key: K): Promise<void>
}


export function makePromisedStore<K, V>(): PromisedStore<K, V> {
    let store: Map<K,V> = new Map();
    return {
        get(key: K) {return new Promise<V> (function(resolve, reject){
            const val : V| undefined = store.get(key);
            val === undefined ? reject(MISSING_KEY) : resolve(val);
            })}
        ,
        set(key: K, value: V) {
            return new Promise<void> (function(resolve, reject){
                store.set(key,value)
                resolve();
            })
        },
        delete(key: K) {
            return new Promise<void> (function(resolve, reject){
                if(store.has(key)){
                    store.delete(key);
                    resolve();
                }
                else{
                    reject(MISSING_KEY);
                }
            })
        },
    }
}

export function getAll<K, V>(store: PromisedStore<K, V>, keys: K[]): Promise<V[]> {
    if(keys.length === 0){
        return new Promise <V[]> (function(resolve, reject){
            resolve([]);
        })}
    return getAll(store, keys.slice(1)).then(arr => store.get(keys[0]).then(val => [val].concat(arr)).catch());
}

/* 2.2 */


export function asycMemo<T, R>(f: (param: T) => R): (param: T) => Promise<R> {
    let store: PromisedStore<T,R> = makePromisedStore();
    return async (p: T) : Promise<R> => {
        try{
            const val: R  = await store.get(p);
            return val;
        }
        catch{
            store.set(p, f(p));
            return await store.get(p);
        }
    }
}

/* 2.3 */

export function lazyFilter<T>(genFn: () => Generator<T>, filterFn: (x: T) => boolean): () => Generator<T> { 
    const gen : Generator<T> = genFn();
    return function * (): Generator<T>{
        let next_val = gen.next();
        while(!next_val.done){
            if(filterFn(next_val.value)){
                yield next_val.value;
            }
            next_val = gen.next();
        }
    }
}

export function lazyMap<T, R>(genFn: () => Generator<T>, mapFn: (x: T) => R): () => Generator<R> {
    const gen : Generator<T> = genFn();
    return function * (): Generator<R>{
        let next_val = gen.next();
        while(!next_val.done){
            yield mapFn(next_val.value);
            next_val = gen.next();
        }
    }
}

/* 2.4 */
// you can use 'any' in this question

export async function asyncWaterfallWithRetry(fns: [() => Promise<any>, ...((x: any) => Promise<any>)[]]): Promise<any> {
    let val: any = undefined;
    try{
        val = await fns[0]();
    }
    catch{
        try{
            const hello = await new Promise((resolve) => {
                setTimeout(() => resolve("resolves"), 2000)});
            hello;
            val = await fns[0]()
        }
        catch{
            const hello = await new Promise((resolve) => {
                setTimeout(() => resolve("resolves"), 2000)});
            hello;
            val = await fns[0]()
        }
    }
    for(let fn of fns.slice(1)){
        try{
        val = await fn(val);
        }catch{
            try{
                const hello = await new Promise((resolve) => {
                    setTimeout(() => resolve("resolves"), 2000)});
                hello;
                val = await fn(val);
            }
            catch{
                const hello = await new Promise((resolve) => {
                    setTimeout(() => resolve("resolves"), 2000)});
                hello;
                val = await fn(val);
            }
        }
    }
    return val;
}