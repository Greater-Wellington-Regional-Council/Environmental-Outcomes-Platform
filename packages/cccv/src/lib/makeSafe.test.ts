import { describe, it, expect } from 'vitest'
import makeSafe from './makeSafe'

describe('makeSafe', () => {
  it('removes <script> tags and their content', () => {
    const unsafeString = '<div>Hello<script>alert("XSS")</script>World</div>'
    const safeString = makeSafe(unsafeString)
    expect(safeString).toBe('<div>HelloWorld</div>')
  })

  it('removes <script> tags including spaces and their content', () => {
    const unsafeString = '<div>Hello<script>alert("XSS")</script >World</div>'
    const safeString = makeSafe(unsafeString)
    expect(safeString).toBe('<div>HelloWorld</div>')
  })

  it('removes partial <script> tag', () => {
    const unsafeString = '<div>Hello<scriptalert("XSS")</script >World</div>'
    const safeString = makeSafe(unsafeString)
    expect(safeString).toBe('<div>HelloWorld</div>')
  })

  it('removes unclosed partial <script> tag', () => {
    const unsafeString = '<div>Hello<scriptalert("XSS")World</div>'
    const safeString = makeSafe(unsafeString)
    expect(safeString).toBe('<div>Hello</div>')
  })

  it('removes self-closing <script/> tags', () => {
    const unsafeString = '<div>Hello<script/>World</div>'
    const safeString = makeSafe(unsafeString)
    expect(safeString).toBe('<div>Hello</div>')
  })

  it('removes incomplete <script> tags', () => {
    const unsafeString = '<div>Hello<scriptWorld'
    const safeString = makeSafe(unsafeString)
    expect(safeString).toBe('<div>Hello</div>')
  })

  it('removes other HTML tags', () => {
    const unsafeString = '<div><p>This is <strong>bold</strong> text</p></div>'
    const safeString = makeSafe(unsafeString)
    expect(safeString).toBe('<div><p>This is <strong>bold</strong> text</p></div>')
  })

  it('handles strings without HTML correctly', () => {
    const normalString = 'Just a normal string'
    const safeString = makeSafe(normalString)
    expect(safeString).toBe('Just a normal string')
  })

  it('handles empty strings correctly', () => {
    const emptyString = ''
    const safeString = makeSafe(emptyString)
    expect(safeString).toBe('')
  })

  it('handles null and undefined input', () => {
    const nullString = null
    const undefinedString = undefined
    const safeNullString = makeSafe(nullString as unknown as string)
    const safeUndefinedString = makeSafe(undefinedString as unknown as string)
    expect(safeNullString).toBe('')
    expect(safeUndefinedString).toBe('')
  })
})