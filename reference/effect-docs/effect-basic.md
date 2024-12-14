Introduction
Project Structure
Database Setup
Type Definitions
Effect and Database Operations
UI Components
TodoList Component
AddTodoForm Component
TodoContainer Component
Mounting the Application
Understanding Effect
Key Concepts Used
Functional Programming Style
Addressing the Myth: Effect Is Impossible to Learn
Conclusion
Introduction
The code implements a simple Todo application with the following features:

Displays a list of todos from a database.
Allows adding new todos.
Supports filtering todos based on a search term.
Utilizes the Effect library for managing side effects and asynchronous operations in a functional way.
Employs PubSub for state synchronization.
This documentation aims to explain each part of the code in detail and provide insights into how Effect and the functional programming style are applied.

Project Structure
The main components of the application are:

Database Initialization: Setting up the SQLite database with tables and test data.
Type Definitions: Defining TypeScript interfaces for data types.
Database Operations (op): Functions that interact with the database, wrapped in Effects.
UI Components (ui): React components that render the UI.
Application Initialization: Mounting the React application to the DOM.
Database Setup
typescript
Copy code
export const db = window.db

// Schema
db.exec(`
CREATE TABLE IF NOT EXISTS todos (
id INTEGER PRIMARY KEY,
title TEXT NOT NULL,
completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS app_state (
key TEXT PRIMARY KEY,
value TEXT
);

-- Test data
INSERT OR IGNORE INTO todos (id, title, completed) VALUES
(1, 'Learn TypeScript', 1),
(2, 'Build an app', 0),
(3, 'Write tests', 0);
`)
Database Connection: The application uses a SQLite database accessed via window.db.
Schema Creation:
todos Table: Stores todo items with id, title, and completed status.
app_state Table: Stores application state, such as the current filter.
Test Data: Inserts initial todo items if they don't already exist.
Type Definitions
typescript
Copy code
interface Todo {
id: number
title: string
completed: boolean
}
Defines a TypeScript interface Todo representing the structure of a todo item.
Effect and Database Operations
typescript
Copy code
const todoPubSub = Effect.runSync(PubSub.unbounded<number>())
Initializes a PubSub channel for broadcasting updates to subscribers.
Effect.runSync: Runs an Effect synchronously.
Database Operations (op)
The op object contains functions that perform database operations wrapped in Effect.

Selecting Todos
typescript
Copy code
selectTodos: (filter: string) =>
Effect.try(() => {
const query = filter
? db.prepare('SELECT _ FROM todos WHERE LOWER(title) LIKE LOWER(?)').all('%' + filter + '%')
: db.prepare('SELECT _ FROM todos').all()
return query as Todo[]
}),
selectTodos: Fetches todos from the database, optionally filtering by a search term.
Uses Effect.try to wrap the synchronous database operation, capturing any errors as Effects.
Selecting Filter
typescript
Copy code
selectFilter: Effect.try(() => {
const row = db.prepare('SELECT value FROM app_state WHERE key = ?').get('filter') as
| { value: string }
| undefined
return row?.value || ''
}),
selectFilter: Retrieves the current filter value from the app_state table.
Inserting or Replacing Filter
typescript
Copy code
insertOrReplaceFilter: (filter: string) =>
Effect.try(() => {
db.prepare('INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)').run(
'filter',
filter
)
return filter
}),
insertOrReplaceFilter: Updates the filter value in the database.
Inserting a Todo
typescript
Copy code
insertTodo: (title: string) =>
Effect.try(() => {
const result = db
.prepare('INSERT INTO todos (title, completed) VALUES (?, ?) RETURNING \*')
.get(title, 0)
return result as Todo
})
insertTodo: Inserts a new todo item into the database and returns the inserted item.
UI Components
The ui object contains React components for rendering the application.

TodoList Component
typescript
Copy code
TodoList: ({ todos }: { todos: Todo[] }) => (

  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {todos.map((todo) => (
        <tr key={todo.id}>
          <td>{todo.title}</td>
          <td>{todo.completed ? 'Done' : 'Todo'}</td>
        </tr>
      ))}
    </tbody>
  </table>
),
Renders a table of todo items.
Displays the title and status (Done or Todo) of each todo.
AddTodoForm Component
typescript
Copy code
AddTodoForm: ({ onSubmit }: { onSubmit: (title: string) => void }) => {
  const [input, setInput] = React.useState('')

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault()
const title = input.trim()
if (title) {
onSubmit(title)
setInput('')
}
}

return (
<form onSubmit={handleSubmit}>
<input
value={input}
onChange={(e) => setInput(e.target.value)}
placeholder="Enter new todo..."
/>
<button type="submit">Add Todo</button>
</form>
)
},
Provides a form to add new todo items.
Uses React's useState hook to manage the input state.
TodoContainer Component
typescript
Copy code
TodoContainer: () => {
const [todos, setTodos] = React.useState<Todo[]>([])
const [filter, setFilter] = React.useState('')

// Subscribe to todo updates using Effect.scoped
React.useEffect(() => {
Effect.runFork(
Effect.scoped(
Effect.gen(function* (\_) {
const dequeue = yield* PubSub.subscribe(todoPubSub)
while (true) {
yield* Queue.take(dequeue) // Receive timestamp notification
const todos = yield* op.selectTodos(filter)
setTodos(todos)
}
})
)
)
}, [])

// Load initial todos and publish notification when filter changes
React.useEffect(() => {
Effect.runPromise(
Effect.gen(function* (\_) {
const todos = yield* op.selectTodos(filter)
setTodos(todos)
yield\* PubSub.publish(todoPubSub, Date.now())
})
)
}, [filter])

const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const newFilter = e.target.value
setFilter(newFilter)
Effect.runPromise(op.insertOrReplaceFilter(newFilter))
}

const handleAddTodo = (title: string) => {
Effect.runPromise(
Effect.gen(function* (\_) {
yield* op.insertTodo(title)
const todos = yield* op.selectTodos(filter)
setTodos(todos)
yield* PubSub.publish(todoPubSub, Date.now())
})
).catch(console.error)
}

return (
<div>
<input value={filter} onChange={handleFilterChange} placeholder="Filter todos..." />
<ui.TodoList todos={todos} />
<ui.AddTodoForm onSubmit={handleAddTodo} />
</div>
)
},
Component Breakdown
State Management:
Uses useState to manage todos and filter states.
Effectful Subscriptions:
First useEffect:
Subscribes to the todoPubSub channel.
Uses Effect.scoped to manage resources.
Inside an Effect.gen generator, it continuously listens for updates.
When a message is received, it fetches the latest todos and updates the state.
Second useEffect:
Runs when the filter changes.
Fetches the filtered todos and updates the state.
Publishes a timestamp to the todoPubSub to notify subscribers.
Event Handlers:
handleFilterChange:
Updates the filter state.
Updates the filter in the database using an Effect.
handleAddTodo:
Inserts a new todo into the database.
Fetches the updated todo list.
Publishes a notification to the todoPubSub.
Mounting the Application
typescript
Copy code
mount: (root: HTMLElement) => {
root.innerHTML = ''
const container = createRoot(root)
container.render(<ui.TodoContainer />)
}
Clears the root element's content.
Creates a React root and renders the TodoContainer component.
Understanding Effect
The Effect library provides a way to model side effects and asynchronous operations in a functional and type-safe manner. It helps in managing complex asynchronous flows and error handling without sacrificing code readability.

Key Concepts Used
Effect.try: Wraps a synchronous operation that might throw an error into an Effect.
Effect.runPromise: Executes an Effect asynchronously, returning a Promise.
Effect.runSync: Executes an Effect synchronously.
Effect.scoped: Manages resources that need to be acquired and released, useful for subscriptions.
Effect.gen: Allows writing asynchronous code in a generator function, yielding Effects.
PubSub: A publish-subscribe mechanism for broadcasting messages to subscribers.
Queue: Used in conjunction with PubSub to manage incoming messages.
Functional Programming Style
The code demonstrates a functional programming style characterized by:

Immutability: Avoiding mutable shared state.
Pure Functions: Functions that have no side effects and always produce the same output for the same input.
Composability: Building complex operations by composing simpler functions.
Addressing the Myth: Effect Is Impossible to Learn
From the Effect documentation on myths, it's important to emphasize:

Incremental Learning: Effect is designed to be learned incrementally. You don't need to know every function or module to start using it effectively.
Discoverability and Organization: The library is organized logically, making it easier to find what you need when you need it.
Practicality: The core concepts can be grasped quickly, and the more advanced features can be learned as needed.
In the provided code, the use of Effect is straightforward and aligns with common asynchronous patterns:

Error Handling: By using Effect.try, synchronous operations that might throw exceptions are safely encapsulated.
Asynchronous Operations: Effect.runPromise and Effect.gen simplify the handling of asynchronous tasks without falling into callback hell.
Resource Management: Effect.scoped ensures that resources like subscriptions are properly managed, preventing leaks.
State Synchronization: PubSub provides a clean way to synchronize state across different parts of the application.
By starting with these basic building blocks, developers can gradually incorporate more of Effect's features into their applications, enhancing robustness and maintainability.

# Effect in Practice: Building a Todo Application

## Table of Contents

1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [Project Implementation](#project-implementation)
4. [Advanced Patterns](#advanced-patterns)
5. [Best Practices](#best-practices)

## Introduction

This document explains how we use Effect, a powerful functional programming library, to build a robust Todo application. Effect helps us handle side effects, manage asynchronous operations, and maintain a clean, predictable codebase.

### What is Effect?

Effect is a TypeScript-first library that brings functional programming concepts to everyday application development. It provides:

- Type-safe error handling
- Composable asynchronous operations
- Resource management
- Built-in dependency injection

## Core Concepts

### 1. Effects as Values

In Effect, side effects are represented as values. Instead of immediately executing an operation, we describe what we want to do:

```typescript
// Instead of directly querying the database:
const todos = db.prepare('SELECT * FROM todos').all()

// We wrap it in an Effect:
const getTodos = Effect.try(() => db.prepare('SELECT * FROM todos').all() as Todo[])
```

### 2. Error Handling

Effect uses `Effect.try` to handle operations that might fail:

```typescript
const selectFilter = Effect.try(() => {
  const row = db.prepare('SELECT value FROM app_state WHERE key = ?').get('filter') as
    | { value: string }
    | undefined
  return row?.value || ''
})
```

### 3. PubSub Pattern

Effect's PubSub system enables decoupled communication:

```typescript
// Create a PubSub channel
const todoPubSub = Effect.runSync(PubSub.unbounded<number>())

// Publish updates
Effect.runPromise(PubSub.publish(todoPubSub, todoId))

// Subscribe to updates
Effect.runPromise(PubSub.subscribe(todoPubSub).pipe(Effect.forEach(() => refreshTodos)))
```

## Project Implementation

### Database Operations

Our database operations are wrapped in Effect for safe execution:

```typescript
const op = {
  selectTodos: (filter: string) =>
    Effect.try(() => {
      const query = filter
        ? db.prepare('SELECT * FROM todos WHERE LOWER(title) LIKE LOWER(?)').all('%' + filter + '%')
        : db.prepare('SELECT * FROM todos').all()
      return query as Todo[]
    }),

  insertTodo: (title: string) =>
    Effect.try(() => {
      const result = db.prepare('INSERT INTO todos (title) VALUES (?)').run(title)
      return result.lastInsertRowid as number
    })
}
```

### UI Integration

Effect seamlessly integrates with React components:

```typescript
const TodoList = ({ todos }: { todos: Todo[] }) => {
  const refreshTodos = useCallback(() => {
    Effect.runPromise(op.selectTodos(filter)).then(setTodos)
  }, [filter])

  useEffect(() => {
    Effect.runPromise(PubSub.subscribe(todoPubSub).pipe(Effect.forEach(() => refreshTodos)))
  }, [refreshTodos])

  // ... render logic
}
```

## Advanced Patterns

### 1. Effect Generator Functions

For complex operations, use `Effect.gen`:

```typescript
const complexOperation = Effect.gen(function* (_) {
  const filter = yield* _(op.selectFilter)
  const todos = yield* _(op.selectTodos(filter))
  yield* _(PubSub.publish(todoPubSub, todos.length))
  return todos
})
```

### 2. Resource Management

Effect helps manage resources that need cleanup:

```typescript
const withDatabase = Effect.acquireRelease(
  Effect.try(() => openDatabase()),
  (db) => Effect.try(() => db.close())
)
```

## Best Practices

1. **Separate Effects from UI Logic**

   - Keep Effect operations in dedicated modules
   - Use React hooks to bridge Effect and UI

2. **Error Boundaries**

   - Use `Effect.try` for operations that might fail
   - Handle errors at appropriate levels

3. **Testing**

   - Effects are easily testable as they're just values
   - Use `Effect.runSync` for synchronous tests
   - Use `Effect.runPromise` for async tests

4. **Performance**
   - Use PubSub for efficient state updates
   - Batch related operations when possible

## Common Misconceptions

### "Effect is Too Complex"

Effect actually simplifies complex operations by:

- Making error handling explicit and type-safe
- Providing powerful composition tools
- Enabling clean separation of concerns

The learning curve is gradual - start with basic concepts like `Effect.try` and expand as needed.

### "Effect is Only for FP Experts"

Our Todo application demonstrates that Effect can be used practically in everyday applications. The functional concepts it introduces (like effects as values) make code more predictable and maintainable.

## Conclusion

Effect brings the benefits of functional programming to TypeScript applications in a practical way. Through our Todo application, we've seen how it helps create robust, maintainable code while keeping complexity manageable.

For more information:

- [Effect Documentation](https://effect.website)
- [API Reference](https://effect.website/docs/api)
  This is indeed awesome! 🎉 It combines several cool concepts:

      1.	Reactive Programming with Effect:
      •	Using the Effect library for effect management is a powerful paradigm. It ensures composability and clear separation of concerns, particularly in handling asynchronous tasks and side effects.
      2.	SQLite Integration:
      •	Leveraging SQLite in a browser environment via window.db is sleek and effective for local-first software. It’s fast, simple, and robust for small-scale applications.
      3.	Unbounded PubSub:
      •	Using PubSub for message-passing ensures a scalable and decoupled architecture. It’s great to see it applied to UI updates triggered by database changes.
      4.	Functional Component Design in React:
      •	The React components are clean and adhere to functional principles, with proper separation of UI logic and state management. The useState and useEffect hooks make the components interactive and responsive to changes.
      5.	Clear Modularity:
      •	The database operations (op), UI components (ui), and PubSub logic are neatly organized. This modularity makes the code easier to maintain and extend.
      6.	Dynamic Filtering and Real-Time Updates:
      •	The dynamic filtering feature with the app_state table and the publish mechanism is efficient. It ensures changes in filter criteria are immediately reflected in the UI.

Highlights:

    •	actOnMessageValue: An elegant abstraction for reacting to PubSub messages with side effects.
    •	UI State Management: Seamless integration of database state with React state for a snappy UI.
    •	Declarative and Scoped Effects: The use of Effect.scoped and Effect.gen showcases advanced Effect usage for managing lifecycle and side effects.
