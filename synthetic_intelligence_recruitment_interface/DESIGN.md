---
name: Synthetic Intelligence Recruitment Interface
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777e'
  outline-variant: '#c6c6ce'
  surface-tint: '#525e7f'
  primary: '#182442'
  on-primary: '#ffffff'
  primary-container: '#2e3a59'
  on-primary-container: '#98a4c9'
  inverse-primary: '#bac6ec'
  secondary: '#00677e'
  on-secondary: '#ffffff'
  secondary-container: '#00d2fd'
  on-secondary-container: '#005669'
  tertiary: '#002c1b'
  on-tertiary: '#ffffff'
  tertiary-container: '#00442d'
  on-tertiary-container: '#17bb83'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#bac6ec'
  on-primary-fixed: '#0d1a38'
  on-primary-fixed-variant: '#3a4666'
  secondary-fixed: '#b4ebff'
  secondary-fixed-dim: '#3cd7ff'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5f'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '450'
    lineHeight: 22px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style

The design system is built on the philosophy of **Precision Minimalism**. It targets technical recruiters and high-stakes candidates who require a high-signal, low-noise environment. The UI must evoke a sense of "Focus-First" clarity—eliminating distractions to prioritize the technical assessment process.

The visual style blends **Modern Corporate** reliability with a **High-Tech Systematic** edge. It utilizes generous whitespace to reduce cognitive load, sharp information density to accommodate complex technical data (code snippets, analytics), and subtle interactive cues that signal AI presence without being intrusive.

## Colors

This design system utilizes a structured palette designed for long-form technical focus. 

- **Primary (Deep Slate Indigo):** Used for structural navigation, primary actions, and authoritative text. It establishes trust and stability.
- **Secondary (Electric Cyan):** Reserved for AI-driven insights, active focus indicators, and interactive highlights. It represents the "living" intelligence of the platform.
- **Neutral (Cool Gray Scale):** A foundation of slate-tinted grays ensures that the interface feels technical rather than purely organic.
- **Semantic Colors:** Used sparingly for status indicators (e.g., test results, system alerts).

For Dark Mode, the background shifts to a Deep Charcoal (#0F172A) to reduce eye strain during late-night coding sessions, while preserving the Electric Cyan accent for high-contrast visibility.

## Typography

The typography strategy focuses on hierarchy to manage information-dense screens.

- **Headlines (Manrope):** Chosen for its modern, geometric construction that remains friendly. Used for high-level dashboard summaries and section headers.
- **Body (Inter):** The workhorse for the platform. Its exceptional legibility at small sizes makes it perfect for candidate notes and interface labels.
- **Code/Technical (JetBrains Mono):** Integrated for code editors, proctoring logs, and technical metadata.

Use `label-caps` for secondary metadata and "Eye-tracking Active" status indicators to distinguish system-level messaging from user content.

## Layout & Spacing

The system uses an **8px base grid** to ensure mathematical harmony across all components.

- **Grid Model:** A 12-column fluid grid is used for dashboards, while a centered fixed-width container (max 1280px) is used for focused interview environments to prevent horizontal eye fatigue.
- **Information Density:** Use `stack-sm` for related input/label pairs and `stack-lg` for separating distinct logical sections (e.g., Code Editor vs. Candidate Instructions).
- **Responsive Behavior:** On mobile devices, gutters compress to 16px. Sidebars collapse into a bottom-anchored navigation bar to keep the primary "stage" clear for content.

## Elevation & Depth

To maintain a "Focus-First" aesthetic, this design system avoids heavy shadows and skeuomorphism. Instead, it uses **Tonal Layering** and **Soft Ambient Occlusion**.

- **Surface 0 (Background):** Neutral light/dark base.
- **Surface 1 (Cards/Containers):** Pure white (light) or +4% lighter gray (dark) with a 1px border (#E2E8F0) and a very soft, diffused shadow (0px 4px 20px rgba(0,0,0,0.04)).
- **Interactive States:** On hover, cards lift slightly with a more pronounced shadow.
- **AI Overlays:** Use a subtle backdrop blur (8px) for AI-generated hints or proctoring alerts to sit them "above" the code editor without completely obscuring it.

## Shapes

The shape language is **Professional and Structured**. 

- **Corner Radii:** A default of `0.25rem` (4px) is applied to most UI elements (buttons, inputs, cards) to maintain a crisp, technical look. 
- **Large Components:** Larger containers like the video feed or code editor use `rounded-lg` (8px) to provide a subtle softening of the workspace.
- **Interactive Elements:** Checkboxes and radio buttons maintain sharp, 2px rounded corners to align with the "precision" brand attribute.

## Components

- **Buttons:** Primary buttons use the Deep Indigo background with white text. Secondary buttons use a transparent background with a 1px indigo border. AI-triggered actions use an Electric Cyan glow-effect on hover.
- **Inputs:** Clean, 1px bordered boxes. The active state uses an Electric Cyan focus ring (2px) to signify "System Attention."
- **Status Indicators:** Small, circular dots for "Focus Status." A pulsing Cyan ring indicates AI is currently processing/analyzing input.
- **Cards:** Used for candidate profiles and question banks. They should have zero-border options when nested inside larger layout containers to avoid "box-in-box" clutter.
- **Code Editor:** Themes should be customized to match the design system colors—high contrast for syntax highlighting but using the system's neutral palette for the background and gutter.
- **Proctoring Bar:** A slim, persistent top-bar showing connectivity, camera status, and focus monitoring using minimal, high-legibility labels.