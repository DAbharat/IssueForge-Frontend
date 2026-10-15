# IssueForge Frontend Design System

This document defines the visual language, UI patterns, interaction principles, and design rules for the IssueForge frontend.

The current authentication screen is the primary visual reference for the application's design direction.

The overall aesthetic is **dark, minimal, premium, technical, and productivity-focused**.

The design should feel like a serious tool for developers and teams rather than a generic SaaS dashboard.

---

# 1. Design Philosophy

IssueForge should feel:

* Dark
* Minimal
* Premium
* Technical
* Professional
* Focused
* Calm
* Information-dense
* Consistent

The interface should prioritize **clarity and usability over decoration**.

The application should use a restrained visual language where typography, spacing, borders, and contrast establish hierarchy.

### Prefer

* Pitch-black backgrounds
* Neutral gray surfaces and controls
* Gray primary actions
* White text with opacity-based hierarchy
* Very subtle borders
* Minimal shadows
* Small to moderate corner radii
* Compact controls
* Strong typography hierarchy
* Subtle hover states
* Restrained use of color
* Clean layouts

### Avoid

* Gradients of any color in the real system (landing pages can have subtle gradients, but never in purple or indigo)
* Any purple or indigo colors
* Glassmorphism
* Excessive glowing effects
* Excessive shadows
* Bright colorful backgrounds
* Large decorative cards
* Excessively rounded UI
* Too many accent colors
* Excessive animations
* Generic "SaaS dashboard" aesthetics
* Unnecessary visual decoration

The application should feel **intentional and understated**.

---

# 2. Core Color Palette

IssueForge uses a dark, restrained color system designed for a professional issue and project management application.

The following five colors form the **primary IssueForge design palette** and should be treated as the source of truth when implementing new UI.

| Role               | Color     | Usage                                                        |
| ------------------ | --------- | ------------------------------------------------------------ |
| Primary Accent     | `#DDE1E5` | Active indicators, focus rings, selected badges/highlights   |
| App Background     | `#000000` | Main application canvas                                      |
| Surface Background | `#18181B` | Cards, sidebars, panels, kanban columns                      |
| Primary Text       | `#E2E8F0` | Headings, important content, primary labels                  |
| Secondary Text     | `#94A3B8` | Metadata, descriptions, timestamps, breadcrumbs              |

These colors should be reused consistently rather than replaced with arbitrary Tailwind colors.

---

## 2.1 Primary Accent

```text
#DDE1E5
```

Light Platinum / Silver (`#DDE1E5`) is the primary IssueForge accent color.

Use it sparingly for:

* Active navigation highlights & badges
* Selected indicators & focus rings
* Intentional interactive emphasis

**Important Contrast Rule:** Whenever `#DDE1E5` is used as a background or hover highlight fill (e.g., `bg-[#DDE1E5]` or `hover:bg-[#DDE1E5]`), the text color **must be black** (`text-black` / `#000000`) so that white text is never hidden against the light accent background.

**Strict Prohibition of Purple and Indigo:** There is strictly **no use of purple or indigo color** anywhere in the application (including buttons, borders, highlights, or icons).

The accent should be used intentionally and rarely — it is not the color of everyday buttons or controls. Everyday interactive controls (primary buttons, active navigation, active toggles) should use the neutral gray system described below, not arbitrary bright fills.

---

## 2.2 App Background

```text
#000000
```

This is the primary application canvas: a pitch-black background.

Use it for:

* Main application backgrounds
* Page backgrounds
* Empty surrounding space
* Application shell

The background should be true, near-pure black so that gray surfaces, text, and interactive elements establish hierarchy through contrast against it.

Prefer:

```text
bg-black
```

or the explicit hex value `#000000` for the primary application canvas. This replaces the previous near-black `#0F1115` value — new and updated screens should use pitch black rather than a dark blue-gray tone.

---

## 2.3 Surface Background

```text
#18181B
```

This is the elevated surface color used to distinguish UI elements from the pitch-black application background.

Use it for:

* Cards
* Sidebars
* Panels
* Kanban columns
* Dropdown surfaces
* Settings sections
* Important grouped content
* Elevated application areas

Surfaces should provide subtle, neutral-gray separation from the pure black application background.

Avoid creating many different surface colors.

The primary hierarchy should generally be:

```text
#000000
     ↓
#18181B
     ↓
subtle border
     ↓
typography
```

rather than relying on heavy shadows or multiple competing background colors.

---

## 2.4 Primary Text

```text
#E2E8F0
```

This is the primary text color.

Use it for:

* Page titles
* Section headings
* Issue titles
* Important labels
* Primary navigation items
* Important content
* Primary button text when appropriate

Primary text should provide strong contrast against the pitch-black background without using pure white everywhere.

Prefer:

```text
text-[#E2E8F0]
```

for normal application text rather than introducing unrelated gray values.

---

## 2.5 Secondary Text

```text
#94A3B8
```

This is the secondary/muted text color.

Use it for:

* Metadata
* Timestamps
* Breadcrumbs
* Descriptions
* Supporting information
* Secondary navigation
* Helper text
* Less important labels

Secondary text should remain clearly readable but visually weaker than primary content.

Prefer:

```text
text-[#94A3B8]
```

for normal secondary application text.

---

## 2.6 Color Hierarchy

The general color hierarchy should follow:

```text
                    #E2E8F0
                  Primary Text
                       ↑
                       |
#DDE1E5 ←──── Rare Accent / Focus (paired with text-black on fills)
                       |
                       ↓
                  #94A3B8
                 Secondary Text

#18181B ←──── Elevated Surfaces / Gray Controls

#000000 ←──── Application Canvas (Pitch Black)
```

The interface should primarily consist of:

```text
Pitch-Black App Background
      +
Gray Surface Background
      +
Primary Text
      +
Secondary Text
      +
Rare Accent
```
---

## 2.7 Navbar and Sidebar Colors

The top navbar and left sidebar use dedicated near-black/gray shades that sit between the pitch-black app background and elevated gray surfaces, giving the application shell a distinct sense of structure.

| Element                     | Color     | Usage / Visual Detail                                                          |
| ---------------------------- | --------- | -------------------------------------------------------------------------------- |
| Top Navbar                  | `#000000` | Pure black, matching the canvas; anchors search, notifications, and profile.    |
| Left Sidebar                | `#000000` | Pure black, matching the canvas, separated primarily by a 1px border.           |
| Active Nav Item (BG)         | `#27272A` | Active item background fill (e.g., current project or tab) — neutral gray.      |
| Active Nav Item (Accent)     | `#DDE1E5` | Light Platinum accent, used for active indicator, badge, or text/icon highlight. |
| Hover Nav Item (BG)          | `#18181B` | Subtle gray hover effect for inactive nav items.                                |
| Dividers & Borders           | `#27272A` | 1px solid border separating sidebar/navbar from the canvas.                     |

Usage notes:

* The top navbar and sidebar should match the pitch-black `#000000` app background, with structure communicated through subtle `#27272A` borders rather than a distinct background shade.
* Active nav items should primarily use `#27272A` as the background fill. The `#DDE1E5` accent should be reserved for rare emphasis (active icon/text indicator, count badge, or border highlight) — never use purple or indigo. If `#DDE1E5` is ever used as a fill or hover background, foreground text must be black (`text-black`).
* Hover states (`#18181B`) should only apply to inactive items; the active item's state should not change on hover.
* Use `#27272A` for the 1px border separating the navbar/sidebar from the main canvas, consistent with the broader restrained border system in Section 12.

Do not introduce additional colors unless they have a clear semantic purpose.

---

# 3. Neutral and Opacity System

The primary application palette should use the five colors above as the source of truth.

White opacity values may still be used for **transient visual treatments** where appropriate, such as:

```text
white/5
white/6
white/10
white/12
white/16
white/20
```

Typical uses include:

* Subtle borders
* Hover backgrounds
* Dividers
* Overlays
* Authentication imagery
* Very subtle visual separation

However, opacity-based white should not replace the defined primary text and surface colors throughout the application.

For example, prefer:

```text
text-[#E2E8F0]
```

for primary application text instead of:

```text
text-white
```

and:

```text
text-[#94A3B8]
```

for secondary application text instead of creating arbitrary gray values.

---

# 4. Accent and Semantic Colors

`#DDE1E5` is the primary IssueForge accent, used rarely and intentionally.

Use it for focus indicators, active selection markers, and intentional highlights.

**Text Contrast Rule:** Whenever `#DDE1E5` is used as a background or hover state (such as `bg-[#DDE1E5]` or `hover:bg-[#DDE1E5]`), the foreground text **must be black** (`text-black` / `#000000`) so that white text does not hide against the light background.

Examples:

```text
Focused input ring
    → #DDE1E5

Selected / Active item indicator
    → #DDE1E5 (text-black on fill)

Important link / highlight
    → #DDE1E5
```

The accent should not automatically be used for every primary CTA or active state — everyday interactive elements (buttons, active tabs, active nav items) should default to the neutral gray system (`#27272A` / `#18181B`), reserving `#DDE1E5` for clear intentional highlights.

**Strict Prohibition of Purple and Indigo:** There is strictly **no use of purple or indigo color** anywhere in the system.

The authentication screen currently uses a high-contrast white primary CTA. This legacy pattern may continue on authentication screens where strong contrast is more appropriate; new application screens should use the gray primary CTA described in Section 5.

---

## 4.1 Semantic Colors

Additional colors may be introduced when they communicate a specific semantic meaning.

Examples:

```text
Success → green
Warning → amber/yellow
Error   → red
Info    → blue
```

Semantic colors should be:

* Used only when their meaning is relevant
* Muted rather than excessively saturated
* Consistent across the application
* Accessible against the dark surfaces

Do not introduce arbitrary colors simply for visual variety.

Destructive actions should continue to use the established subtle red treatment:

```text
border-red-500/30
bg-red-500/10
text-red-200
```

---

## 4.2 Legacy Color Deprecation and No-Purple Rule

Any legacy purple or indigo values (such as `#04020E`, `#5E6AD2`, `#6366F1`, `#818CF8`, `#8D6FE8`, `#9A7EF0`) are **strictly deprecated and forbidden**.

For all application features and screens, use the active IssueForge palette:

```text
#DDE1E5 (Primary Accent)
#000000 (App Background)
#18181B (Surface Background)
#E2E8F0 (Primary Text)
#94A3B8 (Secondary Text)
```

Never introduce or mix purple or indigo colors into the application.

---

# 5. Primary Actions

New application screens (as established by the workspace overview, project, and dashboard views) use a **neutral gray primary action button** against the pitch-black canvas.

Example:

```text
bg-zinc-800
text-white
hover:bg-zinc-700
```

Primary actions should generally use a moderate-contrast gray button rather than a stark white button.

Examples:

```text
+ New
Manage Workspace Members
Add Member
Create issue
Create project
Save changes
```

Primary button characteristics:

* Neutral gray background (`#27272A`–`#3F3F46` range)
* White/light text
* Small to moderate radius
* Clear, slightly lighter hover state
* Clear disabled state
* Moderate contrast against the pitch-black background
* No unnecessary gradient

The primary CTA should stand out through its gray surface and border against the pure black canvas, not through glow, excessive effects, or a stark white fill.

The legacy white-background CTA (`bg-white` / `text-black`) remains valid only on the legacy authentication screen described in Section 26; all other primary actions should use the gray treatment above.

---

# 6. Secondary Actions

Secondary actions should use the dark surface itself or transparent backgrounds.

Examples:

```text
Cancel
Back
Filter
Manage
View details
```

Preferred treatment:

```text
bg-transparent
border-white/10
border-white/16
text-white
hover:bg-white/6
```

Secondary actions should not compete visually with the primary action.

---

# 7. Outline Buttons

Outline buttons should use:

```text
border-white/16
bg-transparent
text-white
hover:bg-white/6
```

The current Google and Apple buttons are examples of this pattern.

Outline buttons are appropriate for:

* Secondary authentication providers
* Secondary actions
* Alternative actions
* Toolbar actions

---

# 8. Ghost Buttons

Ghost buttons should be visually quiet.

Use them primarily for:

* Icon buttons
* Close controls
* Toolbar actions
* Low-emphasis interactions

They should become more visible on hover.

Avoid giving every button a visible border.

---

# 9. Destructive Actions

Destructive actions should use red only when the action is genuinely destructive.

Examples:

```text
Delete issue
Delete project
Delete workspace
Remove member
```

Use the established subtle error treatment:

```text
border-red-500/30
bg-red-500/10
text-red-200
```

Avoid bright red buttons unless the action requires strong emphasis.

---

# 10. Inputs

Inputs should follow the authentication screen's visual language.

Preferred base style:

```text
bg-white/6
border-white/12
text-white
placeholder:text-white/28
```

Focused state:

```text
border-white/30
ring-white/12
```

Inputs should:

* Have consistent height
* Have consistent padding
* Use subtle borders
* Have clear focus states
* Use muted placeholders
* Clearly communicate validation errors

Do not introduce a completely different input style on individual pages.

---

# 11. Input Height

The authentication screen establishes approximately:

```text
h-11
```

as the standard input/control height.

Use this as the default for normal application controls.

Larger controls may be used when required by the context, but the default should remain compact.

---

# 12. Border System

Borders should be subtle.

Preferred values:

```text
border-white/10
border-white/12
border-white/16
```

Use stronger borders only for:

* Focus
* Selected states
* Important visual separation

Borders should help establish structure without becoming visually dominant.

---

# 13. Surfaces

Use subtle white overlays to create hierarchy against the pitch-black background.

Preferred:

```text
bg-white/5
bg-white/6
bg-white/8
bg-white/10
```

Avoid introducing many different surface colors.

Most UI hierarchy should come from:

```text
background
+
subtle surface
+
border
+
spacing
+
typography
```

rather than heavy shadows.

---

# 14. Shadows

Shadows should be restrained.

Do not use large shadows on every component.

Use shadows only when they improve hierarchy, such as:

* Important dialogs
* Floating menus
* Large elevated surfaces

Avoid excessive glow effects.

The authentication hero image may use stronger visual treatment, but normal application components should remain subtle.

---

## 14.1 Gradients Policy

* **Real System / In-App UI: Strictly No Gradients.** All real system screens and components (including dashboard, workspaces, projects, issues, archive, profile, settings, navigation bars, sidebars, cards, and dialogs) must strictly use solid, flat colors (`#000000`, `#18181B`, `#27272A`, `#DDE1E5`). **No gradient of any color is permitted in the real system.**
* **Landing / Marketing Pages Exception:** Subtle gradients are permissible exclusively on public landing or marketing pages (e.g., subtle dark neutral photographic overlays or vignette fades for depth). However, **even on landing pages, gradients in purple or indigo colors are strictly forbidden.**

---

# 15. Border Radius

IssueForge should use relatively restrained rounding.

Preferred:

```text
rounded-sm
rounded-md
rounded-lg
```

Use:

```text
rounded-full
```

only where the shape naturally calls for it:

* Avatars
* Pills
* Status indicators
* Compact tags

Buttons and inputs should generally use small/moderate radius rather than pill shapes.

The current authentication form establishes `rounded-sm` as an important control style.

---

# 16. Typography

Typography should provide most of the visual hierarchy.

Use the application's configured font consistently.

### Authentication page titles

Authentication screens may use larger typography.

Example:

```text
text-4xl
sm:text-5xl
tracking-tight
```

### Application page titles

Use more restrained sizes:

```text
text-2xl
text-3xl
```

### Body

Prefer:

```text
text-sm
text-base
```

### Metadata

Prefer:

```text
text-xs
text-sm
```

with reduced opacity.

Do not use extremely large headings throughout the application.

Large typography should be reserved for major entry points and important page headings.

---

# 17. Spacing

Spacing should be consistent and intentional.

Prefer the existing Tailwind spacing scale.

Common spacing patterns should remain consistent across pages.

For example:

```text
gap-2
gap-3
gap-4
gap-6
gap-8
```

Avoid arbitrary spacing values unless they are required for a specific layout.

Whitespace should create hierarchy rather than unnecessarily making the application sparse.

---

# 18. Layout

IssueForge should favor layouts that maximize usable workspace.

Application screens should generally use:

```text
┌───────────────────────────────────────────────────┐
│ Navigation / Header                               │
├──────────────┬────────────────────────────────────┤
│              │                                    │
│ Sidebar      │          Main Content              │
│              │                                    │
│              │                                    │
└──────────────┴────────────────────────────────────┘
```

The application shell should remain consistent between pages.

Do not invent a new navigation structure for individual features.

---

# 19. Information Density

IssueForge is an issue/project management application.

Information should be easy to scan.

Prefer:

* Compact rows
* Tables
* Lists
* Grouped sections
* Clear metadata
* Strong alignment

Avoid turning every piece of information into a large card.

For example, issues should generally be represented as compact rows rather than large dashboard cards.

---

# 20. Cards

Cards should be used when they provide meaningful grouping.

Good uses:

* Project summaries
* Profile sections
* Settings groups
* Dashboard summaries
* Important contextual information

Bad use:

Creating a separate large card for every small piece of information.

Cards should not become the default layout primitive for the entire application.

---

# 21. Issue Representation

Issues are one of the most important entities in IssueForge.

Issue UI should prioritize:

```text
Issue key
Title
Status
Priority
Assignee
Labels
Updated date
```

The interface should allow users to quickly scan many issues.

Prefer compact rows/list/table layouts.

The issue title should generally receive the strongest visual emphasis.

Metadata should use smaller and more muted text.

---

# 22. Statuses

Statuses should be visually distinguishable but restrained.

Examples:

```text
Open
In Progress
Resolved
Closed
```

Use subtle semantic colors.

Statuses should generally be represented through:

* Badge
* Small indicator
* Text + subtle color

Do not use large colored backgrounds for status.

---

# 23. Priority

Priority should be immediately scannable.

Use consistent semantic visual hierarchy.

Higher priorities may use stronger emphasis, but priority should never visually overpower the issue title.

---

# 24. Labels

Labels may use color because color is part of their meaning.

However:

* Label colors should remain readable
* Text must maintain sufficient contrast
* Labels should remain compact
* Do not use excessive saturation throughout the UI

Labels should feel like small pieces of metadata, not large UI elements.

---

# 25. Icons

Use the existing icon library consistently.

The current implementation uses Lucide icons.

Prefer Lucide icons for application controls.

Typical sizes:

```text
h-4 w-4
h-5 w-5
```

Use icons to improve recognition and interaction.

Do not add icons purely for decoration.

Icon-only controls must have accessible labels.

---

# 26. Authentication Screens

Authentication screens establish a legacy visual reference for the product and are treated as an exception to the pitch-black/gray system described above.

The current register screen uses:

```text
#04020E
+
white typography
+
white primary CTA
+
subtle white borders
+
translucent white surfaces
+
dark photographic hero
+
neutral monochrome undertones
```

The desktop registration layout consists of:

```text
┌──────────────────────┬──────────────────────┐
│                      │                      │
│    Hero Image        │    Registration      │
│                      │       Form           │
│                      │                      │
│ IssueForge           │ Create an account    │
│                      │                      │
│ Work without        │ Inputs               │
│ the chaos.           │                      │
│                      │ Primary CTA          │
│                      │                      │
│                      │ Social providers     │
└──────────────────────┴──────────────────────┘
```

Authentication screens may use:

* Larger typography
* Hero imagery
* More generous spacing
* Marketing-style supporting copy

Normal application pages should remain more information-dense and should follow Section 2's pitch-black/gray palette rather than the legacy `#04020E` authentication background.

---

# 27. Hero Images

Large hero imagery may be used on authentication or marketing-oriented pages.

When using an image:

* Use a dark overlay when necessary
* Preserve text readability
* Avoid overly bright imagery
* Maintain the dark IssueForge aesthetic

The registration screen may use a dark neutral overlay to ensure readable white text (never use purple or indigo overlays).

Do not add hero imagery to normal CRUD/application screens simply for decoration.

---

# 28. Navigation

Navigation should be predictable and compact.

The active navigation item should be distinguishable using subtle emphasis.

Preferred active-state techniques:

* Slight gray background (`#27272A`)
* Increased text contrast
* Rare `#DDE1E5` accent (paired with black text on fills)
* Small indicator

Avoid extremely bright active states.

Navigation should not visually compete with the main content.

---

# 29. Modals and Dialogs

Use dialogs for focused actions.

Examples:

* Create issue
* Edit project
* Add member
* Delete confirmation
* Create label

Use the existing shadcn/ui dialog primitives.

Do not manually create another dialog system if the existing component is sufficient.

Dialogs should have:

* Clear title
* Clear purpose
* Primary action
* Secondary/cancel action
* Appropriate loading state
* Appropriate error state

---

# 30. Loading States

Every asynchronous operation should communicate its state.

Examples:

```text
Create account
      ↓
Creating account...

Create issue
      ↓
Creating...

Save changes
      ↓
Saving...
```

Buttons should become appropriately disabled while the operation is in progress.

Do not allow repeated submissions of the same action.

For data loading, prefer contextual skeletons or loading indicators instead of displaying `"Loading..."` everywhere.

---

# 31. Empty States

Empty states should tell the user:

1. What is empty
2. Why it matters
3. What they can do next

Example:

```text
No issues yet

Create an issue to start tracking work.

[ Create issue ]
```

Keep empty states visually minimal.

---

# 32. Error States

Errors should be clear and visually consistent.

Use subtle red treatment:

```text
border-red-500/30
bg-red-500/10
text-red-200
```

Error messages should be:

* Understandable
* Close to the relevant action/field
* Concise
* Actionable when possible

Do not expose raw technical backend errors when they are not meaningful to users.

---

# 33. Success Feedback

Successful actions should provide clear but restrained feedback.

Examples:

* Toast
* Inline confirmation
* Updated UI state
* Button state change

Avoid excessive success animations.

The user should understand that the operation succeeded without being interrupted by unnecessary visual effects.

---

# 34. Responsive Design

The design must work across:

* Desktop
* Tablet
* Mobile

### Desktop

Use:

* Sidebar navigation
* Multi-column layouts where useful
* Information-dense content
* Wider content areas

### Tablet

Use:

* Flexible layouts
* Reduced navigation width
* Responsive grids

### Mobile

Use:

* Collapsible navigation
* Single-column layouts
* Full-width primary actions
* Compact controls
* Horizontally scrollable dense data where appropriate

The interface must remain functional rather than simply shrinking the desktop layout.

---

# 35. Accessibility

Accessibility is part of the design system.

All interactive elements must:

* Have accessible names
* Be keyboard accessible
* Have visible focus states
* Maintain sufficient contrast

Inputs should have accessible labels.

Icon-only buttons must have `aria-label`.

Do not rely solely on color to communicate meaning.

Do not remove focus indicators.

---

# 36. shadcn/ui

IssueForge uses shadcn/ui as the foundation for base UI primitives.

`components/ui/` is **reserved exclusively for shadcn/ui components**.

Do not place manually created application-specific components inside:

```text
components/ui/
```

Examples of components that belong in `components/ui/`:

```text
button.tsx
input.tsx
dialog.tsx
separator.tsx
dropdown-menu.tsx
popover.tsx
tabs.tsx
```

Application-specific components belong inside their respective features.

Examples:

```text
features/issues/components/IssueCard/
features/issues/components/IssueList/
features/projects/components/ProjectHeader/
features/profile/components/ProfileHeader/
```

---

# 37. Visual Consistency

When implementing a new feature, match the existing IssueForge visual language.

Before introducing a new:

* Color
* Radius
* Border
* Shadow
* Button style
* Input style
* Spacing
* Typography style

check whether an existing pattern already solves the problem.

Do not create a new visual style simply because it looks attractive in isolation.

The goal is for every screen to feel like it belongs to **the same application**.

---

# 38. Design Rules for Agents

When implementing a new screen or component:

1. Inspect existing screens before designing.
2. Purple and indigo shades are strictly forbidden across the entire product.
3. Use `#000000` (pitch black) as the primary application background for new application screens.
4. Use a neutral gray (`bg-zinc-800` / `#27272A`, white text) as the default primary CTA for new application screens, rather than a stark white button, unless the feature has a specific reason to use another treatment.
5. Use `#DDE1E5` as the primary accent sparingly and rarely for focus indicators and intentional highlights. Whenever `#DDE1E5` is used as a background or hover highlight, the text must be black (`text-black` / `#000000`). Strictly no purple or indigo.
6. Use `#E2E8F0` (primary text) and `#94A3B8` (secondary text) for text hierarchy; reserve white opacity values (`white/5`–`white/20`) for subtle borders, hover states, and other transient treatments.
7. Use subtle borders instead of heavy containers.
8. Strictly no gradients of any color in the real system (landing pages may only use neutral dark gradients, never purple or indigo). Avoid excessive shadows.
9. Use small/moderate corner radii.
10. Reuse existing shadcn/ui primitives.
11. Do not place application components in `components/ui/`.
12. Keep information-dense screens compact and scannable.
13. Always consider loading, empty, error, and success states.
14. Ensure responsive behavior.
15. Ensure accessibility.
16. Do not redesign unrelated parts of the application.
17. Do not introduce arbitrary colors or visual patterns.
18. Prefer consistency with the existing product over personal design preference.

---

# 39. Design Decision Priority

When making a design decision, use this priority:

1. Accessibility
2. Usability
3. Existing IssueForge design system
4. Existing component patterns
5. Visual consistency
6. Aesthetic preference

A visually attractive solution should never sacrifice usability or consistency.

The goal is not to make every page unique.

The goal is to make **IssueForge feel like one coherent product**.