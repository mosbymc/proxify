import { createObjectProxy, createArrayProxy, createFunctionProxy } from './proxyCreators';

/** Main entry point for proxify.
 * Takes in an array, function, or object and returns its proxified version.
 * For all other types, does nothing and just returns what was passed in.
 * @param {Array|Object|function} target - The object to be proxified.
 * @param {Object} settings - The settings for the proxy
 * @returns {Proxy|*} The proxified target.
 */
function proxify(target) {
    // delegate to appropriate factory
    if (Array.isArray(target)) {
        return createArrayProxy(target);
    } else if ('function' === typeof target) {
        return createFunctionProxy(target);
    } else if (null !== target && 'object' === typeof target) {
        return createObjectProxy(target);
    }

    // no proxification, return target
    return target;
}

export { proxify };