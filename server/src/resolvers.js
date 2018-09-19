// @flow

/* ::
type Item = {
  username: string,
  accessToken: string,
  refreshToken: string,
};
*/

/* ::
var Symbol = {
  asyncIterator: '@@asyncIterator',
}
*/

function registerScreen(registrationCode /* : string */) /* : AsyncIterable<Item> */ {
  return {
    [Symbol.asyncIterator]:
      // $FlowFixMe
      async function* registerScreenGenerator() {
        await new Promise(res => {
          setTimeout(res, 3000);
        });
        yield {
          registerScreen: {
            username: 'user3',
            accessToken: `at for reg code ${registrationCode}`,
            refreshToken: `rt for reg code ${registrationCode}`,
          },
        };
      },
  };
}

module.exports = {
  Query: {
    hello: () => 'world',
  },
  Subscription: {
    registerScreen: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: (parent /* : any */, { registrationCode } /* : { registrationCode: string } */) =>
        registerScreen(registrationCode),
    },
  },
};
