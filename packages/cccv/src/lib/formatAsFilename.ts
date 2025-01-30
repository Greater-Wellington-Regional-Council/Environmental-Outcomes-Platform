import {randomString} from "@lib/randomString.ts"

export default function formatFilename(input: string, defaultName?: string, extension?: string): string {

  const sanitized = input.replace(/[^a-z0-9_\-.]/gi, '_')
  const trimmed = sanitized.trim()

  return trimmed.length > 0 ? trimmed : defaultName || randomString(8) + (extension ? `.${extension}` : '')
}
