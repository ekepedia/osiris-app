import moment from "moment";

export function mc (){
    const args = Array.prototype.slice.call(arguments);
    return args.join(" ")
}

export function formatDuration(duration) {
    let str = "";

    if (duration.asYears() > 1 ) {
        str = `${Math.round(duration.years())} yr${duration.years() >= 2 ? "s" : ''}` ;

        if (duration.months() > 0) {
            str += ` ${Math.round(duration.months())} mo${duration.months() >= 2 ? "s" : ''}`;
        }
    } else {
        str = `${duration.months()} mo${duration.months() >= 2 ? "s" : ''}`
    }

    return str
}

export function convertDateObjectToMonthYear({date}) {
    const original_date = moment(date);
    return {
        month: original_date.month() + 1,
        year: original_date.year(),
    }
}

export function converMonthYearToDateObject({month, year}) {
    return new Date(`${month}/1/${year}`);
}