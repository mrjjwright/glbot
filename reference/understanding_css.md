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

