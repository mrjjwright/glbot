# DatePicker Component Design

## Component Structure
```
┌─ DatePicker_root ──────────────────────────┐
│ ┌─ DatePicker_controls ───────────────────┐ │
│ │ ┌─────┐ ┌─────────────────┐ ┌─────┐    │ │
│ │ │  ▲  │ │ 2024 JANUARY    │ │  ▼  │    │ │
│ │ └─────┘ └─────────────────┘ └─────┘    │ │
│ └───────────────────────────────────────┘ │
│ ┌─ DatePicker_header ──────────────────┐  │
│ │ SU  MO  TU  WE  TH  FR  SA          │  │
│ └───────────────────────────────────────┘ │
│ ┌─ DatePicker_days ────────────────────┐  │
│ │ 31  01  02  03  04  05  06          │  │
│ │ 07  08  09  10  11  12  13          │  │
│ │ 14  15  16  17  18  19  20          │  │
│ │ 21  22  23  24  25  26  27          │  │
│ │ 28  29  30  31  01  02  03          │  │
│ │ 04  05  06  07  08  09  10          │  │
│ └───────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

## CSS Classes

```css
.DatePicker_root {
  display: inline-block;
  user-select: none;
}

.DatePicker_controls {
  align-items: center;
  background: var(--theme-border);
  display: flex;
  justify-content: space-between;
}

.DatePicker_button {
  align-self: stretch;
  background: none;
  border: none;
  color: var(--theme-text);
  cursor: pointer;
  display: inline-block;
  line-height: calc(var(--theme-line-height-base) * 1em);
  margin: 0;
  outline: 0;
  padding: 0 1ch 0 1ch;
}

.DatePicker_button:focus {
  background: var(--theme-focused-foreground);
  outline: 0;
}

.DatePicker_date {
  min-width: 10%;
  padding: 0 var(--space) 0 var(--space);
  text-align: left;
  width: 100%;
}

.DatePicker_header {
  background: var(--theme-border);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.DatePicker_days {
  background: var(--theme-border-subdued);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, min-content);
  align-items: start;
  min-height: calc(var(--theme-line-height-base) * 6em);
}

.DatePicker_cell {
  outline: none;
  padding: 0 var(--space) 0 var(--space);
  text-align: center;
}

.DatePicker_cell:focus {
  background: var(--theme-focused-foreground);
}
```


