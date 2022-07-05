export function mc (){
    const args = Array.prototype.slice.call(arguments);
    return args.join(" ")
}

export function formatDuration(duration) {
    let str = "";

    if (duration.asYears() > 1 ) {
        str = `${duration.years()} yr ${duration.months()} mos`
    } else {
        str = `${duration.asMonths()} mos`
    }

    return str
}