import {Option, Select} from "@material-tailwind/react";
import addressesService, {Address} from "@services/AddressesService.ts";

export type AddressSearchProps = {
  startPattern: string;
}

export default function AddressSearch({ startPattern }: AddressSearchProps) {
  return (
      <div className="w-72">
        <Select label="Search for address" placeholder={startPattern} onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined} className={"text-textCaption rounded-none"}>
          {addressesService.getAddresses().map((address: Address, index: number) => (
            <Option key={index} value={address.address}>{address.address}</Option>
          ))}
        </Select>
      </div>
    );
  }
