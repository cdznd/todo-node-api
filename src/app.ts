import { createServer } from './utils/appServer'
import { dbConnect } from './utils/dbServer'
import { PORT } from './config/app.config'

const app = createServer()

dbConnect()

app.listen(PORT, async () => {
  console.log(`App is running on port ${PORT}`)
})