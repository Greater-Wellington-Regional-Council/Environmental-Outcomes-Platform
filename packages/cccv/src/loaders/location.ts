import {parseLocationString} from "@src/lib/locationString.ts";

const loadLocation = async ({ params }: Request) => {
    return parseLocationString(params.location)
}

export default loadLocation
