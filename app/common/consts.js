import {G200, G600, N100, N600, N700, O100, O600, R100, R600, Y100, Y600} from "./colors";

export const NAV_HEIGHT = 48;

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

export const CONSTS = {
    MODAL_HEIGHT: "350px",
    EDIT_PORTFOLIO_MODAL_HEIGHT: "670px",
    MODAL_TIMING: 250,
    DAYS,
    MONTHS,
    YEARS,
    GENDERS,
    STATUSES
}