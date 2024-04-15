import {parseLocationString} from "@src/lib/locationString.ts";

const loadLocation = async ({ params }: never) => {
    return parseLocationString((params as { location: never })?.location)
}

export default loadLocation
