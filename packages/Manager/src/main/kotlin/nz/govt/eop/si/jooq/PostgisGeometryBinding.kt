package nz.govt.eop.si.jooq

import net.postgis.jdbc.PGgeometry
import net.postgis.jdbc.geometry.Geometry
import net.postgis.jdbc.geometry.GeometryBuilder
import org.jooq.*
import org.jooq.impl.DSL

class PostgisGeometryBinding : Binding<Any, Geometry> {

  override fun converter(): Converter<Any, Geometry> =
      object : Converter<Any, Geometry> {
        override fun from(obj: Any?): Geometry? =
            if (obj == null) {
              null
            } else GeometryBuilder.geomFromString(obj.toString())

        override fun to(geom: Geometry?): Any? =
            if (geom == null) {
              null
            } else PGgeometry(geom)

        override fun toType(): Class<Geometry> = Geometry::class.java

        override fun fromType(): Class<Any> = Any::class.java
      }

  override fun set(ctx: BindingSetStatementContext<Geometry>) {
    ctx.statement().setObject(ctx.index(), ctx.convert(converter()).value())
  }

  override fun get(ctx: BindingGetStatementContext<Geometry>) {
    ctx.convert(converter()).value(ctx.statement().getObject(ctx.index()))
  }

  override fun get(ctx: BindingGetResultSetContext<Geometry>) {
    ctx.convert(converter()).value(ctx.resultSet().getObject(ctx.index()))
  }

  override fun sql(ctx: BindingSQLContext<Geometry>) {
    ctx.render().visit(DSL.sql("?::geometry"))
  }

  override fun get(ctx: BindingGetSQLInputContext<Geometry>) = throw UnsupportedOperationException()

  override fun set(ctx: BindingSetSQLOutputContext<Geometry>) =
      throw UnsupportedOperationException()

  override fun register(ctx: BindingRegisterContext<Geometry>) =
      throw UnsupportedOperationException()
}
