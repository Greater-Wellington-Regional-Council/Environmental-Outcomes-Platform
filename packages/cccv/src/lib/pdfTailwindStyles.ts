import _ from "lodash";

export const pdfTailwindStyles = {
  h1: "font-sans font-bold text-[24px] leading-6",
  h2: "font-sans font-bold text-[18px] leading-6",
  h3: "font-sans font-bold text-[16px] leading-6",
  h4: "font-sans font-bold text-[16px] leading-6 capitalize",
  h5: "font-sans font-bold text-[16px] leading-6",
  h6: "font-sans font-bold text-[14px] leading-6",
  body: "font-sans text-[12px] leading-6",
  caption: "font-sans text-[16px] leading-[22px] text-textCaption",
  button: "font-sans text-nui font-bold text-[16px] leading-[22px] border-2 rounded-3xl pl-4 border-nui pr-4 pt-2 pb-2",
  "button:hover": "font-source-sans-3 text-white bg-nui font-bold text-[16px] leading-[22px]",
  "button:disabled": "font-source-sans-3 text-nui font-bold text-[16px] leading-[22px]",
  ul: "list-inside ml-[-1.5em] pl-1.5 indent-[-1.5em]",
  "ul li": "list-disc ml-6 pl-6 -mt-1.5 leading-7",
};

export const tw = (input: string): string => {
  Object.keys(pdfTailwindStyles).forEach((key) => {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    input = input.replace(regex, _.get(pdfTailwindStyles, key));
  });

  return input;
};