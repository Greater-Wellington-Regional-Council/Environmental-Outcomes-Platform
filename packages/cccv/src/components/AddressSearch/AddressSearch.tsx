import ComboBox, {ComboBoxProps} from '@elements/ComboBox/ComboBox';
import addressesService from '@services/AddressesService';

export interface AddressSearchProps extends Omit<ComboBoxProps, 'options'> {}

const AddressSearch = (props: AddressSearchProps) => {
  return (
    <ComboBox
      label={props.label || "Search for address"}
      placeholder={props.placeholder || "Search here"}
      options={addressesService.getAddressOptions}
      onSelect={props.onSelect}
      directionUp={props.directionUp}
    />
  );
};

export default AddressSearch;