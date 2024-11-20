import { render } from "@testing-library/react"
import PhysicalAddress from "./PhysicalAddress"
import { Address } from "@services/AddressesService/AddressesService.ts"

describe("PhysicalAddress Component", () => {
    const address: Address = {
        id: "1",
        address: "123 Main St, Springfield, IL, 62701",
        location: {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [174.763336, -36.848461],
            },
            properties: []
        }
    }

    test("renders without crashing", () => {
        const { container } = render(<PhysicalAddress address={address} />)
        expect(container).toBeInTheDocument()
    })

    test("displays the address lines correctly", () => {
        const { getByText } = render(<PhysicalAddress address={address} />)
        expect(getByText("123 Main St")).toBeInTheDocument()
        expect(getByText("Springfield")).toBeInTheDocument()
        expect(getByText("IL")).toBeInTheDocument()
        expect(getByText("62701")).toBeInTheDocument()
    })

    test("has the correct id attribute", () => {
        const { container } = render(<PhysicalAddress address={address} />)
        const divElement = container.querySelector(`#physical_address_${address.id}`)
        expect(divElement).toBeInTheDocument()
    })
})