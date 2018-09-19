// @flow
import React, { PureComponent } from 'react';
import QRCode from 'qrcode.react';
import uuidv4 from 'uuid/v4';
import RegistrationSubscription from '../components/registration/registration-subscription';

/* const REGISTRATION_QUERY = gql`
  query RegisterPage($publicKey) {
    registrationCode()
  }
`
*/

/*
function checkLocalStorageAvailable() {
  // eslint-disable-next-line no-undef
  if (typeof window === 'undefined' || !('localStorage' in window)) {
    return false;
  }

  const test = 'test';
  try {
    // eslint-disable-next-line no-undef
    window.localStorage.setItem(test, test);
    // eslint-disable-next-line no-undef
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
*/

type Props = {
  registrationCode: string,
};

export default class RegisterPage extends PureComponent<Props> {
  static getInitialProps() {
    return {
      registrationCode: uuidv4(),
    };
  }

  renderRegistrationCode() {
    const { registrationCode } = this.props;

    return (
      <>
        <RegistrationSubscription registrationCode={registrationCode}>
          {({ data, error, loading }) => {
            if (loading) {
              return (
                <div>
                  <p>Awaiting registration...</p>
                  <QRCode value={registrationCode} renderAs="svg" size={256} level="M" />
                </div>
              );
            }

            if (error || !data || !data.registerScreen) {
              return (
                <div>
                  <p>Whoops</p>
                  <pre>{JSON.stringify(error)}</pre>
                </div>
              );
            }

            return (
              <div>
                <p>This screen was successfully registered to {data.registerScreen.username}</p>
              </div>
            );
          }}
        </RegistrationSubscription>
      </>
    );
  }

  render() {
    return (
      <div className="root">
        <h1>Welcome to mmirror screen register page</h1>
        <p>
          If you don&#39;t know what mmirror is, head over to our <a href="/">home</a> page to learn
          more
        </p>
        <div className="register">{this.renderRegistrationCode()}</div>
        <style jsx>{`
          :global(body) {
            margin: 0;
            height: 100vh;
            background: #105187;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .root {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 10px;
            max-width: 800px;
            background: white;
            padding: 20px 50px;
          }
        `}</style>
      </div>
    );
  }
}
