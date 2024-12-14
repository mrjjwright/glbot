// Is the url origin in the project origin or additional_origins?
export function isOriginInScope(url: string, project: ProjectKey | undefined) {
  if (!project) return false
  let testUrl: URL | null = null
  try {
    testUrl = new URL(url || '')
  } catch {
    return false
  }
  if (!/^http/.test(testUrl.protocol)) {
    return false
  }
  const { origin_name = '', additional_origins = [] } = project || {}
  const origins = additional_origins?.length ? [origin_name, ...additional_origins] : [origin_name]

  const originsRegex = origins.map((o) => new RegExp(o))
  const urlHost = testUrl && testUrl.hostname
  const isValid = !!urlHost && originsRegex.some((o) => o.test(urlHost))

  return isValid
}

export function isHTTP(url: string) {
  try {
    const testUrl = new URL(url || '')
    return /^http/.test(testUrl.protocol)
  } catch {
    return false
  }
}

export function isFile(url: string) {
  return new URL(url).protocol.toLowerCase() === 'file:'
}

export function getUrlHost(url: string) {
  try {
    const testUrl = new URL(url || '')
    return testUrl.hostname.toLowerCase()
  } catch {
    return ''
  }
}
export function getUrlProtocol(url: string) {
  try {
    const testUrl = new URL(url || '')
    return testUrl.protocol
  } catch {
    return ''
  }
}

export function getURLSearchParamsString(params?: Record<string, string>) {
  if (!params) return ''
  const nonEmptyParams = Object.entries(params).reduce(
    (acc, [key, value]) => (value ? { ...acc, [key]: value } : acc),
    {}
  )
  return new URLSearchParams(nonEmptyParams).toString()
}

export function isSameDomain(url1: string, url2: string) {
  try {
    const parsedUrl1 = new URL(url1)
    const parsedUrl2 = new URL(url2)

    const hostname1 = parsedUrl1.hostname.replace(/^www\./, '')
    const hostname2 = parsedUrl2.hostname.replace(/^www\./, '')

    return (
      hostname1.toLowerCase() === hostname2.toLowerCase() &&
      parsedUrl1.protocol.toLowerCase() === parsedUrl2.protocol.toLowerCase()
    )
  } catch (e) {
    console.error('Invalid URL(s) provided:', e)
    return false
  }
}

export function removeTrailingSlash(url: string) {
  const urlObj = new URL(url)
  urlObj.pathname = urlObj.pathname.replace(/\/+$/, '')
  if (urlObj.pathname === '') {
    urlObj.pathname = '/'
  }
  return urlObj.toString()
}

function truncateUrlWithSpiderRules(url: string, globalConfig: TranslationConfig) {
  if (url.trim() === '') {
    return url
  }

  let truncatedUrl = url

  try {
    if (globalConfig) {
      const truncateUrlsAt = globalConfig.spider_rules.truncate_urls_at
      if (truncateUrlsAt) {
        for (let truncatePattern of truncateUrlsAt) {
          truncatePattern += '.*'
          truncatedUrl = truncatedUrl.replace(new RegExp(truncatePattern), '')
        }
      }

      const removeUrlParam = globalConfig.spider_rules.remove_url_param
      if (removeUrlParam) {
        const urlParts = truncatedUrl.split('?')

        if (urlParts.length > 1) {
          const urlBase = urlParts[0]
          let newParams = ''

          let paramList = urlParts.length === 2 ? urlParts[1] : urlParts.slice(1).join('?')
          let hashTag = ''

          const hashIdx = paramList.indexOf('#')
          if (hashIdx !== -1) {
            hashTag = paramList.substring(hashIdx)
            paramList = paramList.substring(0, hashIdx)
          }

          const params = paramList.split('&')
          for (const param of params) {
            const [name, ...valueParts] = param.split('=')
            const value = valueParts.join('=')

            if (!removeUrlParam.includes(name)) {
              if (newParams === '') {
                newParams += '?'
              } else {
                newParams += '&'
              }
              newParams += value ? `${name}=${value}` : name
            }
          }

          truncatedUrl = urlBase + newParams + hashTag
        }
      }
    }
  } catch (e) {
    // Handle errors if necessary
  }

  return truncatedUrl
}

export function truncateURLWithSpiderRulesAndTest(link: string, globalConfig: TranslationConfig) {
  // Check if explicitly excluded
  const excludedUris = globalConfig.spider_rules.exclude_uris
  if (!excludedUris) {
    return true
  }

  // Adjust URL according to the rules
  link = truncateUrlWithSpiderRules(link, globalConfig)

  let urlPath
  try {
    const url = new URL(link)
    urlPath = url.pathname
    if (url.search) {
      urlPath += '?' + url.search
    }

    let truncateUrlHash = globalConfig.spider_rules.truncate_url_hash
    if (truncateUrlHash === null || truncateUrlHash === undefined) {
      truncateUrlHash = true
    }

    if (!truncateUrlHash) {
      if (url.hash) {
        urlPath += '#' + url.hash
      }
    }
  } catch (e) {
    return false
  }

  for (const exUriPattern of excludedUris) {
    try {
      const exPatternRegex = new RegExp(exUriPattern)
      if (exPatternRegex.test(urlPath)) {
        // Check if explicitly included override
        const includedUris = globalConfig.spider_rules.include_uris
        if (includedUris) {
          for (const incUriPattern of includedUris) {
            try {
              const incPatternRegex = new RegExp(incUriPattern)
              if (incPatternRegex.test(urlPath)) {
                return true
              }
            } catch (e) {
              // Handle exception in include URI pattern comparison
            }
          }
        }
        return false
      }
    } catch (e) {
      // Handle exception in exclude URI pattern comparison
    }
  }

  return true
}

const DOWNLOADABLE_EXTENSIONS = [
  'gz',
  'gzip',
  'zip',
  'tgz',
  'rpm',
  'bz2',
  'tar',
  'doc',
  'pdf'
] as const

export function isDownloadable(url: string): boolean {
  try {
    // Remove query params and trim whitespace
    const cleanUrl = url.split('?')[0].trim()

    // Get extension from last segment after final slash
    const extension = cleanUrl.split('/').pop()?.split('.').pop()?.toLowerCase()

    return extension ? DOWNLOADABLE_EXTENSIONS.includes(extension as any) : false
  } catch {
    return false
  }
}

function isImageUrl(url: string) {
  let sImageName = ''
  let sImgType = ''
  let sExtension = url

  const iHookIndex = sExtension.indexOf('?')
  if (iHookIndex != -1) {
    sExtension = sExtension.substring(0, iHookIndex)
  }

  const iSpaceIndex = sExtension.indexOf(' ')
  if (iSpaceIndex != -1) {
    sExtension = sExtension.substring(0, iSpaceIndex)
  }

  const iLastSlash = sExtension.lastIndexOf('/')
  if (iLastSlash != -1) {
    sExtension = sExtension.substring(iLastSlash)
  }

  const iPeriod = sExtension.lastIndexOf('.')
  if (iPeriod != -1) {
    sImgType = sExtension.substring(iPeriod + 1)
  }

  if (
    sImgType.match(/jpeg$/i) ||
    sImgType.match(/jpg$/i) ||
    sImgType.match(/jpe$/i) ||
    sImgType.match(/gif$/i) ||
    sImgType.match(/bmp$/i) ||
    sImgType.match(/png$/i) ||
    sImgType.match(/ico$/i)
  ) {
    const iSpaceIndex = url.indexOf(' ')
    if (iSpaceIndex != -1) {
      url = url.substring(0, iSpaceIndex)
    }
    sImageName = url
  }

  return sImageName
}

export function isDomainInSpiderScope(
  startUrl: string,
  url: string,
  globalConfig?: TranslationConfig
): boolean {
  try {
    const domain = getUrlHost(url)
    if (domain === '') {
      return false
    }

    if (isSameDomain(url, startUrl)) return true

    if (!globalConfig) return false

    // Check if explicitly excluded
    const excludedDomains = globalConfig.spider_rules.exclude_domains
    if (excludedDomains) {
      for (const domainPattern of excludedDomains) {
        const adjPattern = domainPattern.replace(/\./g, '\\.').replace(/\*/g, '.*')
        if (domain.match(new RegExp(adjPattern.toLowerCase()))) {
          return false
        }
      }
    }

    // Check if matches a starting domain
    const startingUris = globalConfig.spider_rules.start_uris
    if (startingUris) {
      for (const uri of startingUris) {
        if (isSameDomain(url, uri)) return true
      }
    }

    // Check if included according to spider config rules
    const includedDomains = globalConfig.spider_rules.include_domains
    if (includedDomains) {
      for (const domainPattern in includedDomains) {
        const adjPattern = domainPattern.replace(/\./g, '\\.').replace(/\*/g, '.*')
        if (domain.match(new RegExp(adjPattern.toLowerCase()))) {
          return true
        }
      }
    }
  } catch (e) {
    console.error('Error checking domain in spider scope:', e)
  }
  return false
}

export function isCrawlable(url: string) {
  if (!isHTTP(url)) {
    return { canCrawl: false, reason: 'Protocol is not HTTP(s)' }
  }

  if (isDownloadable(url)) {
    return {
      canCrawl: false,
      reason: 'URL is a downloadable file and cannot be crawled'
    }
  }

  if (isImageUrl(url)) {
    return {
      canCrawl: false,
      reason: 'URL is to image and images cannot be crawled'
    }
  }

  return { canCrawl: true, reason: 'URL can be crawled' }
}

export function canICrawlHere(
  url: string,
  startUrl?: string,
  globalConfig?: TranslationConfig
): { canCrawl: boolean; reason: string } {
  const { canCrawl, reason } = isCrawlable(url)
  if (!canCrawl) {
    return { canCrawl, reason }
  }

  // Perform additional checks only if startUrl and globalConfig are provided
  if (startUrl && globalConfig) {
    if (!isDomainInSpiderScope(startUrl, url, globalConfig)) {
      return { canCrawl: false, reason: 'Domain is not in spider scope' }
    }
    if (!truncateURLWithSpiderRulesAndTest(url, globalConfig)) {
      return {
        canCrawl: false,
        reason: 'After applying spider rules like truncate_url, URL failed test'
      }
    }
  }

  return { canCrawl: true, reason: 'URL can be crawled' }
}
