import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { getDataFromTree } from '@apollo/react-ssr'
import initApollo from './initApollo'

export default App => {
  return class WithData extends React.Component {
    static displayName = 'withApollo(App)'

    static protoTypes = {
      apolloState: PropTypes.object.isRequired,
      Component: PropTypes.elementType.isRequired,
    }

    static async getInitialProps(ctx) {
      const {
        AppTree,
        ctx: { req, res },
      } = ctx
      const apollo = initApollo(
        {},
        {}
      )

      ctx.ctx.apolloClient = apollo

      let appProps = {}

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx)
      }

      if (res && res.finished) {
        return {}
      }

      if (typeof window === 'undefined') {
        // Run all graphql queries in the component tree
        // and extract the resulting data
        try {
          // Run all GraphQL queries
          await getDataFromTree(<AppTree apolloClient={apollo} {...appProps} />)
        } catch (error) {
          // for debugging graphQLErrors and networkError
          if (Object.keys(error).includes('graphQLErrors')) {
            const { graphQLErrors, networkError } = error
            // in array
            if (graphQLErrors && graphQLErrors.length) {
              // we will deal with detail later
              console.error('Error graphQL:', graphQLErrors)
            }
            if (networkError) {
              console.error('Error network:', networkError.message)
              console.error(
                `Result: ${JSON.stringify(networkError.result || 'none')}`
              )
              // console.error(networkError) // if needed
            }
          } else {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error)
          }
        }

        // `getDataFromTree` does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind()
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract()

      return {
        ...appProps,
        apolloState,
      }
    }

    constructor(props) {
      // ignore this (next 9)
      // Warning: Failed prop type: The prop `apolloState` is marked as required in `WithData(undefined)`, but its value is `undefined`.
      super(props)
      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      this.apolloClient = initApollo(props.apolloState, {})
    }

    render() {
      return <App apolloClient={this.apolloClient} {...this.props} />
    }
  }
}