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

IssueForge uses a very dark base with subtle purple undertones.

## Primary Background

```text
#04020E
```

This is the primary application background.

It should be treated as the foundation of the IssueForge interface.

Use it for:

* Authentication backgrounds
* Main application backgrounds
* Large page surfaces
* Empty surrounding space

Do not replace the background with generic Tailwind gray/black values unless there is a specific design reason.

---

# 3. White / Neutral System

The primary neutral system is white with varying opacity.

Instead of creating many unrelated gray colors, use opacity levels to establish hierarchy.

Common levels:

```text
white
white/90
white/80
white/70
white/65
white/55
white/45
white/40
white/35
white/30
white/28
white/20
white/18
white/16
white/12
white/10
white/6
```

### Primary text

Use:

```text
text-white
```

for:

* Page titles
* Important content
* Primary button text
* Important navigation items

### Secondary text

Use approximately:

```text
text-white/55
text-white/65
```

for:

* Descriptions
* Supporting information
* Secondary navigation
* Helper text

### Muted text

Use approximately:

```text
text-white/35
text-white/40
text-white/45
```

for:

* Metadata
* Timestamps
* Hints
* Less important information
* Secondary labels

### Placeholder text

Use approximately:

```text
text-white/25
text-white/28
text-white/30
```

Placeholder text must remain visually weaker than actual input text.

---

# 4. Accent Color

Purple remains part of the IssueForge identity, but it is **not the default color for every primary action**.

The existing brand purple is:

```text
#8D6FE8
```

and its lighter hover variation:

```text
#9A7EF0
```

Purple may be used for:

* Selected states
* Focus indicators
* Important accents
* Active navigation
* Links when appropriate
* Status or feature-specific highlights
* Brand elements

However, the current authentication design establishes **white as the primary CTA color**.

Do not automatically make every primary button purple.

The use of purple should be intentional and restrained.

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
2. Treat the existing authentication screen as a visual reference.
3. Use `#04020E` as the primary dark foundation.
4. Use white as the default primary CTA unless the feature has a specific reason to use another treatment.
5. Use purple accents sparingly.
6. Use white opacity levels for neutral hierarchy.
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
