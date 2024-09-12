import { parseHtmlListToArray } from './parseHtmlListToArray'; // Adjust the path as needed

describe('parseHtmlListToArray', () => {
    it('should return an array of list items', () => {
        const html = `<ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>`;

        const result = parseHtmlListToArray(html);

        expect(result).toEqual(['Item 1', 'Item 2', 'Item 3']);
    });

    it('should handle empty strings and return an empty array', () => {
        const html = ``;

        const result = parseHtmlListToArray(html);

        expect(result).toEqual([]);
    });

    it('should trim the text content of each list item', () => {
        const html = `<ul>
      <li>  Item 1  </li>
      <li>  Item 2  </li>
    </ul>`;

        const result = parseHtmlListToArray(html);

        expect(result).toEqual(['Item 1', 'Item 2']);
    });

    it('should return an empty array when there are no list items', () => {
        const html = `<ul></ul>`;

        const result = parseHtmlListToArray(html);

        expect(result).toEqual([]);
    });

    it('should return an empty array for non-list', () => {
        const html = `<p></p>`;

        const result = parseHtmlListToArray(html);

        expect(result).toEqual([]);
    });

    it('should return an empty array for non-html', () => {
        const html = `whatever`;

        const result = parseHtmlListToArray(html);

        expect(result).toEqual([]);
    });

    it('should return an array of items with special characters', () => {
        const html = `<ul>
      <li>Item &amp; Special 1</li>
      <li>Item &lt; Special 2</li>
    </ul>`;

        const result = parseHtmlListToArray(html);

        expect(result).toEqual(['Item & Special 1', 'Item < Special 2']);
    });
});