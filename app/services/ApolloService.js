import {split} from "apollo-link";
import {getMainDefinition} from "apollo-utilities";
import ApolloClient from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";
import {HttpLink} from "apollo-link-http";
import {WebSocketLink} from "apollo-link-ws";

const httpLink = new HttpLink({
    uri: window.location.origin + "/graphql",
});

const wsLink = new WebSocketLink({
    uri: `ws${window.location.protocol === "https:" ? "s" : ""}://` + window.location.host + "/graphql",
    options: {
        reconnect: true
    }
});

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

export default {
    client,
}