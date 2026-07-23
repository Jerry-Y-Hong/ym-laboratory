# 07_RESPONSIVE_ACCESSIBILITY_GUIDE.md

## Phase 28 – AI Frontend Design System (AFDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Frontend UI Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Establish the **Accessibility (a11y) & Cross-Platform Adaptability Standards** for the YM-LAB Enterprise Ecosystem. AFDS enforces WCAG 2.1 AAA contrast guidelines, WAI-ARIA 1.2 semantic attributes, robust keyboard focus management, and consistent visual rendering across Web Browsers, PWAs, and Desktop App Shells.

---

## 2. Accessibility (a11y) Standards

### 2.1 WCAG 2.1 AAA Color Contrast Matrix

- **Body Text**: Minimum contrast ratio of **7:1** against surface background.
- **Large Text / UI Controls**: Minimum contrast ratio of **4.5:1** against surface background.
- **Focus Rings**: Mandatory 2px solid cyan outline (`var(--afds-color-cyan-500)`) with 3px offset.

```css
/* Accessible Focus Ring Indicator */
:focus-visible {
  outline: 2px solid var(--afds-color-cyan-500);
  outline-offset: 3px;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.4);
}
```

### 2.2 WAI-ARIA 1.2 Live Region Specifications for AI Stream

To make real-time LLM streaming accessible to screen readers:

```html
<!-- Real-Time AI Stream Accessible Container -->
<div 
  role="region" 
  aria-label="AI Assistant Stream Response" 
  aria-live="polite" 
  aria-atomic="false" 
  aria-busy="true"
>
  <p>Streaming content chunk...</p>
</div>
```

---

## 3. Keyboard Navigation & Focus Trap Rules

1. **Tab Navigation**: All interactive elements (`<button>`, `<a href>`, `<input>`, custom dropdowns) MUST be focusable via `Tab` and `Shift + Tab`.
2. **Modal Focus Trap**: Opening a modal dialog traps focus inside the container until closed with `Escape` or action buttons.
3. **Shortcuts**: Global `Cmd + K` or `Ctrl + K` opens the central command palette.

---

## 4. Cross-Platform Adaptability Matrix

| Platform Tier | Runtime Target | Touch/Mouse Adaptation | PWA Support | Desktop Native Shell |
|---|---|---|---|---|
| **Web Browser** | Evergreen Chrome/Edge/Firefox | Mouse Hover + Pointer | Full PWA Manifest | - |
| **Mobile PWA** | iOS Safari / Android Chrome | 44px Touch Targets, Gestures | Offline Cache, SW | Standalone Display |
| **Desktop App** | Electron / Tauri Container | Mouse + Keyboard Shortcuts | Native Menu | OS Native Frame |

---

## 5. Traceability & Cross-References

- [04_COLOR_SYSTEM.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ABIDS/04_COLOR_SYSTEM.md) - ABIDS WCAG Standards
- [03_ATOMIC_COMPONENT_LIBRARY.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/03_ATOMIC_COMPONENT_LIBRARY.md) - Component Library
- [01_AFDS_MASTER_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/01_AFDS_MASTER_STANDARD.md) - Master Architecture

---

## 6. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| WCAG 2.1 AAA Compliance | 7:1 body contrast & 4.5:1 control contrast defined | PASS |
| WAI-ARIA Stream Live Region | `aria-live="polite"` pattern specified | PASS |
| Focus Trap & Keyboard | Keyboard shortcuts & modal focus traps established | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. Accessibility & Cross-Platform Guide created. |
