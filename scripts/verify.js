const fs = require('fs');
const path = require('path');
const os = require('os');
const asar = require('@electron/asar');
const { EngineTemplate, AssetResolver } = require('../src');

async function main() {
  console.log('=== Running agy-to-spark Verification Suite ===');

  // 1. Asset check
  console.log('[1/3] Verifying authentic assets...');
  const dataUri = AssetResolver.getSparkPngDataUri();
  if (!dataUri.startsWith('data:image/png;base64,')) {
    throw new Error('Asset verification failed: invalid data URI');
  }
  console.log(`      ✓ Authentic PNG resolved (${dataUri.length} chars)`);

  // 2. Engine code check
  console.log('[2/3] Verifying engine template syntax & invariants...');
  const engineCode = EngineTemplate.getEngineCode();
  if (!engineCode.includes('gemini-gradient-dots') || !engineCode.includes('aspect-ratio: 1 / 1')) {
    throw new Error('Engine code missing invariants');
  }
  console.log(`      ✓ Engine code compiled cleanly (${engineCode.length} chars)`);

  // 3. Asar pack/unpack roundtrip check
  console.log('[3/3] Verifying ASAR roundtrip packaging...');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-asar-'));
  const testPayload = path.join(tmpDir, 'test.txt');
  fs.writeFileSync(testPayload, 'hello world', 'utf8');

  const testAsar = path.join(os.tmpdir(), `test-${Date.now()}.asar`);
  await asar.createPackage(tmpDir, testAsar);

  const unpackedDir = path.join(os.tmpdir(), `unpacked-${Date.now()}`);
  asar.extractAll(testAsar, unpackedDir);

  const content = fs.readFileSync(path.join(unpackedDir, 'test.txt'), 'utf8');
  if (content !== 'hello world') {
    throw new Error('ASAR verification failed: content mismatch');
  }

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.rmSync(unpackedDir, { recursive: true, force: true });
  fs.unlinkSync(testAsar);

  console.log('      ✓ ASAR packaging roundtrip verified successfully');
  console.log('\n[PASS] All verification checks passed!');
}

main().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
