const LOCAL_HOST_REGEX = /localhost/
const REVIEW_HOST_REGEX = /.*\.amplifyapp\.com$/
const DEV_HOST_REGEX = /.*\.gw-eop-dev\.tech$/
const STAGE_HOST_REGEX = /.*\.gw-eop-stage\.tech$/
const PROD_HOSTNAME = 'cccv.eop.gw.govt.nz'

const DEFAULT_TIMEOUT_MSECS = 10000
const DEFAULT_CACHE_EXPIRY_SECS = 60

export const determineBackendUri = (hostname: string = window.location.hostname) => {
  if (PROD_HOSTNAME === hostname)
    return 'https://data.eop.gw.govt.nz'

  if (STAGE_HOST_REGEX.test(hostname))
    return 'https://data.gw-eop-stage.tech'

  if (DEV_HOST_REGEX.test(hostname) || REVIEW_HOST_REGEX.test(hostname))
    return 'https://data.gw-eop-dev.tech'

  if (LOCAL_HOST_REGEX.test(hostname))
    return 'http://localhost:8080'

  return 'https://data.gw-eop-dev.tech'
}

const cache: Record<string, { data: unknown, expiry: number }> = {}

export const expireCache = (url: string) => {
  delete cache[url]
}

export const get = async (
    url: string,
    options: { timeout?: number; expiry?: number; mode?: RequestMode } = {}
) => {

  const requestOptions = {
    timeout: DEFAULT_TIMEOUT_MSECS,
    expiry: DEFAULT_CACHE_EXPIRY_SECS,
    ...options
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout)

  const cacheEntry = cache[url]

  const now = Date.now()
  if (cacheEntry && cacheEntry.expiry > now) {
    clearTimeout(timeoutId)
    return cacheEntry.data
  }

  if (requestOptions.expiry === 0) {
    expireCache(url)
  }

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      mode: requestOptions.mode,
    })

    if (!res.status) {
      console.log('No response status fetching from', url)
      clearTimeout(timeoutId)
    }

    if (!res.ok) {
      const errorText = `"res.ok" not true fetching from ${url}: ${res.statusText}`
      console.error(errorText)
      clearTimeout(timeoutId)
      return null
    }

    const data = await res.json()
    clearTimeout(timeoutId)

    const expiryTime = requestOptions.expiry ? now + requestOptions.expiry * 1000 : Infinity
    cache[url] = {data, expiry: expiryTime}

    return data
  } catch (e) {
    clearTimeout(timeoutId)

    if ((e as { name: string }).name === 'AbortError') {
      console.error('Fetch aborted due to timeout.')
      return { error: 'Request timed out' }
    }

    if (e instanceof Error) {
      e && console.error('Fetch error:', e)
      return {error: (e as { message: string }).message}
    } return { error: 'Unknown error' }
  }
}

export const post = async (
    url: string,
    payload: unknown,
    options: { timeout?: number, rawPayload?: boolean } = { timeout: 2000, rawPayload: false }
) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeout)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: options.rawPayload ? payload as string: JSON.stringify(payload),
      signal: controller.signal
    })

    if (!res.ok) {
      const errorText = `"res.ok" not true fetching from ${url}: ${res.statusText}`
      console.error(errorText)
      clearTimeout(timeoutId)
      return null
    }

    const data = await res.json()
    clearTimeout(timeoutId)
    return data
  } catch (e) {
    clearTimeout(timeoutId)

    if ((e as { name: string }).name === 'AbortError') {
      console.error('Fetch aborted due to timeout.')
      return { error: 'Request timed out' }
    }

    console.error('Fetch error:', e)
    return { error: (e as { message: string }).message }
  }
}