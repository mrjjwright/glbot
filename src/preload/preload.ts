console.log('db loaded', document)

async function main() {
  try {
    // const db = await initDb({ reset: true })
    // const api = {
    //   ...electronAPI,
    //   db: {
    //     // Expose your database methods here
    //   }
    // }
    // // For development
    // if (process.env.NODE_ENV === 'development') {
    //   window.electron = api
    //   window.db = db
    // }
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error // Still prevent app from starting with broken DB
  }
}

main()
