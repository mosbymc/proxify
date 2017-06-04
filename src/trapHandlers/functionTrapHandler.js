import { coreTrapHandler } from './coreTrapHandler';

var functionTrapHandler  = Object.create(coreTrapHandler, {
    /**
     * Trap for a function call.
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/apply}
     * @param {Object} target - The target object.
     * @param {Object} thisArg - The this argument for a function call.
     * @param {Array} argumentsList - The list of arguments for the call.
     * @returns {*} The return value of the function.
     */
    apply: {
        value: function _apply(target, thisArg, argumentsList) {
            this.onTrap('apply', target, thisArg, argumentsList);
            return Reflect.apply(target, thisArg, argumentsList);
        }
    },

    /**
     * Trap for the new operator.
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/construct}
     * @param {Object} target - The target object.
     * @param {Array} argumentsList - The list of arguments for the call.
     * @returns {Object} The new object.
     */
    construct: {
        value: function _construct(target, argumentsList) {
            this.onTrap('construct', target, argumentsList);
            return Reflect.construct(target, argumentsList);
        }
    }
});

export { functionTrapHandler };