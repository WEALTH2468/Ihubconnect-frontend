// jest.setup.js
if (typeof global.setImmediate === 'undefined') {
    global.setImmediate = (callback) => setTimeout(callback, 0);
}
