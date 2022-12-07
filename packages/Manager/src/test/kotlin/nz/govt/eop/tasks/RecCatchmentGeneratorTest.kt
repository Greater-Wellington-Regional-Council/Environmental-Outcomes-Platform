package nz.govt.eop.tasks

import io.kotest.matchers.shouldBe
import java.util.stream.Stream
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.MethodSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.jdbc.Sql

@ActiveProfiles("test")
@SpringBootTest
@Sql("RecCatchmentGeneratorTest-data.sql")
class RecCatchmentGeneratorTest(@Autowired val underTest: RecCatchmentGenerator) {

  companion object {
    @JvmStatic
    fun buildTreeForSegment(): Stream<Arguments> {
      // Well known data from the test SQL file
      return Stream.of(
          Arguments.arguments(1, setOf<Int>(), setOf(1)),
          Arguments.arguments(5, setOf<Int>(), setOf(5)),
          Arguments.arguments(9, setOf<Int>(), setOf(9, 1, 2)),
          Arguments.arguments(11, setOf<Int>(), setOf(11, 10, 9, 1, 2)),
          Arguments.arguments(11, setOf(9), setOf(11, 10)),
          Arguments.arguments(11, setOf(10), setOf(11, 9, 1, 2)),
          Arguments.arguments(11, setOf(1), setOf(11, 10, 9, 2)),
      )
    }
  }

  @ParameterizedTest
  @MethodSource("buildTreeForSegment")
  fun `buildTreeForSegment should return expected tree`(
      initial: Int,
      excludes: Set<Int>,
      expected: Set<Int>
  ) {
    underTest.selectCatchmentTree(initial, excludes).shouldBe(expected)
  }

  @Test
  fun `creates a catchment`() {
    underTest.insertCatchmentFromWatersheds(1, 11, setOf(), setOf(11, 10, 9, 1, 2))
  }
}
