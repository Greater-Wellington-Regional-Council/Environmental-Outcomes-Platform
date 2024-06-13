import AddressSearch, { AddressSearchProps } from './AddressSearch';

export default {
    title: "Address Search",
    component: AddressSearch
};

export const Default = (props: AddressSearchProps) => <AddressSearch {...props} />;
