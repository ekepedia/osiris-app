
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
const CompanyService = require("./src/services/companies/CompanyService");
const GroupService = require("./src/services/groups/GroupService");


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

app.get("/api/job-descriptions", function (req, res) {
    JobService.get_job_descriptions().then(({JOB_SKILLS, JOB_DESCRIPTIONS}) => {
        res.json({ SKILLS:JOB_SKILLS, JOB_DESCRIPTIONS });
    })
})



app.get("/api/jobs-buffer", function (req, res) {
    JobService.get_buffer_for_lambda().then((jobs) => {
        res.json( _.shuffle(jobs) );
    }).catch((err) => {
        res.json({ jobs: [] });
    });
});



app.post("/api/summarize-job", function (req, res) {
    let { job_html } = req.body;

    console.log("/api/summarize-job", new Date(), job_html);

    let prompt = `Summarize this job description:\n\n${job_html}`;

    JobService.get_text_completion({prompt}).then((response) => {
        console.log("GTP", response);

        if (response && response.choices && response.choices.length) {
            res.json({
                success: true,
                response: response.choices[0].text
            });
        } else {
            res.json({
                success: false
            });
        }
    })

});


app.post("/api/jobs-buffer", function (req, res) {
    let data = req.body.rows
    let { batch_id, job_source } = req.body;

    console.log("/api/jobs-buffer", new Date());

    data.forEach((job) => {
        let buffer_unique_code = `${(job.job_company || "").toUpperCase()}-${(job.job_location || "").toUpperCase()}-${(job.job_title || "").toUpperCase()}`;

        let payload = {
            ...job,
            batch_id,
            buffer_unique_code,
            job_source
        };

        JobService.create_job_buffer(payload).then((job_buffer_id) => {
            console.log(job_buffer_id, buffer_unique_code);
        }).catch((e) => {
            e
        });
    });

    res.json({
        success: true
    });
});

app.post("/api/jobs-buffer/:job_buffer_id", function (req, res) {
    let data = req.body.rows
    let { job_buffer_id, job_html, job_direct_link } = req.body;

    if (job_html){
        console.log("job_html.length", job_html.length)
    }

    console.log("/api/jobs-buffer", {job_buffer_id,job_direct_link });

    JobService.edit_job_buffer(req.body).then(() => {
        console.log("Updated:", job_buffer_id)
    }).catch((e) =>{
        console.log(e)
    })

    res.json({
        success: true
    });
});

app.post("/api/jobs/v2", function (req, res) {
    console.log("/api/jobs/v2", "payload:", req.body);

    JobService.get_jobs_for_job_board(req.body).then((jobs) => {
        res.json({ jobs: jobs });
    }).catch((err) => {
        res.json({ jobs: [] });
    });
});

app.get("/api/job-counts", function (req, res) {
    res.json({ counts: JobService.JOB_COUNTS });
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

app.get("/api/companies/v2", function (req, res) {
    res.json({ companies: Object.values(JobService.get_all_companies()) });
});

app.get("/api/industries", function (req, res) {
    DemoUserService.get_industries().then(({industries}) => {
        res.json({ industries });
    }).catch((err) => {
        res.json({ industries: [] });
    });
});

app.get("/api/job-titles/v2", function (req, res) {
    res.json({ job_titles: Object.values(JobService.get_all_job_titles()) });
});


app.get("/api/senorities/v2", function (req, res) {
    res.json({ senorities: Object.values(JobService.get_all_senorities()) });
});

app.get("/api/industries/v2", function (req, res) {
    res.json({ industries: Object.values(JobService.get_all_industries()) });
});

app.get("/api/locations/v2", function (req, res) {
    res.json({ locations: Object.values(JobService.get_all_locations()) });
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

let CITIES = require("./cities.json");
app.get("/api/cities", function (req, res) {
    res.json({ cities: CITIES });
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



// axios.get("https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json").then((response) => {
//     let data = response.data;
//     data = _.filter(data, (d) => {
//         return d.alpha_two_code === 'US'
//     });
//
//     data = data.map((d, i) => {
//         return {
//             ...d,
//             id: 220000 + i
//         }
//     } )
//     // console.log(JSON.stringify(data))
//     const fs = require('fs');
//
//     fs.writeFileSync('universities.json', JSON.stringify(data));
// })

// axios.get("https://raw.githubusercontent.com/cschoi3/US-states-and-cities-json/master/data.json").then((response) => {
//     let data = response.data;
//     let CITIES = [];
//     let i = 0;
//     Object.keys(data).forEach((state) => {
//         let abbr = abbrState(state, "abbr") || state;
//
//         data[state].forEach((city) => {
//             city = toTitleCase(city);
//             let label = `${city}, ${abbr}`;
//             console.log(label, " | ", state, abbr, )
//             i++;
//             CITIES.push({
//                 value: 452000000+i,
//                 label,
//                 city,
//                 state,
//                 state_two_code: abbr,
//             })
//         })
//     })
//     console.log(CITIES)
//
//
//     // console.log(JSON.stringify(data))
//     // const fs = require('fs');
//     // //
//     // fs.writeFileSync('cities.json', JSON.stringify(CITIES));
// })


function abbrState(input, to){

    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }
    }
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}