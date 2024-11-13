import purify from "dompurify"

export const makeSafe = (str: string): string => {
  return purify.sanitize(
      (str ?? '').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/\s*script\s*>/gi, '')
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