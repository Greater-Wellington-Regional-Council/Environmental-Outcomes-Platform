import purify from "dompurify"

const normalize = (str: string): string => {
  // Convert bullets to <ul>
  let s = str.replace(/^(·)/, '<ul><li>')
  s = s.replace(/(·)$/, '</li></ul>')
  s = s.replace(/(·)/g, '</li><li>')
  return s
}

export const makeSafe = (str: string, allowedTags?: string[]): string => {
  const tagsAllowed = ['p', 'br', 'ul', 'li', ...allowedTags ?? []]
  return purify.sanitize(
      (normalize(str) ?? ''), { ALLOWED_TAGS: tagsAllowed }
  )
}

export const makeFileNameSafe = (fileName: string, allowedExtensions: string[] = ['pdf', 'txt', 'docx', 'jpeg', 'jpg', 'png']): string => {
  const extensionsPattern = allowedExtensions.join('|')
  const safeFileNamePattern = new RegExp(`^[\\w\\s-]+\\.(${extensionsPattern})$`, 'i')
  return safeFileNamePattern.test(fileName) ? fileName : 'downloaded-file.pdf'
}

export const makeUrlSafe = (url: string): string => {
  try {
    const parsedUrl = new URL(url)
    if (['https:', 'http:', 'ftp:'].includes(parsedUrl.protocol)) {
      return parsedUrl.href
    }
  } catch {
    return 'about:blank'
  }
  return 'about:blank'
}

export default makeSafe
