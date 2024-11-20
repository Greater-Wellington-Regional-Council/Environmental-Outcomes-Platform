import service from '@services/FreshwaterManagementUnitService/FreshwaterManagementUnitService.ts'
import {FmuFullDetails} from "@services/models/FreshwaterManagementUnit.ts"

describe('FreshwaterManagementUnits service', () => {
  it('should return a FreshwaterManagementUnits service with required functions', () => {
    expect(service.getByLocation).toBeDefined()
  })

  it('should return implementaion ideas for Parkvale Streams', async () => {
    const record: FmuFullDetails = {
      freshwaterManagementUnit: {
        id: 1,
        fmuName1: 'Parkvale Stream',
      },
      tangataWhenuaSites:
          {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "MultiPolygon",
                  coordinates: [
                    [
                      [
                        [174.775, -41.286],
                        [174.775, -41.287],
                        [174.776, -41.287],
                        [174.776, -41.286],
                        [174.775, -41.286]
                      ]
                    ]
                  ]
                }
              }
            ],
          },
    }
    const augmentedRecord = await service.augmentRecord(record.freshwaterManagementUnit)
    expect(augmentedRecord!.systemValues?.whaituaOverview || "").toContain("The Ruamāhanga is the largest")
  })
})