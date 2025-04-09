package nz.govt.eop.plan_limits

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.mockk.clearAllMocks
import io.mockk.every
import io.mockk.mockk
import org.jooq.DSLContext

class ManifestTest : FunSpec({

    lateinit var dbContext: DSLContext
    lateinit var manifest: Manifest
    lateinit var queries: Queries

    beforeEach {
        clearAllMocks()

        queries = mockk<Queries>()
        dbContext = mockk<DSLContext>()
        manifest = Manifest(queries, dbContext)
    }

    test("should recognise when tables exist") {
        every { queries.tablesExist() } returns true
        every { queries.tablePopulated("plan_regions") } returns true

        val result = manifest.tablesExistAndPopulated() shouldBe true
    }

    test("should recognise when tables do not exist") {
        every { queries.tablesExist() } returns false
        every { queries.tablePopulated("plan_regions") } returns true

        val result = manifest.tablesExistAndPopulated() shouldBe false
    }

    test("should recognise when tables exist, but not populated") {
        every { queries.tablesExist() } returns true
        every { queries.tablePopulated("plan_regions") } returns false

        val result = manifest.tablesExistAndPopulated() shouldBe false
    }
})
