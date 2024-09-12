import {parseLocationString} from "@src/lib/locationString.ts";

const loadLocation = async ({ params }: never) => {
  try {
    return parseLocationString((params as { location: string })?.location)
  } catch (error) {
    console.error('Failed in loadLocation:', error);
  }
}

export default loadLocation
