const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const EngineTemplate = require('../src/core/engine-template');

test('EngineTemplate generates valid client JavaScript', (t) => {
  const code = EngineTemplate.getEngineCode();
  assert.ok(code.length > 500, 'Engine code must not be empty');

  // Verify key invariants
  assert.ok(code.includes('gemini-gradient-dots'), 'Must declare gemini-gradient-dots class');
  assert.ok(code.includes('aspect-ratio: 1 / 1'), 'Must enforce aspect-ratio invariant');
  assert.ok(code.includes('ephemeral-tool-status'), 'Must hook into native ephemeral status');
  assert.ok(code.includes('gemini-spark-styles'), 'Must inject style container');
  assert.ok(code.includes('createOfficialIcon'), 'Must contain official icon factory');
  assert.ok(code.includes('gemini-dot-converge-1'), 'Must include converge morph keyframes');

  // Syntax check: should compile cleanly without syntax errors
  assert.doesNotThrow(() => {
    new vm.Script(`(() => { ${code} })()`);
  }, 'Engine code must compile cleanly as a valid JavaScript script');
});
