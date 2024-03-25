import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import { ApiError, BreadOrCakeRequest, BreadOrCakeResponse } from './types'

export class BreadOrCakeServer {
  private app: express.Application
  private server: any // Server instance

  constructor(private PORT: number) {
    this.app = express()

    // Middleware to parse JSON bodies
    this.app.use(bodyParser.json())

    // Define routes
    this.app.post('/bread-or-cake', this.handleBreadOrCakeRequest.bind(this))
  }

  private handleBreadOrCakeRequest(
    req: Request<BreadOrCakeRequest>,
    res: Response<BreadOrCakeResponse | ApiError>,
  ) {
    try {
      // Simulate input validation
      if (typeof req.body.ingredients !== 'string' || !req.body.ingredients) {
        const error: ApiError = {
          statusCode: 400,
          message: 'Invalid input. Please provide a string of ingredients.',
        }
        return res.status(error.statusCode).json(error)
      }

      // Simulate calling an external API and determining the result
      const result: BreadOrCakeResponse = {
        result: Math.random() > 0.5 ? "It's bread" : "It's cake",
      }
      res.status(200).send(result)
    } catch (err) {
      // General error handling
      const error: ApiError = {
        statusCode: 500,
        message: 'An error occurred on the server.',
      }
      res.status(error.statusCode).json(error)
    }
  }

  public start(): void {
    this.server = this.app.listen(this.PORT, () => {
      console.log(`Server running at http://localhost:${this.PORT}`)
    })
  }

  public stop(): void {
    this.server.close()
    console.log('server stopped')
  }
}
