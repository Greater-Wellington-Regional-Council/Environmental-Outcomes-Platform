const LOCAL_HOST_REGEX = /localhost/
const REVIEW_HOST_REGEX = /.*\.amplifyapp\.com$/
const DEV_HOST_REGEX = /.*\.gw-eop-dev\.tech$/
const STAGE_HOST_REGEX = /.*\.gw-eop-stage\.tech$/
const PROD_HOSTNAME = 'plan-limits.eop.gw.govt.nz'

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
    options: { timeout: number, expiry?: number } = { timeout: 2000, expiry: 60 }
) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeout)

  const cacheEntry = cache[url]

  // If a cached entry exists and hasn't expired, return the cached data
  const now = Date.now()
  if (cacheEntry && cacheEntry.expiry > now) {
    clearTimeout(timeoutId)
    return cacheEntry.data
  }

  // If expiry is set to 0, we bypass the cache and ensure it's expired
  if (options.expiry === 0) {
    expireCache(url)
  }

  try {
    const res = await fetch(url, { signal: controller.signal })

    if (!res.ok) {
      const errorText = `"res.ok" not true fetching from ${url}: ${res.statusText}`
      console.error(errorText)
      clearTimeout(timeoutId)
      return { error: errorText }
    }

    const data = await res.json()
    clearTimeout(timeoutId)

    // Update the cache with the new data and set the expiry time
    const expiryTime = options.expiry ? now + options.expiry * 1000 : Infinity
    cache[url] = { data, expiry: expiryTime }

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

export const post = async (
    url: string,
    payload: unknown,
    options: { timeout: number } = { timeout: 2000 }
) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeout)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })

    if (!res.ok) {
      const errorText = `"res.ok" not true fetching from ${url}: ${res.statusText}`
      console.error(errorText)
      clearTimeout(timeoutId)
      return { error: errorText }
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