export default function formatFilename(input: string, defaultName: string): string {

  const sanitized = input.replace(/[^a-z0-9\_\-\.]/gi, '_')
  const trimmed = sanitized.trim()

  return trimmed.length > 0 ? trimmed : defaultName
}
