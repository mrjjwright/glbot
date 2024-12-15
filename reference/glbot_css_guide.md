# GLBot Grid System

The UI is built on a typographic grid system with two key units:

#### Core Units

- **Horizontal**: `1ch` (width of "0" character, ~8-9px)
- **Vertical**: `1.25rem` (20px at base font size of 16px)

#### Rules

1. Use `ch` units for horizontal spacing:

   - Gaps between elements
   - Padding
   - Widths

2. Use multiples of `1.25rem` for vertical spacing:

   - Line heights
   - Margins between blocks
   - Padding top/bottom
   - Heights

3. Never use pixel values directly, align to the grid system

4. Use `--theme-line-height-base` when you can. It is the vertical multiple defined as `1.25rem`.


#### Theming with CSS Variables:
  
  All colors, backgrounds, and typography rely on custom properties (e.g. `var(--theme-border)`). Themes (e.g., `theme-blue`, `theme-light`, `theme-dark`) modify these variables globally. By adjusting these variables, you can redefine the entire interface’s look and feel without rewriting component-specific rules.
  
#### Consistent Spacing & Sizing:

- Use `ch` for horizontal measures (padding, margins, widths).
- Use multiples of `--theme-line-height-base` (`1.25rem`) for vertical spacing (line heights, block margins, vertical padding).
- Avoid arbitrary pixel values.  sstick to the defined rhythm for a cohesive, grid-aligned layout.
- Accessible Interaction States:
- Hover and focus states are clearly defined with foreground/background shifts using theme variables. Each interactive element (:hover, :focus) provides a visual cue to enhance usability.
  
#### No Direct Pixels for Layout:
The system relies on typographic units (e.g., `1ch` for horizontal, `calc(var(--theme-line-height-base) \* n)` for vertical). This ensures scalability and responsiveness.

#### Modular, Reusable Components:
Classes follow a naming pattern (.Component_element, .Component_modifier) to keep styles scoped and maintainable. This BEM-like structure ensures that styling and layout rules are predictable and easily overridden as needed.

#### What’s Possible With This System

- Dynamic Theming: Change a single body class (e.g., theme-dark) to switch the entire palette.
- Consistent Typography: All font sizes, line-heights, and letter spacing follow the theme’s base line-height, ensuring readability.
- Responsive Sizing: Because layouts are defined in ch and rem, components adapt naturally to different device sizes or user font settings.
- Flexible Interaction: Easily add focus/hover states to new elements by using existing pattern variables and transitions.
- Extending Components: Add new modifiers (e.g., .Button_primary, .Button_disabled) to tweak appearance without altering base styles.
  
#### Standardize vertical spacing calculations:

```css
/* Replace all variations with consistent format */
calc(var(--theme-line-height-base) * 1rem)

/* Instead of */
calc(16px * var(--theme-line-height-base))
calc(8px * var(--theme-line-height-base))
1.25rem
```

#### Standardize horizontal spacing calculations:

```css
/* Use consistent ch units */
padding: 0 2ch;
width: 4ch;
gap: 2ch;

/* Instead of mixed units */
padding: 0 1ch;
width: 8px;
```

#### Standardize border definitions:
```css
/* Group related properties */
border: 0;
border-radius: 4px;

/* Instead of */
border: 0;
border-radius: 4px;
border-spacing: 0;
```

#### Standardize transitions:
```css
/* Group transition properties */
transition: all 0.2s ease;
transition-property: padding, background;

/* Instead of scattered transitions */
transition: all 0.2s ease;
transition-property: padding;
```

#### Standardize font sizes:
```css
/* Use rem instead of px */
font-size: 1rem;

/* Instead of */
font-size: 16px;
```

#### Group related properties:
```css
/* Layout properties together */
display: flex;
align-items: center;
justify-content: space-between;

/* Visual properties together */
background: var(--theme-background);
color: var(--theme-text);
```

*The goal is consistency in units and property grouping while maintaining the same functionality.*