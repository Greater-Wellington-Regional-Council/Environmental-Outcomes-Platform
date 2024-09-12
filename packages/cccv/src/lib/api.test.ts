import {determineBackendUri} from "@lib/api"

describe('connect to API', () => {
  it('should return the correct API URL for the production environment', () => {
    expect(determineBackendUri('plan-limits.eop.gw.govt.nz')).toBe('https://data.eop.gw.govt.nz')
  })

  it('should return the correct API URL for the staging environment', () => {
    expect(determineBackendUri('staging.gw-eop-stage.tech')).toBe('https://data.gw-eop-stage.tech')
  })

  it('should return the correct API URL for the development environment', () => {
    expect(determineBackendUri('dev.gw-eop-dev.tech')).toBe('https://data.gw-eop-dev.tech')
  })

  it('should return the correct API URL for the review environment', () => {
    expect(determineBackendUri('review-123.gw-eop-dev.tech')).toBe('https://data.gw-eop-dev.tech')
  })

  it('should return the correct API URL for the local environment', () => {
    expect(determineBackendUri('localhost')).toBe('http://localhost:8080')
  })

  it('should return the correct API URL for an unknown environment', () => {
    expect(determineBackendUri('unknown')).toBe('https://data.gw-eop-dev.tech')
  })
})
