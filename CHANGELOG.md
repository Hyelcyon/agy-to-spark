# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.3.9] - 2026-10-29

### Changed
- **Organic Feathered Edge for Pinned Sticky Headers**:
  - Eliminated the unnatural hard rectangular backdrop cutoff line below pinned user messages.
  - Implemented an organic, feathered gradient mask (`-webkit-mask-image: linear-gradient(to bottom, black 65%, transparent 100%)`) that fades out seamlessly over scrolled agent content.

---

## [2.3.8] - 2026-10-29

### Fixed
- **Comprehensive User Input Card Box Neutralization**:
  - Broadened selector specificity (`[class*="group/user-input-step"] .bg-card`, `[class*="group/user-input-step"] .bg-card-border`, and `[class*="group/user-input-step"] div[class*="bg-card"]`) to completely eliminate remaining dark rectangular borders or card wrappers under Tailwind CSS escaped class structures.
  - Ensures prompt texts and user attachments sit completely unboxed and clean directly over the ambient aurora background.

---

## [2.3.7] - 2026-10-29

### Removed
- **Harsh Dark User Message Box Container**:
  - Removed the bulky `.bg-card` and `.bg-card-border` box wrapper around user prompt turns.
  - Rendered user messages in a clean, borderless typography flow directly over the ambient aurora background, matching modern conversational UI standards.
  - Added subtle, clean 8px rounded borders to image attachment thumbnails.

---

## [2.3.6] - 2026-10-29

### Fixed
- **Seamless Sticky Header Blending (`.md-sticky-message-bleed`)**:
  - Eliminated the solid-black horizontal box strip cutting across the conversation ambient aurora glow.
  - Set `.md-sticky-message-bleed` background to transparent and suppressed pseudo-elements (`::before`, `::after`) that forced opaque black gradients.
  - Added modern frosted glass effect (`backdrop-filter: blur(12px)`) on pinned sticky user rows for seamless visual unity with the background light source.

---

## [2.3.5] - 2026-10-29

### Changed
- **Calibrated Subtle Ambient Aurora Glow (광원 강도 완화)**:
  - Reduced ambient glow layer opacity from `0.95` to a softer, restrained `0.55`.
  - Calibrated radial gradient color stops to gentle pastel transparency (`0.28` / `0.18` / `0.07` for dark blue base, `0.16` / `0.08` for iris, and `0.08` for core highlights).
  - Eliminates visual distraction during reading while preserving the authentic ethereal Gemini atmosphere.

---

## [2.3.4] - 2026-10-29

### Added
- **1:1 Authentic Gemini Conversational Background Aurora Light Source**:
  - Injected `#gemini-spark-ambient-glow` directly into `.agy-sheet` (the active conversation surface), bypassing the opaque dark shell background (`.agy-shell`).
  - Implemented multi-tier centered radial aurora gradient matching the official Google Gemini web/desktop app:
    - Center core: `rgba(20, 60, 160, 0.45)` expanding through `rgba(25, 45, 120, 0.30)` and `rgba(15, 25, 70, 0.12)`.
    - Soft aura: `rgba(45, 105, 225, 0.28)` and luminous blue highlights `rgba(100, 160, 255, 0.15)`.
  - Non-blocking `pointer-events: none` and `z-index: 0` ensuring 100% interactive integrity.

---

## [2.3.3] - 2026-10-29

### Added
- **Monochrome White Gemini Spark Loading Screen Overlay**:
  - Patched `dist/loadingOverlay.js` to replace the default Antigravity SVG with the authentic Google Gemini Spark vector path.
  - Rendered in crisp monochrome white (`fill="white"`) with zero size scaling, preserving the gentle native opacity breathing pulse without distortion.

---

## [2.3.2] - 2026-10-29

### Added
- **Official Google Gemini Ambient Aurora Light Source (배경 광원)**:
  - Injected an authentic bottom-emanating ambient glow layer (`#gemini-spark-ambient-glow`) matching the official Google Gemini mobile/web experience.
  - Multi-tiered elliptical radial gradients composed of deep royal blue (`rgba(29, 66, 160, 0.35)`), indigo aurora (`rgba(66, 133, 244, 0.18)`), and soft violet glow (`rgba(147, 51, 234, 0.09)`).
  - Configured with `pointer-events: none;`, `mix-blend-mode: screen;`, `height: 65vh;`, and `z-index: 0` to preserve 100% click-through, text selection, and 0% CPU overhead.
  - Smooth 800ms `@keyframes gemini-glow-fadein` on initial mount.
- **Deep Leaf-Node Text Morphing Precision**:
  - Enhanced `triggerTextMorph` algorithm to drill into the exact text-bearing leaf span / `.truncate` container, triggering `@keyframes apple-text-crossfade` with a calibrated 1.2px lens blur and 4px vertical glide.
  - Guarantees seamless text transitions when in-flight statuses morph (`Running ...` -> `Ran ...`, `Thinking...` -> `Thought for ...`) without text jumping or visual harshness.
- **Support for Antigravity Upstream v2.28.1**:
  - Verified package integrity and updated patch synchronization targets for upstream version `2.28.1`.

---

## [2.3.1] - 2026-10-29

### Added
- **Apple Dynamic Text Morph Transition (`apple-text-crossfade`)**:
  - Implemented `@keyframes apple-text-crossfade` (0.8px soft lens blur, 3px upward translation, and opacity interpolation from 0.2 to 1 over 240ms via `cubic-bezier(0.16, 1, 0.3, 1)`).
  - Added real-time text mutation tracking (`triggerTextMorph`) across `thinking-collapsible-trigger`, `worked-for-collapsible`, `agent-loading`, and tool sub-steps (`Running` -> `Ran`).
  - Eliminates visual stiffness and hard cuts when text updates in place, replacing instantaneous text swaps with Apple-grade fluid typography interpolation.

---

## [2.3.0] - 2026-10-29

### Added
- **Apple-Grade Fluid Text Motion System**:
  - Implemented `@keyframes apple-text-reveal` (soft upward translation and fade-in over 240ms) and `@keyframes apple-message-reveal` (gentle 280ms reveal with `scale(0.995) -> scale(1)` and `translateY(6px) -> 0`).
  - Applied Apple's signature fluid spring deceleration curve `cubic-bezier(0.16, 1, 0.3, 1)` across all text reveals, button micro-interactions, and status transitions.
  - Attached smooth entrance animations to newly arriving message bubbles (`[role="article"]`, `[data-testid="turn-cards-container"]`, `user-message-bubble`) and their paragraphs/lists via the `gemini-fresh-enter` class.
  - Added single-shot lifecycle gating (`data-motion-applied`) ensuring historical scrolled text remains completely static with zero animation repeats or CPU overhead.
  - Enforced Apple-standard font smoothing (`-webkit-font-smoothing: antialiased !important; text-rendering: optimizeLegibility !important;`) across all UI surfaces.

---

## [2.2.5] - 2026-10-29

### Added
- **`agent-loading` ("Working...") Wave Dots Hooking**: Explicitly hooked `[data-testid="agent-loading"]` and added universal text-node scanning for standalone `"Working"` and `"Working..."` states. Resolves the issue where early in-flight turns rendered plain unstyled text without the 4-color wave dots.
- **Independent Text Glide Animation (`gemini-text-glide`)**: Added keyframe `@keyframes gemini-text-glide-left` (`translateX(25px)` -> `translateX(0)`) attached to `.gemini-text-glide`. When sub-steps finish (`Ran ...`), the text smoothly glides to the left over 260ms with `cubic-bezier(0.4, 0, 0.2, 1)`, guaranteeing a 100% fluid transition even across React reconciliation cycles.

### Fixed
- **Ephemeral Tool Status Exit Handling**: Extended sub-step exit and gliding logic to include `[data-testid="ephemeral-tool-status"]` in addition to button rows.
- **Safe Column Purging**: Hardened column container dot purging to strictly exempt valid `agent-loading` and `ephemeral-tool-status` rows.

---

## [2.2.4] - 2026-10-29

### Added
- **Graceful Gliding Exit Transition**: Eliminated abrupt visual snapping when thinking dots vanish. When sub-steps finish (`Running ...` -> `Ran ...`), the `.gemini-dots-exit` state smoothly collapses container width from 25px to 0px and margin from 4px to 0px over 240ms with `cubic-bezier(0.4, 0, 0.2, 1)`. Simultaneously, the dots dissolve with `opacity: 0` and `transform: scale(0.4)`. The adjacent text smoothly glides to the left instead of snapping instantly.
- **Unfolding Entrance Animation**: Added `gemini-dots-enter` keyframes (220ms `cubic-bezier(0.16, 1, 0.3, 1)`) so newly appearing dots gracefully unfold into view while easing adjacent text to the right.

### Fixed
- **Flexbox Min-Width Invariant**: Enforced `min-width: 25px !important; max-width: 25px !important;` in normal state to guarantee flexbox containers can never compress the 4 dots horizontally into vertical bars (`||||`).
- **Collapsible Selector Scope Isolation**: Refined sub-step button query selector and explicitly excluded `thinking-collapsible-trigger`, `worked-for-collapsible`, and `tool-group-collapsible` to prevent stray floating dots above collapsible headers.

---

## [2.2.3] - 2026-10-29

### Fixed
- **Aspect Ratio Invariant (Circle Integrity)**: Resolved a critical Flexbox squishing bug where `.gemini-gradient-dots` with fixed 14px width caused `flex-shrink: 1` to crush each 3.5px dot horizontally into a 1.25px wide vertical pill/bar. Expanded container width to 25px and enforced `flex-shrink: 0 !important; aspect-ratio: 1 / 1 !important; width: 4px !important; height: 4px !important; border-radius: 50% !important;` to guarantee mathematical circles during the wave animation.
- **Orphan Floating Dots**: Removed an overly broad `d.closest('div.flex')` heuristic that traversed up to column containers (`div.flex.flex-col`), which had erroneously placed isolated orphan wave dots above "Thought for 12s". Restricted dots strictly to horizontal status rows (`[data-testid="ephemeral-tool-status"]`, `[data-testid="worked-for-collapsible"]`, and active sub-steps).

---

## [2.2.2] - 2026-10-29

### Added
- **Ephemeral Tool Status Hooking**: Connected the 4-color wave dots directly into Antigravity 2.28.0's native `[data-testid="ephemeral-tool-status"]` container. When an agent turn starts and the collapsible is hidden, the dots render directly adjacent to "Working..." and "Thinking...".

### Fixed
- Fixed an issue where active thinking turns displayed plain unstyled text without the 4-color wave dots prior to step completion.

---

## [2.2.1] - 2026-10-29

### Changed
- **Asset Pipeline**: Replaced lossy GDI+ downsampled 22x22 bitmaps with the authentic 256x256 Google Gemini desktop application asset (`icon.png`, SHA256: `1545adfc...`).
- Leveraged Chromium's GPU texture mipmapping and Skia subpixel anti-aliasing to render crisp, glowing Google Red (`#EA4335`), Blue (`#4285F4`), Yellow (`#FBBC04`), and Green (`#34A853`) colors without muddy brown gamma-uncorrected sRGB downsampling artifacts.

---

## [2.2.0] - 2026-10-29

### Fixed
- **Layout Alignment & Zero Indent Drift**: Eliminated duplicate DOM elements inside `[data-testid="worked-for-collapsible"]`. Enforced exact layout parity (`margin-right: 4px; width: 14px; height: 14px; vertical-align: middle`) so "Worked for..." text aligns flush with original layout geometry.

---

## [2.1.2] - 2026-10-29

### Fixed
- **Chromium Rasterization Clipping**: Resolved an issue where an inline SVG `<filter>` with `feGaussianBlur stdDeviation="5"` on a 14x14 icon caused Chromium's GPU compositor to clip the icon into a single red dot or empty space. Migrated to high-resolution GPU-scaled PNG data URIs.

---

## [2.1.1] - 2026-10-29

### Fixed
- **0% Idle CPU Invariant**: Enforced a strict lifecycle for tool sub-steps (`[role="button"]`). Only running steps (`Running ...` or `.animate-shimmer-text`) maintain animated wave dots; completed sub-steps (`Ran ...`, `Edited ...`) have dots removed immediately to eliminate continuous CSS repaints and CPU drain.

---

## [2.1.0] - 2026-10-29

### Added
- **Google 4-Color Wave Animation**: Designed authentic Google 4-color radial gradient dots (Blue `#4285F4`, Red `#EA4335`, Yellow `#FBBC04`, Green `#34A853`) with a 1.3s cubic-bezier wave cycle and soft glowing ambient drop shadows.
- **4-Dot Convergence Morph**: Implemented keyframes `gemini-dot-converge-1..4` that seamlessly pull the four dots into the center upon step completion over 0.35s, popping in the authentic Gemini Spark icon with `gemini-spark-popin`.

---

## [2.0.0] - 2026-10-29

### Changed
- **Antigravity 2.28.0 Re-architecture (Mode B)**: Completely decoupled the patch engine from static `app.asar` binary replacements. Converted the patcher into a dynamic, version-independent preload injection engine that patches `dist/preload.js` directly within the active version's archive.
- **Windows Process Management**: Built lock-free process closing and launching utilities in `ProcessManager` and `apply_gemini_spark.bat` to avoid `EBUSY` file lock errors on Windows.

---

## [1.0.0] - 2026-10-28

### Added
- Initial release of Gemini Spark branding for Google Antigravity.
- Replaced top-left Antigravity application icon and title bar text.
- Replaced splash screen and loading overlay with Google Gemini Aurora Spark mesh.
