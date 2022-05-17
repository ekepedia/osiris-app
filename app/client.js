import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch} from 'react-router-dom';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Modal from 'react-modal';

const httpLink = new HttpLink({
    uri: window.location.origin + "/graphql",
});

const wsLink = new WebSocketLink({
    uri: `ws${window.location.protocol === "https:" ? "s" : ""}://` + window.location.host + "/graphql",
    options: {
        reconnect: true
    }
});

Modal.setAppElement('#app');

const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
});

import Routing from "./components/infrastructure/Routing";

const app = document.getElementById('app');

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <Routing />
        </ApolloProvider>
    </BrowserRouter>,
    app
);