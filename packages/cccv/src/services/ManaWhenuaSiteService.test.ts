import service from './ManaWhenuaSiteService'
import ManaWhenuaSites from "@values/manaWhenuaSites.ts"
import {describe} from "vitest"

describe('ManaWhenuaSiteService', () => {
    it('should return ManaWhenuaSite by name', () => {
        service.getBySiteName('Kaukau', (e) => console.log(e)).then(
            (result) => {
                expect(result).toEqual(ManaWhenuaSites[10])
            }
        )
    })
    it('should return ManaWhenuaSite by name', () => {
        service.getBySiteName('Rongoā', (e) => console.log(e)).then(
            (resultAccented) => {
                expect(resultAccented).toEqual(ManaWhenuaSites[39])
                service.getBySiteName('Rongoa', (e) => console.log(e)).then(
                    (resultUnaccented) => {
                        expect(resultUnaccented).toEqual(resultUnaccented)
                    }
                )
            }
        )
    })
    it('should ignore case on retrieving Site by name', () => {
        service.getBySiteName('Rongoā', (e) => console.log(e)).then(
            (resultAccented) => {
                expect(resultAccented).toEqual(ManaWhenuaSites[39])
                service.getBySiteName('rongoa', (e) => console.log(e)).then(
                    (resultUnaccented) => {
                        expect(resultUnaccented).toEqual(resultUnaccented)
                    }
                )
            }
        )
    })
})
