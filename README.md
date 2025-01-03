# systematic

systematic is an editor for building systems - simple programs made of lines that describe effects.

## hello world

Open systematic. Create a new system file (or open an existing one). The main system editor appears - a Monaco-based text editor with a monospace font at 1.25rem line height.

Type:

```
all
text "Hello"
text "Parallel"
text "World"

to text " "
```

As you type each line, systematic parses it into an effect. The editor provides subtle hints - autocompletion for effect names, validation, hover documentation.

Below the editor is the output panel. When you run the system (⌘+Enter), it shows:

```
Hello Parallel World
```

## design

The UI is minimal - just monospaced text in simple panels on a grid. Each panel is a multiple of our base units (1.25rem × 1ch). The system editor panel displays:

- Monaco editor (top)
- Output (bottom)
- Simple player controls

Monaco's line height and font match our grid, so it integrates seamlessly. Every character aligns to the grid.

## concepts

- system: a text file containing lines of effects
- line: a single effect with its configuration
- effect: something that can be run to produce a result

The editor parses each line into an effect as you type. Blank lines separate effect groups. Running a system executes its effects in sequence.

Would you like me to expand on any particular aspect of this design? I've tried to stay focused on just the core concepts needed for hello world.
