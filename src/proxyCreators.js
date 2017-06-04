import { coreTrapHandler } from './trapHandlers/coreTrapHandler';
import { functionTrapHandler } from './trapHandlers/functionTrapHandler';

function createObjectProxy() {
    return Object.create(coreTrapHandler);
}

function createArrayProxy() {
    return Object.create(coreTrapHandler);
}

function createFunctionProxy() {
    return Object.create(functionTrapHandler);
}

export { createObjectProxy, createArrayProxy, createFunctionProxy };
