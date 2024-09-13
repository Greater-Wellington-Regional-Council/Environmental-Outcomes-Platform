import {
  createLocationString,
  createPinnedLocationString, defineProjections,
  parseLocationString,
  parsePinnedLocation, targetProjection,
} from './locationString.ts'
import { describe, it, expect } from 'vitest'
import * as proj4 from 'proj4'

describe('parseLocationString', () => {
  it('should return null when string is invalid', () => {
    const result = parseLocationString('foo')

    expect(result).toEqual(null)
  })

  it('should return null when string is invalid', () => {
    const result = parseLocationString('AAA@-40.959,175.455,8z')

    expect(result).toEqual(null)
  })

  it('should return object when string is valid', () => {
    const result = parseLocationString('@-40.959,175.455,8z')

    expect(result).toEqual({
      latitude: -40.959,
      longitude: 175.455,
      zoom: 8
    })
  })

  it('should return object when string has no decimal places', () => {
    const result = parseLocationString('@-40,175,8z')

    expect(result).toEqual({
      latitude: -40,
      longitude: 175,
      zoom: 8
    })
  })
})

describe('createLocationString', () => {
  it('should build a string', () => {
    const result = createLocationString({
      latitude: -41.32049184189989,
      longitude: 175.1659546540098,
      zoom: 7.9999
    })

    expect(result).toEqual('@-41.32,175.166,8z')
  })

  it('should build a string with no decimal places', () => {
    const result = createLocationString({
      latitude: -41,
      longitude: 175,
      zoom: 8
    })

    expect(result).toEqual('@-41,175,8z')
  })
})

describe('parsePinnedLocation', () => {
  it('should return null when string is invalid', () => {
    const result = parsePinnedLocation('foo')

    expect(result).toEqual(null)
  })

  it('should return null when string is almost', () => {
    const result = parsePinnedLocation('AA-40.959,175.455ZZ')

    expect(result).toEqual(null)
  })

  it('should return object when string is valid', () => {
    const result = parsePinnedLocation('-40.959,175.455')

    expect(result).toEqual({
      latitude: -40.959,
      longitude: 175.455
    })
  })

  it('should return object when string has no decimal places', () => {
    const result = parsePinnedLocation('-40,175')

    expect(result).toEqual({
      latitude: -40,
      longitude: 175
    })
  })
})

describe('createPinnedLocationString', () => {
  it('should build a string', () => {
    const result = createPinnedLocationString({
      latitude: -41.32049184189989,
      longitude: 175.1659546540098
    })

    expect(result).toEqual('-41.32,175.166')
  })
})

describe('Can define EPSG:2193 projection', () => {
  it('should define EPSG:2193', () => {
    defineProjections()
    expect(proj4.defs('EPSG:2193')).not.toBeNull()
  })
})

describe('Can convert projections', () => {
  it('EPSG:2193 to EPSG:4326', async () => {
    const result = await targetProjection([175.437, -40.901])
    expect(result).toEqual([82.92642131035626, -75.81515162566647])
  })
  it('EPSG:4326 to EPSG:2193', async () => {
    const result = await targetProjection([175.437, -40.901], true)
    expect(result).toEqual([1805270.7400507138, 5469373.55043029])
  })
})
