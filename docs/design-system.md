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

* Near-black backgrounds
* Subtle purple undertones
* White primary actions
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

* Excessive gradients
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
| Primary Accent     | `#5E6AD2` | Primary interactive accents, active states, focus indicators |
| App Background     | `#0F1115` | Main application canvas                                      |
| Surface Background | `#1A1D24` | Cards, sidebars, panels, kanban columns                      |
| Primary Text       | `#E2E8F0` | Headings, important content, primary labels                  |
| Secondary Text     | `#94A3B8` | Metadata, descriptions, timestamps, breadcrumbs              |

These colors should be reused consistently rather than replaced with arbitrary Tailwind colors.

---

## 2.1 Primary Accent

```text
#5E6AD2
```

Soft Indigo is the primary IssueForge accent color.

Use it for:

* Primary interactive accents
* Active navigation states
* Selected states
* Focus indicators
* Important links
* Interactive controls
* Brand accents
* Feature-specific highlights

The accent should be used intentionally.

Do not apply `#5E6AD2` to every button, card, border, or decorative element.

The accent should establish interaction and hierarchy without making the entire interface purple.

---

## 2.2 App Background

```text
#0F1115
```

This is the primary application canvas.

Use it for:

* Main application backgrounds
* Page backgrounds
* Empty surrounding space
* Application shell
* Authentication backgrounds when appropriate

The background should remain visually quiet so that surfaces, text, and interactive elements establish hierarchy.

Do not replace it with arbitrary Tailwind values such as:

```text
bg-black
bg-gray-950
bg-slate-950
```

unless there is a specific design reason.

---

## 2.3 Surface Background

```text
#1A1D24
```

This is the elevated surface color used to distinguish UI elements from the main application canvas.

Use it for:

* Cards
* Sidebars
* Panels
* Kanban columns
* Dropdown surfaces
* Settings sections
* Important grouped content
* Elevated application areas

Surfaces should provide subtle separation from the application background.

Avoid creating many different surface colors.

The primary hierarchy should generally be:

```text
#0F1115
     ↓
#1A1D24
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

Primary text should provide strong contrast against the dark background without using pure white everywhere.

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
#5E6AD2 ←──── Interaction / Accent
                       |
                       ↓
                  #94A3B8
                 Secondary Text

#1A1D24 ←──── Elevated Surfaces

#0F1115 ←──── Application Canvas
```

The interface should primarily consist of:

```text
App Background
      +
Surface Background
      +
Primary Text
      +
Secondary Text
      +
Accent
```
---

## 2.7 Navbar and Sidebar Colors

The top navbar and left sidebar use dedicated shades that sit between the app background and elevated surfaces, giving the application shell a distinct sense of structure.

| Element                     | Color     | Usage / Visual Detail                                                          |
| ---------------------------- | --------- | -------------------------------------------------------------------------------- |
| Top Navbar                  | `#0D0E12` | Darker than the canvas; anchors search, notifications, and profile.             |
| Left Sidebar                | `#12141A` | Slightly deeper shade between canvas and top bar for a distinct side panel.      |
| Active Nav Item (BG)         | `#1E222D` | Active item background fill (e.g., current project or tab).                     |
| Active Nav Item (Accent)     | `#5E6AD2` | Soft Indigo for icon/text or a 2px left border strip.                           |
| Hover Nav Item (BG)          | `#171A21` | Subtle hover effect for inactive nav items.                                     |
| Dividers & Borders           | `#222631` | 1px solid border separating sidebar/navbar from the canvas.                     |

Usage notes:

* The top navbar and sidebar should **not** reuse `#0F1115` (App Background) or `#1A1D24` (Surface Background) directly — they use their own darker/deeper shades so the application shell reads as structurally distinct from both the canvas and elevated content surfaces.
* Active nav items should combine `#1E222D` as the background fill with `#5E6AD2` as either the icon/text color or a 2px left-border accent strip — not both applied at full strength, to avoid overemphasis.
* Hover states (`#171A21`) should only apply to inactive items; the active item's state should not change on hover.
* Use `#222631` for the 1px border separating the navbar/sidebar from the main canvas, consistent with the broader restrained border system in Section 12.

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

`#5E6AD2` is the primary IssueForge accent.

Use it for interaction and emphasis rather than decoration.

Examples:

```text
Active navigation
    → #5E6AD2

Focused input
    → #5E6AD2

Selected item
    → #5E6AD2

Important link
    → #5E6AD2
```

The accent should not automatically be used for every primary CTA.

For example, the authentication screen currently uses a high-contrast white primary CTA. This pattern may continue where strong contrast is more appropriate than an accent-colored button.

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

## 4.2 Legacy Authentication Colors

The existing authentication screen may contain older colors such as:

```text
#04020E
#8D6FE8
#9A7EF0
```

These are considered **legacy visual references**, not the primary application palette.

When modifying existing authentication screens, preserve their established visual identity unless the task explicitly requires migration to the new palette.

For all **new application features**, use the current IssueForge palette:

```text
#5E6AD2
#0F1115
#1A1D24
#E2E8F0
#94A3B8
```

Do not mix the legacy purple and background values into new application screens without a specific design reason.

---

# 5. Primary Actions

The current authentication screen establishes a **white primary action button**.

Example:

```text
bg-white
text-black
hover:bg-gray-300
```

Primary actions should generally use a high-contrast white button against the dark background.

Examples:

```text
Create account
Log in
Create issue
Create project
Save changes
```

Primary button characteristics:

* White background
* Black/dark text
* Small to moderate radius
* Clear hover state
* Clear disabled state
* Strong contrast
* No unnecessary gradient

The primary CTA should stand out because of **contrast**, not because of glow or excessive effects.

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

Use subtle white overlays to create hierarchy against the near-black background.

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

Authentication screens establish the strongest visual reference for the product.

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
minimal purple undertones
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

Normal application pages should remain more information-dense.

---

# 27. Hero Images

Large hero imagery may be used on authentication or marketing-oriented pages.

When using an image:

* Use a dark overlay when necessary
* Preserve text readability
* Avoid overly bright imagery
* Maintain the dark IssueForge aesthetic

The current registration screen uses a dark gradient overlay to ensure readable white text.

Do not add hero imagery to normal CRUD/application screens simply for decoration.

---

# 28. Navigation

Navigation should be predictable and compact.

The active navigation item should be distinguishable using subtle emphasis.

Preferred active-state techniques:

* Slight background
* Increased text contrast
* Purple accent
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
2. Treat the existing authentication screen as a visual reference, but note it uses the legacy palette (`#04020E`, `#8D6FE8`, `#9A7EF0`) — do not carry those specific values into new application screens.
3. Use `#0F1115` as the primary application background for new application screens.
4. Use white as the default primary CTA unless the feature has a specific reason to use another treatment.
5. Use the `#5E6AD2` accent sparingly, for interaction and emphasis rather than decoration.
6. Use `#E2E8F0` (primary text) and `#94A3B8` (secondary text) for text hierarchy; reserve white opacity values (`white/5`–`white/20`) for subtle borders, hover states, and other transient treatments.
7. Use subtle borders instead of heavy containers.
8. Avoid excessive shadows and gradients.
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