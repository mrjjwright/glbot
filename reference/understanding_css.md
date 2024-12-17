#### Specification

```
CSS Core Specification/
├── Visual Formatting Model/
│   ├── Box Model/
│   │   ├── Physical Properties
│   │   ├── Logical Properties
│   │   └── Box Sizing
│   ├── Layout Models/
│   │   ├── Normal Flow
│   │   ├── Flexbox
│   │   └── Grid
│   └── Positioning/
│       ├── Static
│       ├── Relative
│       ├── Absolute
│       ├── Fixed
│       └── Sticky
├── Visual Effects/
│   ├── Colors
│   ├── Backgrounds
│   └── Transforms
└── Typography/
    ├── Fonts
    ├── Text Properties
    └── Writing Modes
```
    
#### Box Model

Every element is a box with 4 layers (inside to out):

```text
┌───────────────────── margin ──────────────────┐
│                                               │
│     ┌───────── border ─────────┐              │
│     │                          │              │
│     │    ┌─ padding ─┐         │              │
│     │    │           │         │              │
│     │    │  content  │         │              │
│     │    │           │         │              │
│     │    └───────────┘         │              │
│     │                          │              │
│     └──────────────────────────┘              │
│                                               │
└───────────────────────────────────────────────┘
```

Two box models:
```css
/* Default - width is just content */
box-sizing: content-box;

/* Better - width includes padding & border */
box-sizing: border-box;
```

Pro tip: Use this on everything:
```css
* {
  box-sizing: border-box;
}
```

Shorthand properties:
```css
/* clockwise: top right bottom left */
margin: 10px 20px 10px 20px;

/* vertical horizontal */
margin: 10px 20px;

/* all sides */
margin: 10px;
```

#### Box Shadows

Here's a dead simple mental model for box-shadow:

```css
box-shadow: inset x y blur spread color;
```

- `x` and `y` are the offsets of the shadow from the element.
- `blur` is the radius of the shadow.
- `spread` is the distance between the shadow and the element.
- `color` is the color of the shadow.

Think of it like this: 

```text
┌────────────────┐
│    element     │  <- Normal shadow projects outward
└────────────────┘
   ░░░░░░░░░░░

┌────────────────┐
│  ░░░░░░░░░░░  │  <- Inset shadow projects inward
└────────────────┘
```

#### Transitions

Here's the bare minimum to understand CSS transitions:


```css
.element {
  /* Property you want to animate */
  opacity: 1;
  
  /* Basic transition */
  transition: opacity 0.2s ease;
}

.element:hover {
  opacity: 0;
}
```

That's it. Transitions are just:

- The property to animate
- How long it takes
- How it moves (ease/linear/etc)

 
You can do multiple properties:

```css
transition: opacity 0.2s ease, background 0.3s linear;
```

Or all properties:

```css
transition: all 0.2s ease;
```

Common timing functions:

- `ease` - Quick ramp up, zooms through middle, gentle landing. Feels like: throwing a ball
- `linear` - Robot-like constant speed. Feels like: conveyor belt
- `ease-in` - Starts sluggish, keeps accelerating.  Feels like: car accelerating
- `ease-out` - Starts fast, gradually slows to stop.  Feels like: car braking.
- `ease-in-out` - Gentle acceleration and deceleration.  Feels like: elevator starting/stopping

A bit deeper into transitions:

Transitions are triggered when their target property CHANGES. Here's exactly when:

1. Class changes
```css
.button { opacity: 0; }
/* Triggers when .visible is added/removed */
.button.visible { opacity: 1; } 
```

1. State changes
```css
.button { opacity: 1; }
/* Triggers on mouse enter/leave */
.button:hover { opacity: 0.8; } 
```

1. Inline style changes
```js
element.style.opacity = '0'; // Triggers when changed via JS
```

1. Media query changes
```css
.button { opacity: 1; }
@media (max-width: 768px) {
  /* Triggers when viewport crosses breakpoint */
  .button { opacity: 0.8; } 
}
```

Transitions do NOT trigger:
- Initial page load/element mount
- When element is added to DOM
- Display: none ↔️ block changes
- Properties that can't be interpolated (like display)

Pro tip: To trigger on mount, trick is:
```css
.button {
  opacity: 0;
  transition: opacity 0.2s;
}
/* Add this class immediately after mount */
.button.mounted {
  opacity: 1;
}
```

#### Transitions with CSS Variables

CSS variables can be animated through their properties (not directly). Here's how:

1. State changes:
```css
.Button {
  --bg: blue;
  background: var(--bg);
  transition: background 0.2s;
}

.Button:hover {
  --bg: darkblue;
}
```

2. Media queries:
```css
:root {
  --size: 100px;
}

@media (min-width: 768px) {
  :root {
    --size: 200px;
  }
}

.Box {
  width: var(--size);
  transition: width 0.2s;
}
```

3. Parent class changes:
```css
.theme-light {
  --color: black;
}

.theme-dark {
  --color: white;
}

.Text {
  color: var(--color);
  transition: color 0.2s;
}
```

4. Prefers color scheme:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000;
  }
}

.Element {
  background: var(--bg);
  transition: background 0.2s;
}
```

Note: You can only transition the properties that use the variables, not the variables themselves.

#### How To Calculate Specificity

#### Specificity

Think of specificity as a score with 4 numbers: (A,B,C,D)

A: Style attribute      `style="color: red"`     (1,0,0,0)
B: IDs                  `#header`                (0,1,0,0)
C: Classes/attributes   `.button[type="submit"]` (0,0,1,0)
D: Elements             `div p`                  (0,0,0,1)

Examples:

```css
#header #logo /* (0,2,0,0) - Two IDs */
#header /* (0,1,0,0) - One ID */
.logo.button /* (0,0,2,0) - Two classes */
div p /* (0,0,0,2) - Two elements */
```


It's just math:
- Each ID adds 1 to the second number
- Each class/attribute adds 1 to the third number
- Each element adds 1 to the fourth number
- Highest number wins, left to right

So `#header #logo` beats `.anything` because (0,2,0,0) > (0,0,1,0)

**And style always wins!*


#### CSS Variables

Declare variables on any element (usually `:root`):

```css
:root {
  --primary: blue;
  --spacing: 8px;
  --line-height: 1.5;
}
```

Use them with `var()`:

```css
.button {
  background: var(--primary);
  padding: var(--spacing);
  
  /* Fallback if variable isn't defined */
  color: var(--text-color, black);
}
```

Variables:
- Must start with `--`
- Are case-sensitive
- Inherit like regular properties
- Can reference other variables
- Can be changed with JavaScript
- Can be scoped to components

Scoping example:
```css
.dark-theme {
  --primary: darkblue;
}

.danger {
  --primary: red;
}
```

Common use cases:
- Theme colors
- Spacing/sizing systems
- Component variations
- Dynamic values (JS)

Reading/writing from JavaScript:

```js
// Read a variable
const primary = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary');

// Write a variable
document.documentElement.style
  .setProperty('--primary', 'red');

// Write multiple with a class
document.body.classList.add('dark-theme');

// Remove variables
document.documentElement.style
  .removeProperty('--primary');
```

Common patterns:
```js
// Theme switching
const toggleTheme = (isDark) => {
  document.body.classList.toggle('dark-theme', isDark);
}

// Dynamic values
const updateSpacing = (value) => {
  document.documentElement.style
    .setProperty('--spacing', value + 'px');
}
```

#### CSS Layout Model

By default, elements are either:

```css
/* Takes up full width, stack vertically */
display: block;

/* Flows like text, sits inline with content */
display: inline;

/* Hybrid - flows inline but can have width/height */
display: inline-block;
```

Text and inline elements wrap naturally like words:

```text
This is some text with <span>inline</span> elements that
wrap naturally at the end of lines just like normal
words would do in a paragraph.

vs

[ Block elements ]
[ Always start    ]
[ On new lines    ]
```

Inline behavior:
```html
<p>
  Some text with 
  <span>inline elements</span> 
  <a>that sit</a> 
  <strong>right in the text</strong>
  without breaking to new lines
</p>
```

Block behavior:
```html
<p>This starts a new line</p>
<div>This forces a new line</div>
<h1>This also forces a new line</h1>
```

#### Text Editors vs CSS Flow

Text Editor (Monaco):
```text
Every character has the same width
| M | o | n | a | c | o |
And lines are strictly managed
```

Browser Text Flow:
```text
Characters have different widths:
|W|i|d|t|h|s| |v|a|r|y|
"WWW" is wider than "iii"

Text and elements reflow automatically:
This is a long sentence that will
automatically wrap to the next
line when it reaches the edge.

<span>Inline elements</span> and
text mix freely and reflow together
when the window resizes.
```

Key Differences:
- Text editors: Monospace grid, every character same width
- Browsers: Variable width, fluid layout, automatic reflow
- Text editors: Manual line breaks
- Browsers: Automatic wrapping based on container width

Breaking out of normal flow:
```css
/* Element is removed from document flow */
position: absolute;

/* Fixed to viewport */
position: fixed;

/* Like absolute but relative to parent */
position: relative;

/* Stays in flow but moves with scroll */
position: sticky;
```

#### Selectors & Combinators

Basic selectors:
```css
/* Tag name */
div { }

/* Class */
.button { }

/* ID */
#header { }

/* Multiple selectors */
h1, h2, .title { }
```

Combinators:
```css
/* Descendant - any child/grandchild */
.parent .child { }

/* Direct child only */
.parent > .child { }

/* Adjacent sibling - right next to */
.element + .sibling { }

/* All siblings - any after */
.element ~ .siblings { }
```

Attribute selectors:
```css
/* Has attribute */
[disabled] { }

/* Exact match */
[type="checkbox"] { }

/* Starts with */
[href^="https"] { }

/* Ends with */
[src$=".png"] { }

/* Contains */
[class*="btn"] { }
```

#### Pseudo-Classes & Elements

States:
```css
/* Mouse */
:hover  /* hovering */
:active /* clicking */

/* Forms */
:focus  /* selected input */
:checked /* checked checkbox */
:disabled /* disabled input */

/* Content */
:first-child
:last-child
:nth-child(2)
:nth-child(odd)
:empty
```

Generated content:
```css
/* Add content before/after */
.button::before {
  content: "→";
}

/* Style first letter/line */
p::first-letter { }
p::first-line { }

/* Selection highlight */
::selection {
  background: yellow;
}
```

#### Positioning & Layout Patterns

Default positioning:
```css
/* Static - the default */
position: static;
```

Every element starts with `position: static`:
- Elements flow naturally in the document
- Top/right/bottom/left properties do nothing
- Can't be a positioning parent for absolute children
- Ignores z-index

Other position values:
```css
/* Relative - offset from natural position */
.element {
  position: relative;
  top: 10px;    /* Shifts DOWN 10px from natural position */
  left: 20px;   /* Shifts RIGHT 20px from natural position */
  /* Still takes up original space in document flow */
}

/* Absolute - removed from flow, positioned to nearest non-static parent */
.element {
  position: absolute;
  top: 0;      /* Distance from parent's top edge */
  right: 0;    /* Distance from parent's right edge */
  /* No longer takes up space in document flow */
}

/* Fixed - removed from flow, positioned to viewport */
.element {
  position: fixed;
  bottom: 20px;  /* Distance from viewport bottom */
  right: 20px;   /* Distance from viewport right */
  /* Stays put even when scrolling */
}

/* Sticky - hybrid of relative and fixed */
.element {
  position: sticky;
  top: 0;
  /* Acts like relative until scroll point, then fixes */
}
```

Common centering patterns:
```css
/* Horizontal center for block elements */
.center-block {
  margin-left: auto;
  margin-right: auto;
}

/* Absolute center */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Flexbox center */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### Flexbox

Container properties:
```css
.flex-container {
  display: flex;
  
  /* Main axis */
  justify-content: space-between;
  /* start | center | end | space-around */
  
  /* Cross axis */
  align-items: center;
  /* start | center | end | stretch */
  
  /* Single or multi-line */
  flex-wrap: wrap;
  
  /* Direction */
  flex-direction: row;
  /* column | row-reverse | column-reverse */
}
```

Item properties:
```css
.flex-item {
  /* Growth factor */
  flex-grow: 1;
  
  /* Shrink factor */
  flex-shrink: 0;
  
  /* Base size */
  flex-basis: 200px;
  
  /* Shorthand */
  flex: 1 0 200px;
}
```

#### CSS Grid

Container basics:
```css
.grid {
  display: grid;
  
  /* Fixed columns */
  grid-template-columns: 200px 1fr 200px;
  
  /* Responsive columns */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  
  /* Named areas */
  grid-template-areas: 
    "header header"
    "sidebar content"
    "footer footer";
    
  /* Spacing */
  gap: 20px;
  /* row-gap | column-gap */
}
```

Item placement:
```css
.item {
  /* By line numbers */
  grid-column: 1 / 3;
  grid-row: 2 / 4;
  
  /* By area name */
  grid-area: header;
  
  /* Span multiple */
  grid-column: span 2;
}
```

#### Media Queries

Basic responsive design:
```css
/* Mobile first */
.element {
  width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .element {
    width: 33.33%;
  }
}
```

Common breakpoints:
```css
/* Small phones */
@media (max-width: 320px) { }

/* Phones */
@media (max-width: 480px) { }

/* Tablets */
@media (max-width: 768px) { }

/* Laptops */
@media (max-width: 1024px) { }

/* Large screens */
@media (max-width: 1200px) { }
```

Feature queries:
```css
/* Check for feature support */
@supports (display: grid) {
  .grid {
    display: grid;
  }
}

/* Check for multiple features */
@supports (display: grid) and (gap: 20px) {
  /* Grid with gap */
}
```


