import request from 'supertest'
import { BreadOrCakeServer } from './BreadOrCakeServer'

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
      .post('/bread-or-cake')
      .send({ ingredients: 'flour, sugar' })

    expect(response.status).toBe(200)
    expect(response.body.result).toMatch(/^(It's bread|It's cake)$/)
  })

  it('should return 400 Bad Request if ingredients are missing', async () => {
    const response = await request(server['app'])
      .post('/bread-or-cake')
      .send({})

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Invalid input. Please provide a string of ingredients.',
    })
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
