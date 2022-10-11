import { ProductDevelopment, User } from "@prisma/client";
import { CheckoutType } from "../../pages/dashboard/checkout";
import AddressField from "../form/address-field";
import DoubleAddressField from "../form/double-address-field";

export default function Info({
  productDevelopment,
  type,
  user,
}: {
  productDevelopment: ProductDevelopment | null;
  type: CheckoutType;
  user: User | null;
}) {
  let items: (JSX.Element | JSX.Element[])[] = [];

  if (type == CheckoutType.PRODUCT_DEVELOPMENT && productDevelopment) {
    items.push(
      <div className="py-4" key="userInfo">
        <div className="text-lg font-semibold">Your Info</div>
        <DoubleAddressField
          leftPlaceholder="First Name"
          rightPlaceholder="Last Name"
          top
          required
          leftValue={user?.firstName ?? undefined}
          rightValue={user?.lastName ?? undefined}
        />
        <AddressField
          placeholder="Email"
          required
          value={user?.email ?? undefined}
        />
        <AddressField
          placeholder="Company Name"
          bottom
          required
          value={productDevelopment.companyName}
        />
      </div>
    );
  }

  return items;
}
