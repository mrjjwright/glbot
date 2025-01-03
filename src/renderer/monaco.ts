import * as monaco from 'monaco-editor'

// Configure Monaco workers
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return '/js/json.worker.js'
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return '/js/css.worker.js'
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return '/js/html.worker.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/js/ts.worker.js'
    }
    return '/js/editor.worker.js'
  }
}

export function createEditor(container: HTMLElement) {
  const defaultContent = `all
text "Hello"
text "Parallel"
text "World"

to text " "`

  const editor = monaco.editor.create(container, {
    value: defaultContent,
    language: 'plaintext',
    theme: 'vs-dark',
    fontFamily: 'monaco, monospace',
    fontSize: 16,
    lineHeight: 20,
    minimap: { enabled: false },
    wordWrap: 'on',
    automaticLayout: true
  })

  // Handle Cmd+Enter
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
    //const text = editor.getValue()
    // TODO: Parse and run effects
  })

  return editor
}
