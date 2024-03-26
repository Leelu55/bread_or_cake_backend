import request from 'supertest'
import { BreadOrCakeServer } from './BreadOrCakeServer'

// Adjusted mock to reflect the named export
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: '{"isA": "bread"}' }], // Adjusted mock response
        }),
      },
    },
  })),
}))

describe('BreadOrCakeServer', () => {
  let server: BreadOrCakeServer

  beforeAll(() => {
    server = new BreadOrCakeServer(3001)
    server.start()
  })

  afterAll(async () => {
    await server.stop()
  })

  it('should return 200 OK with "bread" or "cake"', async () => {
    const response = await request(server['app'])
      .post('/bread-or-cake-ai')
      .send({ ingredients: 'flour, sugar' })

    expect(response.status).toBe(200)
    // Make sure to adjust this assertion based on how your server processes the response
    expect(JSON.parse(response.text)).toMatchObject({ isA: 'bread' })
  })

  it('should return 400 Bad Request if ingredients are missing', async () => {
    const response = await request(server['app'])
      .post('/bread-or-cake-ai')
      .send({})

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Invalid input. Please provide a string of ingredients.',
    })
  })
})
