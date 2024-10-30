import { type Express, type Request, type Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { SWAGGER_CONFIG } from '../config/swagger.config'

const optionsConfig: swaggerJSDoc.Options = SWAGGER_CONFIG

const swaggerSpec = swaggerJSDoc(optionsConfig)

const options = {
  explorer: false
}

const swaggerDocs = (app: Express, port: string): void => {
  // Swagger Page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options))
  // Docs in JSON Format
  app.use('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

export default swaggerDocs
