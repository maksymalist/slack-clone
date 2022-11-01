import type { NextApiRequest, NextApiResponse } from 'next'
import { ApolloServer } from 'apollo-server-micro'
import { typeDefs } from './schemas'
import { resolvers } from './resolvers'
import Cors from 'cors'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
})

const initMiddleware = (middleware: Function) => {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

const cors = initMiddleware(
  Cors({
    credentials: true,
    origin: ['https://studio.apollographql.com'],
  })
)

export const config = {
  api: {
    bodyParser: false,
  },
}

const serverStart = server.start()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res)
  // schema-wide middleware

  await serverStart
  await server.createHandler({ path: '/api/graphql' })(req, res)
  return
}
