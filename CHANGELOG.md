# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
