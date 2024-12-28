**systematic** - a simple way to work with your computer

#### grids

systematic has a base modern css stylesheet hand maintained with css variables that setup a strict grid and subgrid layout.

cols are 10 spaces wide and rows are 1 line high

a `--space` is `1ch` of monospace font

a `--line` is `1.25rem` high or about `20px`

cells are 1 or 2 or 3 or 4 or 5 cols wide and 1 line high

a line of cells is a sequence of cells

a tile is a sequence of lines

lines can sequence left to right or up and down and so can tiles, like grid and flex is modern css

lines and tiles of cells are placed on grids, which are the pages of systematic

we use `grid` instead of page because we want to think of the internet not as a collection of pages but as a collection of atomic cells...

identified by their content

think of content like character, it doesn't matter what you are _called_, it simply matters what you are

these grids are served up as urls and are stored in git, along with the content of the cells

the foundation of systematic is plain content in cells backed by git and run on simple always supported, quick and reliable web tech

so grid files are special json files in git that point to cells in other files in the repo

#### control and edit

the ui of **systematic** is oriented towards giving you 2 strong functions to control its objects:

> objects are tiles, lines, or cells

**controller** (top): a unique cell editor made up of special objects that can be navigated, selected, and linked together and with pieces of content on your computer

**editor** (bottom): view and edit the content of selected objects using the built-in Monaco editor, simple rendered forms or a good tool on your computer

the ui is then a simple stacked web based editor that can be anchored to the side of some work product if desired or used standalone in flexible ways

#### control

controlling the computer is aided by git and setting up content from your computer to be transformed to new more useful content on your computer

by running some function on it with or without ai in the mix

but if you mess up you always use git to get back to a known good state

you can use ai to condense information to more useful forms

you can store the result in git and rinse and repeat

if you mess up you can go back

you will need code for useful transformations and to run useful computations and processes and programs and effects and uis and all sorts of cool things

you can use the computer to do anything you want especially with help of the internet and ai

so the controller is the tool you will use where you setup content that is important to you

and to do this you need some kind of prototypal objects to build all the objects you need and want

so we start with our alphabet objects

key value, and functions

#### key value tile

a key value tile stores content or any data in a key value format

one physcal file | chunk | value | property of content per line

key can be specified by the user and double as label or just be uuid

one cell in each line of the tile holds the content, the rest hold the optional label

key value tiles are json files in git with their values often mapping to actual content in other files in the repo

#### function tiles

a function tile is roughly a Typescript function
each line in the function is roughly like a line of Typescript

function tiles have input lines, input validation lines, instruction lines, invariant lines, output lines, output validation lines

function tiles are json files from which typescript code is generated. that code loads the content, and runs the function setting up any needed systems

#### basic example

a key value tile holds a prompt, a json schema, an example json all to build a little custom JSON editor

a function tile with input as storage tile, and ai model name

first line uses `cat` instruction cell to concatenate all content from key value tile

second line calls ai model with name with concatenated prompt

ouput line holds the ai result
