package nz.govt.eop.tasks

import io.kotest.matchers.shouldBe
import java.util.stream.Stream
import org.jooq.DSLContext
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.MethodSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.jdbc.Sql

@ActiveProfiles("test")
@SpringBootTest
@Sql("RecQueriesTest-data.sql")
class RecQueriesTest(@Autowired val context: DSLContext) {

  companion object {
    @JvmStatic
    fun selectRecCatchmentTree(): Stream<Arguments> {
      // Well known data from the test SQL file
      return Stream.of(
          Arguments.arguments(setOf(1), setOf<Int>(), setOf(1)),
          Arguments.arguments(setOf(5), setOf<Int>(), setOf(5)),
          Arguments.arguments(setOf(9), setOf<Int>(), setOf(9, 1, 2)),
          Arguments.arguments(setOf(11), setOf<Int>(), setOf(11, 10, 9, 1, 2)),
          Arguments.arguments(setOf(11), setOf(9), setOf(11, 10)),
          Arguments.arguments(setOf(11), setOf(10), setOf(11, 9, 1, 2)),
          Arguments.arguments(setOf(11), setOf(1), setOf(11, 10, 9, 2)),
          Arguments.arguments(setOf(11, 5), setOf(1), setOf(11, 10, 9, 2, 5)),
      )
    }
  }

  @ParameterizedTest
  @MethodSource("selectRecCatchmentTree")
  fun `selectRecCatchmentTree should return expected tree`(
      initial: Collection<Int>,
      excludes: Collection<Int>,
      expected: Collection<Int>
  ) {
    selectRecCatchmentTree(context, initial, excludes).shouldBe(expected)
  }
}
