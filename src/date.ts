function pad2 (s: number) { return s.toString().padStart(2, "0"); }

export function formatTime (date: Date) {
    const offset = date.getTimezoneOffset();
    const offsetSign = Math.sign(offset);
    const offsetHours = Math.abs(Math.floor(offset / 60));
    const offsetMinutes = Math.abs(offset % 60);
    const offsetString = offset === 0 ? "Z" : `${offsetSign?"+":"-"}${pad2(offsetHours)}:${pad2(offsetMinutes)}`;

    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}.${date.getMilliseconds().toString().padStart(3,"0")}${offsetString}`;
}

/**
 * Algorithm from https://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
 */
export function dateGetJulian (date: Date) {
    let y = date.getUTCFullYear();
    let m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();

    if (m < 3) {
        y--;
        m += 12;
    }

    const a = Math.floor(y / 100);
    const b = Math.floor(a / 4);
    const c = 2 - a + b;
    const e = Math.floor(365.25 * (y + 4716));
    const f = Math.floor(30.6001 * (m + 1));

    const h = date.getUTCHours();

    const g = h < 12 ? 1 : 0;

    return c + d + e + f - 1524 - g;
}


/**
 * ISO Week Number
 * Algorithm from https://www.tondering.dk/claus/cal/week.php
 */
export function dateGetWeek (date: Date) {
    let n, g, s, d;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Special case for 0000-01-01
    if (year == 0 && month == 1 && day == 1) {
        return { weekYear: -1, week: 52, weekDay: 7 };
    }

    if (month < 3) {
        const a = year - 1;
        const b = Math.floor(a / 4) - Math.floor(a / 100) + Math.floor(a / 400);
        const c = Math.floor((a - 1) / 4) - Math.floor((a - 1) / 100) + Math.floor((a - 1) / 400);
        s = b - c;
        const e = 0;
        const f = day - 1 + 31 * (month - 1);
        g = (a + b) % 7;
        d = (f + g - e) % 7;
        n = f + 3 - d;
    }
    else {
        const a = year;
        const b = Math.floor(a / 4) - Math.floor(a / 100) + Math.floor(a / 400);
        const c = Math.floor((a - 1) / 4) - Math.floor((a - 1) / 100) + Math.floor((a - 1) / 400);
        s = b - c;
        const e = s + 1;
        const f = day + Math.floor((153 * (month - 3) + 2) / 5) + 58 + s;
        g = (a + b) % 7;
        d = (f + g - e) % 7;
        n = f + 3 - d;
    }

    let week, weekYear, weekDay;

    if (n < 0) {
        week = 53 - Math.floor((g - s) / 5);
    }
    else if (n > 364 + s) {
        week = 1;
    }
    else {
        week = Math.floor(n / 7) + 1;
    }

    if (n < 0) {
        weekYear = year - 1;
    }
    else if (n > 364 + s) {
        weekYear = year + 1;
    }
    else {
        weekYear = year;
    }

    weekDay = d + 1;

    return { weekYear, week, weekDay };
}

const month_index = [
//   31   28   31
      0,  31,  59,
//   30   31   30
     90, 120, 151,
//   31   31   30
    181, 212, 243,
//   31   30   31
    273, 304, 334
];

function isLeapYear(year: number) {
    return (year % 4 == 0 && (year % 400 == 0 || year % 100 != 0));
}

export function dateGetYearDay(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const leap_day = month > 2 && isLeapYear(year) ? 1 : 0;
    return month_index[month - 1] + day + leap_day;
}
