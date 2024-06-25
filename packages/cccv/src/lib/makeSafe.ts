import purify from "dompurify";

const makeSafe = (str: string): string => {
  return purify.sanitize(
    (str ?? '').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/\s*script\s*>/gi, '').replace(/<[^>]+>/g, '')
  );
};

export default makeSafe;