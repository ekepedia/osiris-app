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
    {value: 1, label: "Wishlist"},
    {value: 2, label: "Applied"},
    {value: 3, label: "Interviewing"},
    {value: 4, label: "Offer"},
    {value: 5, label: "Rejected"},
    {value: 6, label: "Withdrawn"},
]

let years = [];

for (let i = 1920; i < 2040; i++) {
    years.push(i);
}

const YEARS = years.map((year) => {
    return {value: year, label: year + ""}
});

export const CONSTS = {
    MODAL_HEIGHT: "350px",
    EDIT_PORTFOLIO_MODAL_HEIGHT: "670px",
    MODAL_TIMING: 250,
    MONTHS,
    YEARS,
    STATUSES
}