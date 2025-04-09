package nz.govt.eop.tasks

import io.kotest.core.spec.style.FunSpec
import io.mockk.clearAllMocks
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import nz.govt.eop.plan_limits.Manifest
import org.jooq.DSLContext

class PlanLimitsManifestUpdaterTest : FunSpec({

    val context: DSLContext = mockk(relaxed = true)
    val manifest: Manifest = mockk(relaxed = true)
    val updater = PlanLimitsManifestUpdater(context, manifest)

    beforeEach {
        clearAllMocks()
    }

    test("should log call manifest update if tables exist") {
        every { manifest.update(9) } returns mockk<Map<String, String>>()
        every { manifest.tablesExistAndPopulated() } returns true

        updater.updateManifest()

        verify { manifest.tablesExistAndPopulated() }
        verify { manifest.update(9) }
    }

    test("should not log call manifest update if tables don't exist") {
        every { manifest.update(9) } returns mockk<Map<String, String>>()
        every { manifest.tablesExistAndPopulated() } returns false

        updater.updateManifest()

        verify(exactly = 1) { manifest.tablesExistAndPopulated() }
        verify(exactly = 0) { manifest.update(9) }
    }
})
