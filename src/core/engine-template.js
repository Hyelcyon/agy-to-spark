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

    // 4. In-flight agent status ("Working...", "Compacting...", active tool execution)
    const agentLoadingElements = document.querySelectorAll('[data-testid="agent-loading"], [data-testid="ephemeral-tool-status"]');
    agentLoadingElements.forEach(el => {
      if (!el.querySelector('.gemini-gradient-dots')) {
        el.insertBefore(createGradientDots(), el.firstChild);
      }
    });

    // Universal text-level hooking for "Working" / "Working..." to guarantee dots in all view modes
    const allTextCandidates = document.querySelectorAll('span, div, p');
    allTextCandidates.forEach(el => {
      if (el.children.length === 0 && (el.textContent?.trim() === 'Working' || el.textContent?.trim() === 'Working...')) {
        const container = el.closest('[data-testid="agent-loading"], [data-testid="ephemeral-tool-status"]') || el.parentElement;
        if (container && !container.querySelector('.gemini-gradient-dots') && !container.classList.contains('gemini-gradient-dot')) {
          container.insertBefore(createGradientDots(), container.firstChild);
        }
      }
    });

    // 5. Purge only orphan dots accidentally placed in raw column containers
    document.querySelectorAll('.flex-col > .gemini-gradient-dots').forEach(el => {
      if (!el.closest('[data-testid="agent-loading"]') && !el.closest('[data-testid="ephemeral-tool-status"]')) {
        el.remove();
      }
    });

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
        if (existingDots && existingIcon) {
          existingIcon.remove();
        }
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

    // 7. Tool sub-steps: Graceful Gliding Exit + Independent Text Glide Animation
    const subSteps = document.querySelectorAll('div[role="button"], [data-testid="ephemeral-tool-status"]');
    subSteps.forEach(el => {
      const testId = el.getAttribute('data-testid');
      if (testId === 'worked-for-collapsible' || testId === 'thinking-collapsible-trigger' || testId === 'tool-group-collapsible' || testId === 'agent-loading') {
        return;
      }

      const text = el.textContent || '';
      const hasShimmer = !!el.querySelector('.animate-shimmer-text');
      const isSubStep = text.startsWith('Running') || text.startsWith('Ran') || hasShimmer;
      if (!isSubStep) return;

      const isRunning = hasShimmer || text.startsWith('Running');
      const dots = el.querySelector('.gemini-gradient-dots');

      if (isRunning) {
        el.removeAttribute('data-glided');
        if (!dots) {
          el.insertBefore(createGradientDots(), el.firstChild);
        } else if (dots.classList.contains('gemini-dots-exit')) {
          dots.classList.remove('gemini-dots-exit');
        }
      } else {
        // Trigger smooth text gliding transition from indented position back to original
        if (text.startsWith('Ran') && !el.getAttribute('data-glided')) {
          el.setAttribute('data-glided', 'true');
          const textWrapper = el.querySelector('.truncate') || el.querySelector('span') || el.lastElementChild;
          if (textWrapper) {
            textWrapper.classList.add('gemini-text-glide');
            setTimeout(() => {
              textWrapper.classList.remove('gemini-text-glide');
            }, 280);
          }
        }

        if (dots && !dots.classList.contains('gemini-dots-exit')) {
          dots.classList.add('gemini-dots-exit');
          setTimeout(() => {
            if (dots.parentNode && dots.classList.contains('gemini-dots-exit')) {
              dots.remove();
            }
          }, 240);
        }
      }
    });

    // 8. Apple-Grade Fluid Text Motion for Newly Arriving Turns & Message Blocks
    const freshTurnElements = document.querySelectorAll('[role="article"]:not([data-motion-applied]), [data-testid="turn-cards-container"] > div:not([data-motion-applied]), [data-testid="user-message-bubble"]:not([data-motion-applied])');
    freshTurnElements.forEach(el => {
      el.setAttribute('data-motion-applied', 'true');
      el.classList.add('gemini-fresh-enter');
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
