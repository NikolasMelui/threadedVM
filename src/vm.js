'use strict';

const vm = require('vm');
const fs = require('fs').promises;
const path = require('path');

const RUN_OPTIONS = { timeout: 5000, displayErrors: false };
const CONTEXT_OPTIONS = { microtaskMode: 'afterEvaluate' };
const USE_STRICT = `'use strict';\n`;

const EMPTY_CONTEXT = vm.createContext(Object.freeze({}));

const SCRIPTS_PATH = path.resolve(__dirname, 'scripts');

const COMMON_CONTEXT = vm.createContext(
  Object.freeze({
    Buffer,
    URL,
    URLSearchParams,
    TextDecoder,
    TextEncoder,
    queueMicrotask,
    setTimeout,
    setImmediate,
    setInterval,
    clearTimeout,
    clearImmediate,
    clearInterval,
    console,
  }),
);

const SPECIAL_CONTEXT = vm.createContext(
  Object.freeze({
    module: {},
    require: (moduleName) => {
      console.info(moduleName);
    },
    console,
  }),
);

const createContext = (context, preventEscape = false) => {
  if (!context) return EMPTY_CONTEXT;
  return vm.createContext(context, preventEscape ? CONTEXT_OPTIONS : {});
};

class Scripter {
  constructor(name, src, options = {}) {
    const strict = src.startsWith(USE_STRICT);
    const code = strict ? src : USE_STRICT + src;
    const lineOffset = strict ? 0 : -1;
    this.name = name;
    const scriptOptions = { filename: name, ...options, lineOffset };
    this.script = new vm.Script(code, scriptOptions);
    this.context = options.context || createContext();
    this.exports = this.script.runInContext(this.context, RUN_OPTIONS);
  }
}

const readScript = async (name, options) => {
  const filePath = path.resolve(SCRIPTS_PATH, `${name}.js`);
  const src = await fs.readFile(filePath, 'utf8');
  if (!src) return null;
  const fileName =
    options && options.filename
      ? options.filename
      : path.basename(filePath, '.js');
  const script = new Scripter(fileName, src, options);
  return script;
};

module.exports = { readScript, COMMON_CONTEXT, SPECIAL_CONTEXT };
