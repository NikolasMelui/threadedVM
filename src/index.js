'use strict';

const { readScript, SPECIAL_CONTEXT } = require('./vm');

(async () => {
  try {
    await readScript('first', { context: SPECIAL_CONTEXT });
  } catch (error) {
    console.error(error);
  }
})();
