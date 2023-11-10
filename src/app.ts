import { createServer } from './utils/appServer'
import { dbConnect } from './utils/dbServer'
import { PORT } from './config'
import swaggerDocs from './utils/swagger'

const app = createServer()

app.listen(PORT, async () => {
  console.log(`App is running on port ${PORT}`)
  swaggerDocs(app, PORT)
  await dbConnect()
})
