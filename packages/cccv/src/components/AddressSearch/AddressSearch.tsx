import ComboBox, {ComboBoxProps} from '@elements/ComboBox/ComboBox'
import addressesService from '@services/AddressesService/AddressesService.ts'

export type AddressSearchProps = Omit<ComboBoxProps, 'options'>

const AddressSearch = (props: AddressSearchProps) => {
  return (
    <ComboBox
      label={props.label || "Search for address"}
      placeholder={props.placeholder || "Search here"}
      options={addressesService.getAddressOptions}
      onSelect={props.onSelect}
      directionUp={props.directionUp}
      rememberItems={props.rememberItems}
    />
  )
}

export default AddressSearch