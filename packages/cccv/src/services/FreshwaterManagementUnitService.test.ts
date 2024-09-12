import service from '@services/FreshwaterManagementUnitService.ts'
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts"

describe('FreshwaterManagementUnits service', () => {
  it('should return a FreshwaterManagementUnits service with required functions', () => {
    expect(service.getByLocation).toBeDefined()
  })

  it('should return implementaion ideas for Parkvale Streams', () => {
    const record = {
      freshwaterManagementUnit: {
        id: 1,
        fmuName1: 'Parkvale Stream',
      },
      tangataWhenuaSites: [],
    }
    const augmentedRecord = service.augmentRecord(record as FmuFullDetails)
    expect(augmentedRecord.freshwaterManagementUnit.implementationIdeas!).toContain("Consider wetlands for water quality treatment")
  })
})