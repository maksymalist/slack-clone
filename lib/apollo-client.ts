import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getCookie } from 'cookies-next'

const httpLink = createHttpLink({
  uri: '/api/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = getCookie('auth-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default client
