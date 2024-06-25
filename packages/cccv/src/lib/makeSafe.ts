import purify from "dompurify";

const makeSafe = (str: string): string => purify.sanitize((str ?? '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ''))

export default makeSafe;