require('dotenv').config();
require("./logger");
require("./database");

const http    = require('http');
const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session');
const axios = require("axios");
const app     = express();
const fileUpload = require('express-fileupload');
const _ = require('lodash');

var jsonParser = bodyParser.json()

const { ApolloServer } = require('apollo-server-express');
const Schema = require("./src/schema/schema");

const server = new ApolloServer({
    schema: Schema,
    playground: true,
    introspection: true,
    context: async ({req}) => {
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

app.use(jsonParser);
app.use(fileUpload());

const DatabaseService = require("./src/services/DatabaseService");
const DemoUserService = require("./src/services/demo_users/DemoUserService");
const UserLoginService = require("./src/services/user_logins/UserLoginService");
const JobService = require("./src/services/jobs/JobService");

UserLoginService.set_routes(app);

app.get("/api/jobs-old", function (req, res) {
    DemoUserService.get_jobs().then(({jobs}) => {
        res.json({ jobs });
    }).catch((err) => {
        res.json({ jobs: [] });
    });
});

app.get("/api/jobs", function (req, res) {
    JobService.format_jobs_for_job_board().then((jobs) => {
        res.json({ jobs: _.shuffle(jobs) });
    }).catch((err) => {
        res.json({ jobs: [] });
    });
});


app.get("/api/jobs/temp", function (req, res) {
    res.json({
        jobs: _.shuffle(JobService.WEBSCRAPED_JOBS)
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

app.post("/api/upload-user-img", function (req, res) {
    console.log("req.files")
    console.log(req.files)

    if (req.files && req.files.img) {
        console.log("GOT IT BBY :)");

        const filePrefix = Math.round(Math.random() * 10000000);

        const fileName = filePrefix + "-" + req.files.img.name;
        DatabaseService.upload_img(fileName, req.files.img.mimetype, req.files.img.data ).then(({url}) => {
            res.json({url})
        })
    } else {
        res.json()
    }
});

const DemoTrackingService = require("./src/services/demo_tracking/DemoTrackingService");
app.post("/api/tracking/v1", function (req, res) {
    DemoTrackingService.create_demo_tracking(req.body).then((tracking_id) => {
        res.json(tracking_id);
    })
})

app.get("*", function (req, res) {
    res.render("main");
});

const port = (process.env.PORT || 4005);

httpServer.listen(port, function () {
    console.log('App listening on port ', port);
    console.log(`GraphQL available at ${server.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:${port}${server.graphqlPath}`)
});





