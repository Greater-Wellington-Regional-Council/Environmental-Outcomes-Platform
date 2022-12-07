package nz.govt.eop.geo

import nz.govt.eop.si.jooq.tables.AllocationAmounts
import org.jooq.DSLContext
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
@SpringBootTest
class LoadByTakeTypeTest(@Autowired val context: DSLContext) {

    @Test
    fun `test`() {

        val records = context.selectFrom(AllocationAmounts.ALLOCATION_AMOUNTS).fetch()

        println(records)


    }


}
