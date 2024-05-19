function parseTime(ts, to = "ms") {
    const time = parseFloat(ts);
    let times = {
        d: 24 * 60 * 60 * 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        s: 1000,
        ms: 1,
    };
    if (ts.includes("d"))
        return (time * times.d) / times[to];
    else if (ts.includes("ms"))
        return (time * times.ms) / times[to];
    else if (ts.includes("m"))
        return (time * times.m) / times[to];
    else if (ts.includes("h"))
        return (time * times.h) / times[to];
    else if (ts.includes("s"))
        return (time * times.s) / times[to];
    else
        return parseInt(ts);
}
export { parseTime };
