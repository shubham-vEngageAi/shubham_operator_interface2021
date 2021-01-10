import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import RenderToIndex from './RenderToIndex';

  ReactDOM.render(
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      responseType="id_token token"
      scope="read:current_user update:current_user_metadata"
    >
    <RenderToIndex />
  </Auth0Provider>,
  document.getElementById('root')
);




