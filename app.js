require('dotenv').config();
require("./logger");
require("./database");

const http    = require('http');
const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session');
const app     = express();
var jsonParser = bodyParser.json()

const { ApolloServer } = require('apollo-server-express');
const Schema = require("./src/schema/schema");

const server = new ApolloServer({
    schema: Schema, playground: false, introspection: true, context: async ({req}) => {
        const headers = req ? req.headers : null;
        let ip = null;

        if (headers) {
            const ipAddress = headers['x-forwarded-for'];
            if (ipAddress) ip = ipAddress;
        }

        return {
            ip
        };
    },
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

app.use(require('express').static(__dirname + '/app/public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

const DemoUserService = require("./src/services/demo_users/DemoUserService");

app.get("/api/jobs", function (req, res) {
    DemoUserService.get_jobs().then(({jobs}) => {
        res.json({ jobs });
    }).catch((err) => {
        res.json({ jobs: [] });
    });
});

app.get("/api/locations", function (req, res) {
    DemoUserService.get_locations().then(({locations}) => {
        res.json({ locations });
    }).catch((err) => {
        res.json({ locations: [] });
    });
});

app.get("/api/companies", function (req, res) {
    DemoUserService.get_companies().then(({companies}) => {
        res.json({ companies });
    }).catch((err) => {
        res.json({ companies: [] });
    });
});

app.get("/api/industries", function (req, res) {
    DemoUserService.get_industries().then(({industries}) => {
        res.json({ industries });
    }).catch((err) => {
        res.json({ industries: [] });
    });
});

app.get("/api/degree-requirements", function (req, res) {
    DemoUserService.get_degree_requirements().then(({degree_requirements}) => {
        res.json({ degree_requirements });
    }).catch((err) => {
        res.json({ degree_requirements: [] });
    });
});

app.get("/api/roles", function (req, res) {
    DemoUserService.get_roles().then(({roles}) => {
        res.json({ roles });
    }).catch((err) => {
        res.json({ roles: [] });
    });
});

app.get("/api/affinities", function (req, res) {
    DemoUserService.get_affinities().then(({affinities}) => {
        res.json({ affinities });
    }).catch((err) => {
        res.json({ affinities: [] });
    });
});


app.get("*", function (req, res) {
    res.render("main");
});

const port = (process.env.PORT || 4004);

httpServer.listen(port, function () {
    console.log('App listening on port ', port);
    console.log(`GraphQL available at ${server.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:${port}${server.graphqlPath}`)
});
