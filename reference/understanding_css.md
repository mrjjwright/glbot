#### Box Model

Every element is a box with 4 layers (inside to out):

```text
┌───────────────────── margin ──────────────────┐
│                                               │
│     ┌───────── border ─────────┐             │
│     │                          │             │
│     │    ┌─ padding ─┐        │             │
│     │    │           │        │             │
│     │    │  content  │        │             │
│     │    │           │        │             │
│     │    └───────────┘        │             │
│     │                          │             │
│     └──────────────────────────┘             │
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


