const fs = require('fs');
const path = require('path');
const AssetResolver = require('./asset-resolver');

/**
 * Generates the production-grade client-side branding and thinking lifecycle script.
 */
class EngineTemplate {
  static getEngineCode() {
    const dataUri = AssetResolver.getSparkPngDataUri();
    const cssPath = path.resolve(__dirname, '..', 'styles', 'gemini-styles.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    return `
/* ========================================================
   GEMINI SPARK MASTER BRANDING & WORKING LIFECYCLE ENGINE
   ======================================================== */
window.addEventListener('DOMContentLoaded', () => {
  // 0. Inject GPU Styles
  try {
    const s = document.createElement('style');
    s.id = 'gemini-spark-styles';
    s.textContent = \`${cssContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {}

  // 1. Intercept window.__APP_CONFIG__ in main world
  try {
    const s = document.createElement('script');
    s.textContent = \`
      (function() {
        const fix = (obj) => {
          if (!obj) return obj;
          if (obj.productName === 'Antigravity' || obj.productName === 'geminispark' || obj.productName === 'Geminispark') {
            obj.productName = 'gemini-spark';
          }
          return obj;
        };
        let _c = fix(window.__APP_CONFIG__);
        Object.defineProperty(window, '__APP_CONFIG__', {
          configurable: true,
          enumerable: true,
          get() { return _c; },
          set(v) { _c = fix(v); }
        });
      })();
    \`;
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {}

  const sparkDataUri = "${dataUri}";

  const createOfficialIcon = () => {
    const img = document.createElement('img');
    img.className = 'gemini-official-icon';
    img.src = sparkDataUri;
    img.width = 14;
    img.height = 14;
    img.alt = 'Gemini Spark';
    return img;
  };

  const createGradientDots = () => {
    const wrap = document.createElement('span');
    wrap.className = 'gemini-gradient-dots';
    wrap.setAttribute('aria-label', 'Working...');
    const classes = ['dot-blue', 'dot-red', 'dot-yellow', 'dot-green'];
    classes.forEach(c => {
      const dot = document.createElement('span');
      dot.className = 'gemini-gradient-dot ' + c;
      wrap.appendChild(dot);
    });
    return wrap;
  };

  let rafScheduled = false;
  const applyBranding = () => {
    rafScheduled = false;

    // 1. App logo button (Top-left new conversation button)
    const btn = document.querySelector('[data-testid="app-icon-new-conversation-button"]');
    if (btn && btn.getAttribute('data-icon-applied') !== 'gemini-spark-v6') {
      btn.innerHTML = '<img width="22" height="22" style="display:block;object-fit:contain;border-radius:4px;" alt="Gemini Spark" src="' + sparkDataUri + '" />';
      btn.setAttribute('data-icon-applied', 'gemini-spark-v6');
    }

    // 2. Menu title
    const menuBtns = document.querySelectorAll('[data-testid="title-menu-bar-item"]');
    if (menuBtns.length > 0) {
      const firstMenu = menuBtns[0];
      if (firstMenu.textContent.trim() === 'Geminispark' || firstMenu.textContent.trim() === 'Antigravity') {
        firstMenu.textContent = 'Gemini Spark';
      }
    }

    // 3. Document Title
    if (document.title.includes('Geminispark') || document.title.includes('Antigravity')) {
      document.title = document.title.replace(/Geminispark|Antigravity/g, 'Gemini Spark');
    }

    // 4. Ephemeral tool status (Active in-flight "Working..." state)
    const ephemeralStatuses = document.querySelectorAll('[data-testid="ephemeral-tool-status"]');
    ephemeralStatuses.forEach(el => {
      if (!el.classList.contains('flex-col') && !el.querySelector('.gemini-gradient-dots')) {
        el.insertBefore(createGradientDots(), el.firstChild);
      }
    });

    // 5. Purge any orphan dots accidentally placed in column containers
    document.querySelectorAll('.flex-col > .gemini-gradient-dots').forEach(el => el.remove());

    // 6. Update 'Worked for' collapsible headers
    const workedTriggers = document.querySelectorAll('[data-testid="worked-for-collapsible"]');
    workedTriggers.forEach(b => {
      b.querySelectorAll('.gemini-static-icon, .gemini-spark-svg').forEach(el => el.remove());

      const container = b.parentElement;
      const turnContainer = b.closest('article, [data-testid*="turn"], [class*="turn"], [role="article"]') || container?.parentElement;
      const isCurrentlyActive = !!container?.querySelector('.animate-shimmer-text') ||
                                !!turnContainer?.querySelector('.animate-shimmer-text') ||
                                !!turnContainer?.querySelector('[title*="Running"]');

      const existingDots = b.querySelector('.gemini-gradient-dots');
      const existingIcon = b.querySelector('.gemini-official-icon');

      if (isCurrentlyActive && !b.classList.contains('hidden')) {
        if (existingIcon) existingIcon.remove();
        if (!existingDots) {
          b.insertBefore(createGradientDots(), b.firstChild);
        }
      } else if (!isCurrentlyActive && !b.classList.contains('hidden')) {
        if (existingDots && !existingDots.classList.contains('merging')) {
          existingDots.classList.add('merging');
          setTimeout(() => {
            if (existingDots.parentNode) {
              existingDots.replaceWith(createOfficialIcon());
            }
          }, 350);
        } else if (!existingDots && !existingIcon) {
          b.insertBefore(createOfficialIcon(), b.firstChild);
        }
      }
    });

    // 7. Tool sub-steps: STRICT 0% CPU LIFECYCLE
    const subSteps = document.querySelectorAll('[role="button"]');
    subSteps.forEach(el => {
      if (el.getAttribute('data-testid') === 'worked-for-collapsible') return;
      const hasShimmer = !!el.querySelector('.animate-shimmer-text');
      const text = el.textContent || '';
      const isRunning = hasShimmer || text.startsWith('Running');
      const dots = el.querySelector('.gemini-gradient-dots');

      if (isRunning) {
        if (!dots) {
          el.insertBefore(createGradientDots(), el.firstChild);
        }
      } else {
        if (dots) {
          dots.remove();
        }
      }
    });
  };

  applyBranding();
  const observer = new MutationObserver(() => {
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(applyBranding);
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
});
`;
  }
}

module.exports = EngineTemplate;
