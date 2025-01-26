import { createServer } from './utils/appServer'
import { dbConnect } from './utils/dbServer'
import { PORT } from './config/app.config'

const app = createServer()

void (async () => {
  try {
    await dbConnect()
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start the application:', error)
    process.exit(1) // will force the process to exit as quickly as possible even if there are still asynchronous operations pending
  }
})()
