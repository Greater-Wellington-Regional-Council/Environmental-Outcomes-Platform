import DOMPurify from 'dompurify';

export function parseHtmlOrTextListToArray(textOrHtml: string, tagsAllowed = []): string[] {
    const quotedStringPattern = /"([^"]*)"(?:\s*,\s*|$)/g;
    const matches = [];
    const allowedTags = { ALLOWED_TAGS: tagsAllowed }
    let match;
    while ((match = quotedStringPattern.exec(textOrHtml)) !== null) {
        if (match[1]) {
            matches.push(DOMPurify.sanitize(match[1], allowedTags));
        }
    }

    if (matches.length > 0) {
        return matches;
    }

    const tempDiv = document.createElement('div');
    const sanitizedHtml = DOMPurify.sanitize(textOrHtml);
    tempDiv.innerHTML = sanitizedHtml;

    const listItems = Array.from(tempDiv.querySelectorAll('li'));

    if (listItems.length > 0) {
        return listItems.map(li => DOMPurify.sanitize(li.textContent?.trim() || '', allowedTags));
    } else {
        const singleItem= DOMPurify.sanitize(sanitizedHtml, allowedTags)?.trim()
        return singleItem ? [singleItem] : [];
    }
}