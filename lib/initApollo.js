import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (typeof window === 'undefined') {
  global.fetch = fetch
}

function create(initialState, { fetchOptions }) {
  const httpLink = createHttpLink({
    uri: 'https://graphql-pokemon.now.sh/',
    // uri: process.env.GRAPHQL_URL, // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    fetchOptions,
  })

  const isBrowser = typeof window !== 'undefined'
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: httpLink,
    cache: new InMemoryCache({
      dataIdFromObject: object => object.nodeId || null,
    }).restore(initialState || {}),
  })
}

export default (initialState, options) => {
  if (typeof window === 'undefined') {
    return create(initialState, { ...options })
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}