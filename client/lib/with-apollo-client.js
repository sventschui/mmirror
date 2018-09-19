// @flow
import Head from 'next/head';
import React, { PureComponent, type ComponentType } from 'react';
import { getDataFromTree } from 'react-apollo';
import type { ApolloClient } from 'apollo-client';
import type { AppContext } from 'next';
import initApollo from './init-apollo';
import log from './log';

type Props = {
  apolloClient: ApolloClient,
  apolloState: any,
};

export default (App: ComponentType<{}>) =>
  class WithApolloClient extends PureComponent<Props> {
    static displayName = 'withApollo(App)';

    static async getInitialProps(ctx: AppContext) {
      const { Component, router } = ctx;

      let appProps = {};
      // $FlowFixMe
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      const apolloState = {};

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo();
      try {
        // Run all GraphQL queries
        await getDataFromTree(
          <App
            {...appProps}
            Component={Component}
            router={router}
            apolloState={apolloState}
            apolloClient={apollo}
          />,
        );
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
        log.error(error, 'Error while running `getDataFromTree`');
      }

      if (!process.browser) {
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      apolloState.data = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    constructor(props: Props) {
      super(props);
      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      this.apolloClient = props.apolloClient || initApollo(props.apolloState.data);
    }

    apolloClient: ApolloClient;

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
