import {parseLocationString} from "@utils/locationString.ts";

const loadLocation = async ({ params }: Request) => {
    return parseLocationString(params.location)
}

export default loadLocation
