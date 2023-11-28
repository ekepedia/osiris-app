import {G200, G600, N100, N600, N700, O100, O600, R100, R600, Y100, Y600} from "./colors";
import { UNIVERSITIES } from "./data/universities"
export const NAV_HEIGHT = 48;

const ROLE_IN_GROUPS = [
    {value: 1, label: "Creator"},
    {value: 2, label: "Admin"},
    {value: 3, label: "User"},
    {value: 4, label: "Alumni"}
]

const MONTHS = [
    {value: 1, label: "Jan"},
    {value: 2, label: "Feb"},
    {value: 3, label: "Mar"},
    {value: 4, label: "Apr"},
    {value: 5, label: "May"},
    {value: 6, label: "Jun"},
    {value: 7, label: "Jul"},
    {value: 8, label: "Aug"},
    {value: 9, label: "Sep"},
    {value: 10, label: "Oct"},
    {value: 11, label: "Nov"},
    {value: 12, label: "Dec"},
]

const STATUSES = [
    {value: 1, label: "Wishlist", width: "55px", color: N700, background: N100},
    {value: 2, label: "Applied", width: "50px", color: Y600, background: Y100},
    {value: 3, label: "Interviewing", width: "80px", color: O600, background: O100},
    {value: 4, label: "Offer Received", width: "90", color: G600, background: G200},
    {value: 5, label: "Rejected", width: "58px", color: R600, background: R100},
    {value: 6, label: "Withdrawn", width: "70px", color: N700, background: N100},
]

let years = [];

for (let i = 1920; i < 2040; i++) {
    years.push(i);
}

const YEARS = years.map((year) => {
    return {value: year, label: year + ""}
});

let days = [];

for (let i = 1; i <= 31; i++) {
    days.push(i);
}

const DAYS = days.map((day) => {
    return {value: day, label: day + ""}
});


const GENDERS = [
    {value: 1, label: "Woman"},
    {value: 2, label: "Man"},
    {value: 3, label: "Non-Binary"},
    {value: 4, label: "Transgender"},
    {value: 5, label: "Prefer Not to Say"},
]

const RACES = [
    {value: 1, label: "American Indian"},
    {value: 2, label: "Black/African Descent"},
    {value: 3, label: "East Asian"},
    {value: 4, label: "Hispanic/Latino"},
    {value: 5, label: "Middle Eastern"},
    {value: 6, label: "Pacific Islander"},
    {value: 7, label: "South Asian"},
    {value: 8, label: "White"},
    {value: 9, label: "Prefer Not to Say"},
];

let RACES_MAP = {};
RACES.forEach((race) => {
    RACES_MAP[race.value] = race;
})

const PREFERENCE_TYPES = {
    ROLE_EXPECTATION: "1",
    JOB_PRIORITIES: "2",
    INDUSTRIES: "3",
    PASSIONS: "4",
    LOCATIONS: "5",
}

const ROLE_EXPECTATIONS = [
    {value: 1101, label: "Full-Time"},
    {value: 1102, label: "Part-Time"},
    {value: 1103, label: "Internship"},
    {value: 1104, label: "I am not currently looking for a job"},
];

let ROLE_EXPECTATIONS_MAP = {};
ROLE_EXPECTATIONS.forEach((d) => {
    ROLE_EXPECTATIONS_MAP[d.value] = d;
});

const JOB_PRIORITIES = [
    {value: 1201, label: "Salary"},
    {value: 1202, label: "Location"},
    {value: 1203, label: "Diversity"},
    {value: 1204, label: "Work-Life Balance"},
    {value: 1205, label: "Culture"},
];

let JOB_PRIORITIES_MAP = {};
JOB_PRIORITIES.forEach((d) => {
    JOB_PRIORITIES_MAP[d.value] = d;
});

const INDUSTRIES = [
    {value: 1301, label: "Environment"},
    {value: 1302, label: "Sports"},
    {value: 1303, label: "Financial Services"},
    {value: 1304, label: "Design"},
    {value: 1305, label: "Tech"},
    {value: 1306, label: "Consulting"},
    {value: 1307, label: "Marketing"},
    {value: 1308, label: "Healthcare"},
    {value: 1309, label: "Education"},
    {value: 1310, label: "News"},
    {value: 1311, label: "Music"},
    {value: 1313, label: "Engineering"},
    {value: 1314, label: "Beauty"},
    {value: 1315, label: "Media"},
    {value: 1316, label: "Life Sciences"},
    {value: 1317, label: "Consumer Products"},
    {value: 1318, label: "Entertainment"},
    {value: 1319, label: "Legal"},
    {value: 1320, label: "Real Estate"},
];

let INDUSTRIES_MAP = {};
INDUSTRIES.forEach((d) => {
    INDUSTRIES_MAP[d.value] = d;
});

const PASSIONS = [
    {value: 1401, label: "Environment"},
    {value: 1402, label: "Design"},
    {value: 1403, label: "DE&I"},
    {value: 1404, label: "Finance"},
    {value: 1405, label: "Politics"},
    {value: 1406, label: "Sports"},
    {value: 1407, label: "Music"},
];

let PASSIONS_MAP = {};
PASSIONS.forEach((d) => {
    PASSIONS_MAP[d.value] = d;
});

let UNIVERSITIES_FORMATTED = UNIVERSITIES.map((u) => {
    return {
        ...u,
        value: u.id,
        label: u.name
    }
})

let UNIVERSITIES_MAP = {};
UNIVERSITIES_FORMATTED.forEach((d) => {
    UNIVERSITIES_MAP[d.value] = d;
});

export const CONSTS = {
    MODAL_HEIGHT: "350px",
    EDIT_PORTFOLIO_MODAL_HEIGHT: "670px",
    MODAL_TIMING: 250,
    DAYS,
    MONTHS,
    YEARS,
    GENDERS,
    STATUSES,
    RACES,
    RACES_MAP,
    PREFERENCE_TYPES,
    ROLE_EXPECTATIONS,
    ROLE_EXPECTATIONS_MAP,
    JOB_PRIORITIES,
    JOB_PRIORITIES_MAP,
    INDUSTRIES,
    INDUSTRIES_MAP,
    PASSIONS,
    PASSIONS_MAP,
    UNIVERSITIES: UNIVERSITIES_FORMATTED,
    UNIVERSITIES_MAP
}