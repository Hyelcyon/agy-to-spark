#!/usr/bin/env node

const { AsarPatcher, ProcessManager, PathLocator } = require('../src');
const pkg = require('../package.json');

const args = process.argv.slice(2);
const command = args[0] || 'apply';

function printHelp() {
  console.log(`
agy-to-spark v${pkg.version}
High-fidelity rebranding engine transforming Google Antigravity into Gemini Spark.

Usage:
  agy-to-spark [command] [options]

Commands:
  apply      Patch Antigravity with Gemini Spark branding & thinking engine (default)
  restore    Restore original unmodified app.asar backup
  status     Display installation, process, and patch status
  help       Show this help message

Options:
  -h, --help     Show help
  -v, --version  Show version
  -l, --launch   Launch Antigravity after patching
`);
}

async function main() {
  switch (command) {
    case '-v':
    case '--version':
      console.log(`v${pkg.version}`);
      break;

    case '-h':
    case '--help':
    case 'help':
      printHelp();
      break;

    case 'status': {
      const liveAsar = PathLocator.getLiveAsarPath();
      const backupAsar = PathLocator.getBackupAsarPath();
      const isRunning = ProcessManager.isRunning();

      console.log(`=== Antigravity Status ===`);
      console.log(`Executable Running: ${isRunning ? 'Yes' : 'No'}`);
      console.log(`Live asar exists:   ${require('fs').existsSync(liveAsar) ? 'Yes' : 'No'} (${liveAsar})`);
      console.log(`Backup asar exists: ${require('fs').existsSync(backupAsar) ? 'Yes' : 'No'} (${backupAsar})`);
      break;
    }

    case 'restore': {
      try {
        console.log('[*] Restoring original Antigravity package...');
        if (ProcessManager.isRunning()) {
          console.log('[*] Closing running Antigravity instance...');
          ProcessManager.killGracefully();
        }
        const res = AsarPatcher.restore();
        console.log(`[+] Successfully restored: ${res.restored}`);
      } catch (err) {
        console.error(`[-] Restore failed: ${err.message}`);
        process.exit(1);
      }
      break;
    }

    case 'apply': {
      try {
        console.log(`[*] Applying Gemini Spark v${pkg.version} patch...`);
        const isRunning = ProcessManager.isRunning();
        if (isRunning) {
          console.log('[*] Closing active Antigravity process to ensure lock-free write...');
          ProcessManager.killGracefully();
        }

        const liveAsar = PathLocator.getLiveAsarPath();
        const backupDir = PathLocator.getBackupDir();
        const backupAsar = PathLocator.getBackupAsarPath();

        // Apply to live
        await AsarPatcher.applyPatch({ sourceAsar: liveAsar });
        console.log(`[+] Successfully patched live archive: ${liveAsar}`);

        // Ensure backup directory and sync backup
        require('fs').mkdirSync(backupDir, { recursive: true });
        require('fs').copyFileSync(liveAsar, backupAsar);
        console.log(`[+] Synchronized permanent backup: ${backupAsar}`);

        if (args.includes('--launch') || args.includes('-l')) {
          console.log('[*] Launching Gemini Spark...');
          ProcessManager.launchDetached(PathLocator.getLiveExePath());
        }
        console.log(`[+] Done.`);
      } catch (err) {
        console.error(`[-] Error: ${err.message}`);
        process.exit(1);
      }
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main();
