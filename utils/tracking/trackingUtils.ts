import { Action, Company, Event, Sku, User } from "@prisma/client";
import prisma from "../../constants/prisma";
import { ItemLocationSku, OrderWithItemsLocationSku } from "../dashboard/dashboardUtils";

type Totals = {
    borrow: number;
    return: number;
    lost: number;
    eol: number;
}

export function getTotalsBySku(events: Event[], sku: Sku): Totals {
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

export function getProductsInUseBySku(events: Event[], sku: Sku): number {
    /* Uses the lifetime event data to see */
    console.log("In getProductsInUseBySku");
    console.log(events);

    console.log(sku);

    // For a particular sku:
    // # in use = (total # borrowed) - (total # returned) - (total # lost) - (total # EOL)

    const totalsBySku = getTotalsBySku(events, sku);

    let productsInUse;

    const totalBorrowed = totalsBySku.borrow;
    const totalLost = totalsBySku.lost;
    const totalEol = totalsBySku.eol;
    const totalReturned = totalsBySku.return;

    console.log("totalBorrowed: ", totalBorrowed);
    console.log("totalReturned: ", totalReturned);
    console.log("totalLost: ", totalLost);
    console.log("totalEol: ", totalEol);

    productsInUse = totalBorrowed - totalReturned - totalLost - totalEol;

    console.log("productsInUse: ", productsInUse);

    return productsInUse;
}
