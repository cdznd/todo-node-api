import { createServer } from './utils/appServer'
import { dbConnect } from './utils/dbServer'
import { PORT } from './config'

const app = createServer()
app.listen(PORT, async () => {
  console.log(`App is running on port ${PORT}`)
  await dbConnect()
})
