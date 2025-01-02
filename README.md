**systematic** - a simple way to work with your computer

#### grids

systematic has a base modern css stylesheet hand maintained with css variables that setup a strict grid and subgrid layout.

cols are 4 spaces wide and rows are 1 line high

a `--space` is `1ch` of monospace font

a `--line` is `1.25rem` high or about `20px`

a tile is 5 columns wide and multiple lines high,
all lines past the visible ones are revealed via scrolling

#### controller and editor

the ui of **systematic** is oriented towards giving you 2 strong functions to control its tiles:

**controller** (top): the controller is made up of 3 main parts:

`Graph` - organize tiles in useful ways
`Tiles` - filter, search and pick tles
`Runner` - run tiles

**editor** (bottom): view and edit the content of selected objects using the built-in Monaco editor, simple rendered forms or a good tool on your computer

the ui is then a simple stacked web based editor that can be anchored to the side of some work product if desired or used standalone in flexible ways

#### tiles

each tile does one thing and one thing well and can be composed with other tiles to do more things

tiles are designed to describe useful operations on top of the JavaScript virtual machine and are ultimately backed by the powerful Typescript Effect library. each tile is basically an effect

each tile is not a function, it is a descriptive declarative value
