// @flow
import React from 'react';
import gql from 'graphql-tag';
import mem from 'fast-memoize';
import { Subscription, type SubscriptionRenderPropFunction } from 'react-apollo';
import type { RegistrationSubscription as RegistrationSubscriptionType } from './__generated__/RegistrationSubscription';

type Variables = {
  registrationCode: string,
};

const REGISTER_SCREEN_SUBSCRIPTION = gql`
  subscription RegistrationSubscription($registrationCode: String!) {
    registerScreen(registrationCode: $registrationCode) {
      username
      accessToken
      refreshToken
    }
  }
`;

const makeVariables = mem(registrationCode => {
  const variables: Variables = {
    registrationCode,
  };

  return variables;
});

type Props = {
  registrationCode: string,
  children: SubscriptionRenderPropFunction<RegistrationSubscriptionType, Variables>,
};

const RegistrationSubscription = ({ registrationCode, children }: Props) => (
  <Subscription
    subscription={REGISTER_SCREEN_SUBSCRIPTION}
    variables={makeVariables(registrationCode)}
  >
    {children}
  </Subscription>
);

export default RegistrationSubscription;
