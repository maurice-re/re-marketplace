import { Action, Event, Sku } from "@prisma/client";

// TODO: Make it so the totals only need to be calculate once (by sku and in total)
// TODO: Abstract common functionalities between "BySku" vs. "in total"

type Totals = {
    borrow: number;
    return: number;
    lost: number;
    eol: number;
}

type ItemIdToLifetimeBorrowedProducts = Record<string, number>;

function getTotalsBySku(events: Event[], sku: Sku): Totals {
    /* Given an array of Events, returns the total number of borrowed,
    returned, EOL'ed, and lost products of the given sku, in a Totals object. */

    let totalLost = 0;
    let totalBorrowed = 0;
    let totalReturned = 0;
    let totalEol = 0;

    events.forEach(event => {   
        if (event.skuId == sku.id) {
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
        }
    })

    const totalsBySku: Totals = {
        borrow: totalBorrowed,
        return: totalReturned,
        lost: totalLost,
        eol: totalEol,
    };

    return totalsBySku;
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

    const totalsBySku = getTotals(events);

    let itemsInUse;

    const totalBorrowed = totalsBySku.borrow;
    const totalLost = totalsBySku.lost;
    const totalEol = totalsBySku.eol;
    const totalReturned = totalsBySku.return;

    console.log("totalBorrowed: ", totalBorrowed);
    console.log("totalReturned: ", totalReturned);
    console.log("totalLost: ", totalLost);
    console.log("totalEol: ", totalEol);

    itemsInUse = totalBorrowed - totalReturned - totalLost - totalEol;

    console.log("itemsInUse: ", itemsInUse);

    return itemsInUse;
}

// productsUsed, itemsInUse, numItemIds
export function getItemsInUseBySku(events: Event[], sku: Sku): number {
    /* Returns the number of products borrowed that haven't currently been lost, 
    returned, or EOL'ed, for a given sku. */
    
    // For a particular sku:
    // # currently borrowed = (total # borrowed) - (total # returned) - (total # lost) - (total # EOL)

    console.log("In getItemsInUseBySku");

    const totalsBySku = getTotalsBySku(events, sku);

    let itemsInUseBySku;

    const totalBorrowed = totalsBySku.borrow;
    const totalLost = totalsBySku.lost;
    const totalEol = totalsBySku.eol;
    const totalReturned = totalsBySku.return;

    console.log("totalBorrowed: ", totalBorrowed);
    console.log("totalReturned: ", totalReturned);
    console.log("totalLost: ", totalLost);
    console.log("totalEol: ", totalEol);

    itemsInUseBySku = totalBorrowed - totalReturned - totalLost - totalEol;

    console.log("itemsInUseBySku: ", itemsInUseBySku);

    return itemsInUseBySku;
}

export function getLifetimeUses(events: Event[]): number {
    /* Returns the total number of times a BORROW event occurred. */
    
    console.log("In getLifetimeUses");

    const totalsBySku = getTotals(events);

    const lifetimeUses = totalsBySku.borrow;

    console.log("lifetimeUses: ", lifetimeUses);

    return lifetimeUses;
}

export function getReturnRate(events: Event[]): number {
    /* Returns an average (approximation) of cumulative return rate by considering
    all the borrowed and returned items. */
    
    // TODO: handle 0 total borrowed

    console.log("In getReturnRate");

    const totals = getTotals(events);

    const totalBorrowed = totals.borrow;
    const totalReturned = totals.return;

    const returnRate = (totalReturned/totalBorrowed) * 100;

    console.log("returnRate: ", returnRate);

    return returnRate;
}

export function getReturnRateBySku(events: Event[], sku: Sku): number {
    /* Returns the return rate for a particular sku. */

    // TODO: handle 0 total borrowed

    console.log("In getReturnRateBySku");

    const totalsBySku = getTotalsBySku(events, sku);

    const totalBorrowed = totalsBySku.borrow;
    const totalReturned = totalsBySku.return;

    const returnRateBySku = (totalReturned/totalBorrowed) * 100;

    console.log("returnRateBySku: ", returnRateBySku);

    return returnRateBySku;
}

export function getDailyBorrowedProducts(events: Event[]) {
    /* Returns an array of the number of products borrowed day-by-day based on the passed Events. */
    
}