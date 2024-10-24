import React from "react"
import {Address} from "@services/AddressesService/AddressesService.ts"

const PhysicalAddress: React.FC<{ address: Address }> = ({ address }) => {
    return (
        <div
            className="FreshwaterManagementUnit bg-white p-6 pt-0 relative overflow-hidden flex"
            id={`physical_address_${address.id || ""}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4a5568" className="size-6">
                <path
                    fillRule="evenodd"
                    d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    clipRule="evenodd"
                />
            </svg>
            <div className="w-[80%]">
                {address.address.split(",").map((line, i) => (
                    <p key={i} className="w-[80%] font-bold text-lg">
                        {line}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default PhysicalAddress