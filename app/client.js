import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch} from 'react-router-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import Modal from 'react-modal';
import ApolloService from "./services/ApolloService";
import Routing from "./components/infrastructure/Routing";

Modal.setAppElement('#app');
const app = document.getElementById('app');

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={ApolloService.client}>
            <Routing />
        </ApolloProvider>
    </BrowserRouter>,
    app
);