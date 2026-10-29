const { execSync, spawn } = require('child_process');

/**
 * Handles safe process inspection, termination, and launching for Antigravity.
 */
class ProcessManager {
  static isRunning(processName = 'Antigravity.exe') {
    try {
      const output = execSync(`tasklist /fi "imagename eq ${processName}" /fo csv /nh`, {
        stdio: ['ignore', 'pipe', 'ignore'],
        encoding: 'utf8'
      });
      return output.toLowerCase().includes(processName.toLowerCase());
    } catch {
      return false;
    }
  }

  static killGracefully(processName = 'Antigravity.exe', timeoutMs = 2000) {
    if (!this.isRunning(processName)) return true;

    try {
      execSync(`taskkill /f /im ${processName}`, { stdio: 'ignore' });
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (!this.isRunning(processName)) return true;
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
      }
      return !this.isRunning(processName);
    } catch {
      return false;
    }
  }

  static launchDetached(exePath) {
    const child = spawn(exePath, [], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    return true;
  }
}

module.exports = ProcessManager;
