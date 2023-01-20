import { Action, Event } from "@prisma/client";
import { getEventsByAction } from "./tracking/trackingUtils";
export const productionAndDistributionEmission = 565.33 + 321.95;
export const washingEmission = 44.14;

export const recyclingEmission = 102.69;

const incinerationEmission = -574.53;

const singleUseEmissions = 330.36;

export function getEmissions(events: Event[]): number {
  const usedOnce = new Map<string, undefined>();
  let emissions = 0;
  events.forEach((event) => {
    if (event.itemId) {
      if (event.action == Action.BORROW && !usedOnce.has(event.itemId)) {
        emissions += productionAndDistributionEmission;
        usedOnce.set(event.itemId, undefined);
      }
      if (event.action == Action.RETURN) {
        emissions += washingEmission;
      }
      if (event.action == Action.EOL) {
        emissions += recyclingEmission;
      }
      if (event.action == Action.LOST) {
        emissions += incinerationEmission;
      }
    }
  });
  return emissions;
}

export function getSingleUseEmissions(numUsed: number): number {
  return numUsed * singleUseEmissions;
}

export function calculatePercent(events: Event[]): number {
  const reduction =
    getEmissions(events) / getSingleUseEmissions(getEventsByAction(events, Action.BORROW).length);
  return 1 - reduction;
}