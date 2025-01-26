import service from './ManaWhenuaSiteService.ts'
import ManaWhenuaSites from "@lib/values/manaWhenuaSites.ts"
import {describe} from "vitest"

describe('ManaWhenuaSiteService', () => {
    it('should return ManaWhenuaSite by name', () => {
        service.getBySiteName('Kaukau').then(
            (result) => {
                expect(result).toEqual(ManaWhenuaSites[10])
            }
        )
    })
    it('should return ManaWhenuaSite by name', () => {
        service.getBySiteName('Rongoā').then(
            (resultAccented) => {
                expect(resultAccented).toEqual(ManaWhenuaSites[39])
                service.getBySiteName('Rongoa').then(
                    (resultUnaccented) => {
                        expect(resultUnaccented).toEqual(resultUnaccented)
                    }
                )
            }
        )
    })
    it('should ignore case on retrieving Site by name', () => {
        service.getBySiteName('Rongoā').then(
            (resultAccented) => {
                expect(resultAccented).toEqual(ManaWhenuaSites[39])
                service.getBySiteName('rongoa').then(
                    (resultUnaccented) => {
                        expect(resultUnaccented).toEqual(resultUnaccented)
                    }
                )
            }
        )
    })
})
