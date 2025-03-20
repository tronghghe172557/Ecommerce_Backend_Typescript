import { Express, NextFunction, Request, Response } from 'express'
import { readFileSync } from 'fs'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yaml' // parse the YAML file.
import path from 'path'

const filePath = path.join(__dirname, '../../../docs/openapi.yml')

export function configSwagger(app: Express) {
  let swaggerDocument = readSwaggerFile() // read the YAML file.

  app.use('/api-docs', swaggerUi.serve, (req: Request, res: Response, next: NextFunction) => {
    swaggerDocument = readSwaggerFile() // swaggerDocument is updated every time the API is called.

    return swaggerUi.setup(swaggerDocument)(req, res, next) // setup the swagger UI in /api-docs end points
  })
}

// This function reads the YAML file and returns the parsed YAML file.
function readSwaggerFile() {
  // read the YAML file.
  const swaggerFile = readFileSync(filePath, 'utf8')
  // parse the YAML file.
  const swaggerDocument = YAML.parse(swaggerFile)
  // remove the servers field from the YAML file. -> xoá field servers in file YAML.
  //   if (swaggerDocument.servers) {
  //     delete swaggerDocument.servers
  //   }
  return swaggerDocument
}
