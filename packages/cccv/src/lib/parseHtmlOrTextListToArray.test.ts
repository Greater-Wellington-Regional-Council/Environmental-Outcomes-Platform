import { parseHtmlOrTextListToArray } from './parseHtmlOrTextListToArray.ts'; // Adjust the path as needed

describe('parseHtmlOrTextListToArray', () => {
    it('should return an array of list items', () => {
        const html = `<ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>`;

        const result = parseHtmlOrTextListToArray(html);

        expect(result).toEqual(['Item 1', 'Item 2', 'Item 3']);
    });

    it('should handle empty strings and return a single-item array with the sanitized input', () => {
        const html = ``;

        const result = parseHtmlOrTextListToArray(html);

        expect(result).toEqual([]);
    });

    it('should trim the text content of each list item', () => {
        const html = `<ul>
      <li>  Item 1  </li>
      <li>  Item 2  </li>
    </ul>`;

        const result = parseHtmlOrTextListToArray(html);

        expect(result).toEqual(['Item 1', 'Item 2']);
    });

    it('should return an empty array when there are no list items', () => {
        const html = `<ul></ul>`;

        const result = parseHtmlOrTextListToArray(html);

        expect(result).toEqual([]);
    });

    it('should return an emoty array for empty non-list HTML', () => {
        const html = `<p></p>`;

        const result = parseHtmlOrTextListToArray(html);

        expect(result).toEqual([]);
    });

    it('should return a single-item array with the sanitized input for non-HTML text', () => {
        const html = `whatever`;

        const result = parseHtmlOrTextListToArray(html);

        expect(result).toEqual(['whatever']);
    });

    it('should return an array of items with special characters', () => {
        const html = `<ul>
          <li>Item &amp; Special 1</li>
          <li>Item &lt; Special 2</li>
        </ul>`;

        const result = parseHtmlOrTextListToArray(html);

        expect(result).toEqual(['Item & Special 1', 'Item &lt; Special 2']);
    });

    it('should return an array of quoted strings', () => {
        const text = `"Item 1", "Item 2", "Item 3"`;

        const result = parseHtmlOrTextListToArray(text);

        expect(result).toEqual(['Item 1', 'Item 2', 'Item 3']);
    });

    it('should return an array of sanitized quoted strings with HTML', () => {
        const text = `"Item <b>1</b>", "Item <i>2</i>", "Item <u>3</u>"`;

        const result = parseHtmlOrTextListToArray(text);

        expect(result).toEqual(['Item 1', 'Item 2', 'Item 3']);
    });

    it('should return an array of quoted strings with spaces around commas', () => {
        const text = `"Item 1" , "Item 2" , "Item 3"`;

        const result = parseHtmlOrTextListToArray(text);

        expect(result).toEqual(['Item 1', 'Item 2', 'Item 3']);
    });
});
