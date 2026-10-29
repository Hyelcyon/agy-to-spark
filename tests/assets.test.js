const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const PathLocator = require('../src/utils/path-locator');
const AssetResolver = require('../src/core/asset-resolver');

test('Brand assets exist and are valid', (t) => {
  const pngPath = PathLocator.getProjectAsset('icons/gemini_spark.png');
  const icoPath = PathLocator.getProjectAsset('icons/gemini_spark.ico');
  const svgPath = PathLocator.getProjectAsset('spark.svg');

  assert.ok(fs.existsSync(pngPath), 'PNG icon must exist');
  assert.ok(fs.existsSync(icoPath), 'ICO icon must exist');
  assert.ok(fs.existsSync(svgPath), 'SVG vector must exist');

  const pngStats = fs.statSync(pngPath);
  assert.ok(pngStats.size > 10000, 'PNG file must be full-resolution asset');

  const dataUri = AssetResolver.getSparkPngDataUri();
  assert.ok(dataUri.startsWith('data:image/png;base64,'), 'Data URI must be valid base64');
});
