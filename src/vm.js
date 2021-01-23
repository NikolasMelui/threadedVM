'use strict';

const vm = require('vm');

// const USE_STRICT = `'use strict';\n`;

const EMPTY_CONTEXT = vm.createContext(Object.freeze({}));

module.exports = { EMPTY_CONTEXT };
