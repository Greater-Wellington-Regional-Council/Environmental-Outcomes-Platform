import {describe, expect, vi} from "vitest";
import {tw} from "@lib/pdfTailwindStyles.ts";

vi.mock('lodash', () => {
  return {
    default: {
      get: (_: unknown, key: string) => {
        return key == 'body' ?
          'text-normal' : key
      }
    }
  }
});

describe('pdfTailwindStyles', function () {
  it('st() returns correct translation of tailwind style', () => {
    expect(tw('body')).toEqual('text-normal')
  });

  it('st() returns correct translation of tailwind style embedded with other tw utilities', () => {
    expect(tw('body scale-110')).toEqual('text-normal scale-110')
  });
});