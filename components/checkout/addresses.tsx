import { Location } from ".prisma/client";
import { CheckoutType } from "../../pages/dashboard/checkout";
import AddressField from "../form/address-field";
import DoubleAddressField from "../form/double-address-field";

export default function Addresses({
  locations,
  orderString,
  type,
}: {
  locations: Location[] | null;
  orderString: string;
  type: CheckoutType;
}) {
  let items: (JSX.Element | JSX.Element[])[] = [];

  if (type == CheckoutType.ORDER && locations) {
    const ordersByLocation = orderString.split("*");
    const locationIds = ordersByLocation.map(
      (orderByLocation) => orderByLocation.split("_")[0]
    );

    const addresses = locationIds.map((locationId) => {
      const location: Location | undefined = locations.find(
        (loc) => loc.id == locationId
      );
      return (
        <div className="py-4" key={locationId + "address"}>
          {ordersByLocation.length > 1 ? (
            <div className="text-lg font-semibold">{`${
              location ? location.displayName ?? location.city : "New Location"
            } Shipping Address`}</div>
          ) : (
            <div className="text-lg font-semibold">{`Shipping Address`}</div>
          )}
          <AddressField
            placeholder="Name"
            top
            required
            value={location?.shippingName!}
          />
          <AddressField
            placeholder="Country"
            required
            value={location?.country!}
          />
          <AddressField
            placeholder="Address Line 1"
            required
            value={location?.line1!}
          />
          <AddressField
            placeholder="Address Line 2"
            value={location?.line2 ?? ""}
          />
          <DoubleAddressField
            leftPlaceholder="City"
            leftValue={location?.city!}
            rightPlaceholder="Zip"
            rightValue={location?.zip!}
            required
          />
          <AddressField
            placeholder="State"
            bottom
            required
            value={location?.state!}
          />
        </div>
      );
    });
    items.push(addresses);
  }

  return items;
}
