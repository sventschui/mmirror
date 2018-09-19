// @flow

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
  static async getInitialProps(context: any) {
    const props = await super.getInitialProps(context);
    const {
      req: { env, lang, localeDataScript },
    } = context;

    return {
      ...props,
      env,
      lang,
      localeDataScript,
    };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="format-detection" content="telephone=no" />
          <link
            href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600"
            rel="stylesheet"
          />
          <style
            type="text/css"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                }
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <script
            // TODO Missing es6.typed.uint8-array
            src="https://cdn.polyfill.io/v2//polyfill.min.js?features=Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,Array.from,Function.name,Object.assign,Promise,String.prototype.startsWith,Symbol,Object.values,~html5-elements,fetch"
          />
          <NextScript />
        </body>
      </html>
    );
  }
}
