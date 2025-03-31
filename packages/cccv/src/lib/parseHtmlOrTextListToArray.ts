import makeSafe from '@lib/makeSafe.ts';

export function isEmptyHtmlTag(str: string): boolean {
  const emptyHtmlTagRegex = /^<([a-zA-Z][a-zA-Z0-9]*)>\s*<\/\1>$/;
  return emptyHtmlTagRegex.test(str.trim());
}

export function parseHtmlOrTextListToArray(textOrHtml: string): string[] {

  const quotedStringPattern = /"([^"]*)"(?:\s*,\s*|$)/g;
  const matches = [];
  let match;
  while ((match = quotedStringPattern.exec(textOrHtml)) !== null) {
    if (match[1]) {
      matches.push(makeSafe(match[1]));
    }
  }

  if (matches.length > 0) {
    return matches;
  }

  const tempDiv = document.createElement('div');
  const sanitizedHtml = makeSafe(textOrHtml);
  tempDiv.innerHTML = sanitizedHtml;

  const listItems = Array.from(tempDiv.querySelectorAll('li'));

  if (listItems.length > 1) {
    return listItems.map(li => makeSafe(li.textContent?.trim() || ''));
  } else {
    if (!listItems.length && (!sanitizedHtml || sanitizedHtml.trim() === ''))
      return [];

    if (isEmptyHtmlTag(sanitizedHtml)) return []

    const singleItem = makeSafe(sanitizedHtml)?.trim();
    return singleItem ? [singleItem] : [];
  }
}
