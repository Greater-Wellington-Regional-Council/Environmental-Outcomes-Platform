package nz.govt.eop.freshwater_management_units.services

import nz.govt.eop.freshwater_management_units.repositories.TangataWhenuaSiteRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TangataWhenuaSiteService
    @Autowired
    constructor(private val repository: TangataWhenuaSiteRepository) {
        @Transactional
        fun deleteAllSites() {
            repository.deleteAll()
        }
    }
