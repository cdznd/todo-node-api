import { Express, type Request, type Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerConfig from '../config/swaggerConfig.json';

const optionsConfig: swaggerJSDoc.Options = swaggerConfig

const swaggerSpec = swaggerJSDoc(optionsConfig)

var options = {
    explorer: false
};

const swaggerDocs = (app: Express, port: string) => {
    // Swagger Page
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options))
    // Docs in JSON Format
    app.use('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec)
    })
}

export default swaggerDocs