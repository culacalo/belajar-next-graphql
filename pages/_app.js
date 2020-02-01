import NextApp from 'next/app'
import { ApolloProvider } from '@apollo/react-hooks'
import withApollo from '../lib/withApollo'
import AppLayout from '../layouts/AppLayout'

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps: { ...pageProps } }

  }

  render() {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <ApolloProvider client={apolloClient}>
        <AppLayout>
          <Component { ...pageProps } />
        </AppLayout>
      </ApolloProvider>
    )

  }
}



export default withApollo(App)