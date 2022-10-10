import { Action, Event, Sku } from "@prisma/client";

// TODO: Make it so the totals only need to be calculate once (by sku and in total)

type Totals = {
    borrow: number;
    return: number;
    lost: number;
    eol: number;
}

function getTotals(events: Event[]): Totals {
    /* Given an array of Events, returns the total number of borrowed,
    returned, EOL'ed, and lost items, in a Totals object. */

    let totalLost = 0;
    let totalBorrowed = 0;
    let totalReturned = 0;
    let totalEol = 0;

    events.forEach(event => {   
            switch (event.action) {
                case Action.BORROW:
                    totalBorrowed += 1;
                    break;
                case Action.RETURN:
                    totalReturned += 1;
                    break;
                case Action.EOL:
                    totalEol += 1;
                    break;
                case Action.LOST:
                    totalLost += 1;
                    break;
                default:
                    break;
            }
    })

    const totals: Totals = {
        borrow: totalBorrowed,
        return: totalReturned,
        lost: totalLost,
        eol: totalEol,
    };

    return totals;
}

function getEventsByAction(events: Event[], action: Action): Event[] {
    const eventsByAction = events.filter(event =>
        event.action === action
    );
    return eventsByAction;
}

function sortByDate(events: Event[]): Event[] {
    let aDate;
    let bDate;
    const sortedEvents = events.sort(
        (a, b) => {
            aDate = (new Date(a.timestamp)).getTime();
            bDate = (new Date(b.timestamp)).getTime();
            return (aDate > bDate) ? 1 : (aDate < bDate) ? -1 : 0;
        }
    );
    return sortedEvents;
}

function sum(arr: number[]): number {
    return arr.reduce((a, b) => {
        return a + b;
    }, 0)
}

export function getEventsBySku(events: Event[], sku: Sku): Event[] {
    const eventsBySku = events.filter(event =>
        event.skuId === sku.id
    );
    return eventsBySku;
}

export function getItemIds(events: Event[]): string[] {
    /* Filters given events to return an array of the distinct itemIds among the events. */

    // Uncomment to get an array of uniqueItemId events instead
    // const itemIds: string[] = events.filter(
    //     (event1, i, arr) => arr.findIndex(eventB => eventB.itemId === event1.itemId) === i
    // );

    const itemIds = events.map(event => event.itemId)
        .filter((value, index, self) => self.indexOf(value) === index)

    return itemIds;
}

export function getItemsInUse(events: Event[]): number {
    /* Returns the total number of products borrowed that haven't currently been lost, 
    returned, or EOL'ed. */
    
    // # currently borrowed = (total # borrowed) - (total # returned) - (total # lost) - (total # EOL)

    console.log("In getItemsInUse");

    const totals = getTotals(events);

    let itemsInUse;

    const totalBorrowed = totals.borrow;
    const totalLost = totals.lost;
    const totalEol = totals.eol;
    const totalReturned = totals.return;

    console.log("totalBorrowed: ", totalBorrowed);
    console.log("totalReturned: ", totalReturned);
    console.log("totalLost: ", totalLost);
    console.log("totalEol: ", totalEol);

    itemsInUse = totalBorrowed - totalReturned - totalLost - totalEol;

    console.log("itemsInUse: ", itemsInUse);

    return itemsInUse;
}

export function getLifetimeUses(events: Event[]): number {
    /* Returns the total number of times a BORROW event occurred. */
    
    console.log("In getLifetimeUses");

    const totals = getTotals(events);

    const lifetimeUses = totals.borrow;

    console.log("lifetimeUses: ", lifetimeUses);

    return lifetimeUses;
}

export function getReuseRate(events: Event[]): number {
    /* Returns an average (approximation) of cumulative reuse rate (%), by dividing 
    items reused at least once by the total items used. Assumes that totalItems is greater
    than 0 (if not, returns NaN - to be handled in frontend). */
    
    console.log("In getReuseRate");

    let reuseRate = 0;

    // to get itemsReused: calculate # of distinct items that appear at least twice
    // to get itemsUsed: calculate # of distinct items
    let itemsUsed = getItemIds(events); // arr of unique item ids
    let itemsReused = 0; 

    let matchedEvents;

    itemsUsed.forEach(itemId => {
        matchedEvents = events.filter(event =>
            event.itemId === itemId
        );
        if (matchedEvents.length >= 2) {
            itemsReused += 1;
        } 
    })

    reuseRate = (itemsReused/(itemsUsed.length)) * 100;

    console.log("reuseRate: ", reuseRate);

    return reuseRate;
}

export function getReturnRate(events: Event[]): number {
    /* Returns an average (approximation) of cumulative return rate (%) by considering
    all the borrowed and returned items. Expects that totalBorrowed and totalReturned are
    greater than 0 (if not, returns NaN - to be handled in frontend). */
    
    console.log("In getReturnRate");

    const totals = getTotals(events);

    const totalBorrowed = totals.borrow;
    const totalReturned = totals.return;

    const returnRate = (totalReturned/totalBorrowed) * 100;

    console.log("returnRate: ", returnRate);

    return returnRate;
}

export function getItemsByDay(month: number, year: number, daysInMonth: number[], events: Event[], action: Action): number[] {
    /* Returns an array of the number of items borrowed, returned, lost, or EOL'd day-by-day for 
    the given month and year. Forms the "y-axis array" to be passed to chart-js. */
    
    // console.log("In getItemsByDay");

    let itemsByDay: number[] = new Array(daysInMonth.length).fill(0); // index 0 corresponds to 1st of the month (day-1 = index)
    let date: Date;
    let matchedEvents: Event[];

    daysInMonth.forEach(day => {
        date = new Date(year, month-1, day); // month-1 b/c January is 0
        matchedEvents = events.filter(event =>
            ((new Date(event.timestamp)).getTime() === date.getTime()) && (event.action === action)
        );

        if (matchedEvents.length > 0) {
            itemsByDay[day-1] += matchedEvents.length;
        }
    })

    // let i = 0;
    // itemsByDay.forEach(items => {
    //     console.log("For day: ", i+1, ", items borrowed/returned/EOL'd/lost: ", items);
    //     i++;
    // })

    // console.log("itemsByDay: ");
    // console.log(itemsByDay);

    return itemsByDay;
}

export function getItemsByMonth(year: number, events: Event[], action: Action): number[] {
    /* Returns an array of the number of items borrowed, returned, lost, or EOL'd month-by-month for 
    the given year. Forms the "y-axis array" to be passed to chart-js. */
    
    console.log("In getItemsByMonth");

    let itemsByMonth: number[] = new Array(12).fill(0); // index 0 = "January"
    let daysInMonth;
    let itemsByDay: number[];
    
    for (let i=1; i<13; i++) { 
        // getItemsByDay and getDaysInMonth follow the convention that month #1 = "January", but we 
        // want index 0 of our array to have January's data
        // so, we iterate from [1,12], but modify [0,11] of the array respectively
        daysInMonth = getDaysInMonth(i, year);
        itemsByDay = getItemsByDay(i, year, daysInMonth, events, action);
        itemsByMonth[i-1] = sum(itemsByDay);
    }

    console.log("itemsByMonth: ");
    console.log(itemsByMonth);

    return itemsByMonth;
}

export function getDaysInMonth(month: number, year: number): number[] {
    /* Returns an array of the days in the given month and year. Forms the "x-axis array" to be 
    passed to chart-js. */
    // console.log("In getDaysInMonth");

    const days = new Date(year, month, 0).getDate();
    const daysInMonth = Array.from({length: days}, (_, i) => i + 1)
    
    // console.log("daysInMonth:");
    // console.log(daysInMonth)
    
    return daysInMonth;
}

export function getMonthsInYear(): string[] {
    /* Returns an array of the months in a year. Forms the "x-axis array" to be 
    passed to chart-js. */
    console.log("In getMonthsInYear");
    
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
}

export function getAvgDaysBetweenBorrowAndReturn(events: Event[]): number {
    /* Returns the average number of days between when an item is borrowed and returned. */

    console.log("In getAvgDaysBetweenBorrowAndReturn");

    let daysBetweenBorrowAndReturn: number[] = [];
    let avgDaysBetweenBorrowAndReturn = 0;

    // Consider all borrow-return pairs (included those for the same item)

    // 1. Get all borrowEvents
    // 2. Get all returnEvents
    // 3. Sort the borrowEvents and returnEvents by time - first one in array is earliest date
    // 4. For each borrowEvent, look for the earliest returnEvent with the same itemId
        // If found, then add difference between dates for the borrow and return to array, and delete returnEvent
    // 5. Once you've gone through each borrowEvent (with a gradually-reducing array of returnEvents),
    // you may be left w some returnEvents w no corresponding borrow, and not all borrowEvents will have contributed
    // to the daysBetweenBorrowAndReturn array - this is fine, just find the avg
    
    // Sort by time in case they aren't already
    let borrowEvents = sortByDate(getEventsByAction(events, Action.BORROW));
    let returnEvents = sortByDate(getEventsByAction(events, Action.RETURN));

    let matchedReturnEvent;
    let daysDiff = 0;
    let returnTimestamp;
    let borrowTimestamp;
    borrowEvents.forEach(borrowEvent => {
        matchedReturnEvent = returnEvents.find(returnEvent =>
            returnEvent.itemId === borrowEvent.itemId
        );
        if (matchedReturnEvent) {
            borrowTimestamp = (new Date(borrowEvent.timestamp)).getTime();
            returnTimestamp = (new Date(matchedReturnEvent.timestamp)).getTime();
            daysDiff = (returnTimestamp - borrowTimestamp) / (1000 * 60 * 60 * 24);
            if (daysDiff >= 0) {
                console.log("daysDiff ", daysDiff);
                // Remove matchedReturnEvent from returnEvents
                returnEvents.splice(returnEvents.indexOf(matchedReturnEvent), 1);
                daysBetweenBorrowAndReturn.push(daysDiff);
            }
        }
    })

    console.log("daysBetweenBorrowAndReturn:");
    console.log(daysBetweenBorrowAndReturn);

    avgDaysBetweenBorrowAndReturn = sum(daysBetweenBorrowAndReturn) / daysBetweenBorrowAndReturn.length || 0;

    console.log("avgDaysBetweenBorrowAndReturn:");
    console.log(avgDaysBetweenBorrowAndReturn);

    return avgDaysBetweenBorrowAndReturn;
}