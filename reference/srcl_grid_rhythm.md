# SRCL Grid System

The UI is built on a typographic grid system with two key units:

## Core Units

- **Horizontal**: `1ch` (width of "0" character, ~8-9px)
- **Vertical**: `1.25rem` (20px at base font size of 16px)

## Rules

1. Use `ch` units for horizontal spacing:

   - Gaps between elements
   - Padding
   - Widths

2. Use multiples of `1.25rem` for vertical spacing:

   - Line heights
   - Margins between blocks
   - Padding top/bottom
   - Heights

3. Never use pixel values directly - align to the grid system

4. Use `--theme-line-height-base` when you can. It is the vertical multiple defined as `1.25rem`.

## Examples

- see components/Button.module.scss
