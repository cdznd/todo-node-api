export const SWAGGER_CONFIG = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'TODO Node Express API Documentation',
      version: '0.1.0',
      description:
                'This is a simple TODO CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'Fabricio G Santos (cdznd)',
        url: 'https://fabricio-tech.dev',
        email: 'floyd9732@gmail.com'
      }
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: {
      cookieAuth: []
    }
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
}
