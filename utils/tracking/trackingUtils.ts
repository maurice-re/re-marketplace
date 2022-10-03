import { Action, Event, Sku } from "@prisma/client";

// TODO: Make it so the totals only need to be calculate once

type Totals = {
    borrow: number;
    return: number;
    lost: number;
    eol: number;
}

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

function getUniqueItemIds(events: Event[]): string[] {
    /* Filters given events by unique itemId, and returns all unique item ids. */

    // Uncomment to get an array of uniqueItemId events instead
    // const uniqueItemIds: string[] = events.filter(
    //     (event1, i, arr) => arr.findIndex(eventB => eventB.itemId === event1.itemId) === i
    // );

    const uniqueItemIds = events.map(event => event.itemId)
        .filter((value, index, self) => self.indexOf(value) === index)

    return uniqueItemIds;
}

export function getCurrentBorrowedProductsBySku(events: Event[], sku: Sku): number {
    /* Returns the number of products borrowed that haven't currently been lost, 
    returned, or EOL'ed, for a given sku. */
    
    // For a particular sku:
    // # currently borrowed = (total # borrowed) - (total # returned) - (total # lost) - (total # EOL)

    console.log("In getCurrentBorrowedProductsBySku");

    const totalsBySku = getTotalsBySku(events, sku);

    let currentBorrowedProducts;

    const totalBorrowed = totalsBySku.borrow;
    const totalLost = totalsBySku.lost;
    const totalEol = totalsBySku.eol;
    const totalReturned = totalsBySku.return;

    console.log("totalBorrowed: ", totalBorrowed);
    console.log("totalReturned: ", totalReturned);
    console.log("totalLost: ", totalLost);
    console.log("totalEol: ", totalEol);

    currentBorrowedProducts = totalBorrowed - totalReturned - totalLost - totalEol;

    console.log("currentBorrowedProducts: ", currentBorrowedProducts);

    return currentBorrowedProducts;
}

export function getLifetimeBorrowedProducts(events: Event[]): number {
    /* Returns the total number of distinct items (i.e. unique itemId) borrowed 
    (including those that have already been lost, returned, or EOL'ed). */
    
    console.log("In getLifetimeBorrowedProducts");

    let lifetimeBorrowedProducts = 0;
    let uniqueItemIds: string[] = getUniqueItemIds(events);

    console.log("uniqueItemIds:");
    console.log(uniqueItemIds);

    const numUniqueItemIds = uniqueItemIds.length;

    // TODO: For each unique ID, count the number of times a "BORROW" event occurred for that item

    console.log("lifetimeBorrowedProducts: ", lifetimeBorrowedProducts);

    return lifetimeBorrowedProducts;
}

export function getDailyBorrowedProducts(events: Event[]) {
    /* Returns an array of the number of products borrowed day-by-day based on the passed Events. */
    
}