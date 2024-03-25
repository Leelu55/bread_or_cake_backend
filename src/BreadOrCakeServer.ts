import bodyParser from 'body-parser'
import cors from 'cors' // Import the cors package
import express, { Request, Response } from 'express'
import { ApiError, BreadOrCakeRequest, BreadOrCakeResponse } from './types'
import OpenAI from 'openai'
import { ChatCompletionMessage, CompletionChoice } from 'openai/resources'

export class BreadOrCakeServer {
  private app: express.Application
  private server: any // Server instance

  constructor(private PORT: number) {
    this.app = express()

    // Middleware to parse JSON bodies
    this.app.use(bodyParser.json())

    this.app.use(cors())

    // Define routes
    this.app.post('/bread-or-cake', this.handleBreadOrCakeRequest.bind(this))
    // Define routes
    this.app.post(
      '/bread-or-cake-ai',
      this.handleBreadOrCakeOpenAiRequest.bind(this),
    )
  }

  private async handleBreadOrCakeOpenAiRequest(
    req: Request<BreadOrCakeRequest>,
    res: Response<ChatCompletionMessage | ApiError>,
  ) {
    const openai = new OpenAI()
    try {
      // Simulate input validation
      // if (typeof req.body.ingredients !== 'string' || !req.body.ingredients) {
      //   const error: ApiError = {
      //     statusCode: 400,
      //     message: 'Invalid input. Please provide a string of ingredients.',
      //   }
      //   return res.status(error.statusCode).json(error)
      // }
      console.log(req.body.ingredients)
      const breadOrCakeRule =
        'If the ratio of added fat and/or added sugars to grain \
      products and/or starches is at least 10 parts to 90 parts, \
      and the item is made by baking, roasting, drying, cooking extrusion, \
      or other processes, it is classified as cake \
      In contrast, if the item is made entirely or partially from grains and/or grain products\
      , as well as other foods (e.g., legumes, potato products), \
      by kneading, shaping, leavening, baking, or hot extrusion of the dough, \
      and contains less than 10 weight percent of fat and/or \
      sugars to 90 weight percent of grains and/or grain products, it is classified as bread.'
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant trying to distinguish between bread and cake receipts. \
              Provided a list of ingredients, you should tell if it is a bread or cake receipt. \
              Return only and exclusively a {"isA": "bread"} or  {"isA": "cake"}. \
              here are the ingredients: ' +
              req.body.ingredients +
              'and the rule is:' +
              breadOrCakeRule,
          },
        ],
        model: 'gpt-3.5-turbo',
      })

      console.log(completion.choices[0])
      // Simulate calling an external API and determining the result
      const result = completion.choices[0]
      console.log(
        `Ingredients: ${req.body.ingredients}, Result: ${result.message}`,
      )
      res.status(200).send(result.message)
    } catch (err) {
      // General error handling
      const error: ApiError = {
        statusCode: 500,
        message: JSON.stringify(err),
      }
      res.status(error.statusCode).json(error)
    }
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
      console.log(
        `Ingredients: ${req.body.ingredients}, Result: ${result.result}`,
      )
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
