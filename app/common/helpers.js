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