import DOMPurify from 'dompurify';

export function parseHtmlListToArray(html: string): string[] {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = DOMPurify.sanitize(html);
    return Array.from(tempDiv.querySelectorAll('li')).map(li => li.textContent?.trim() || '');
}