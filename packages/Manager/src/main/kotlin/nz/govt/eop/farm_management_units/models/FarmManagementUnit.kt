package nz.govt.eop.farm_management_units.models

import net.postgis.jdbc.geometry.Geometry
import nz.govt.eop.si.jooq.PostgisGeometryBinding
import nz.govt.eop.si.jooq.tables.records.CouncilsRecord
import org.jooq.TableField
import org.jooq.impl.DSL
import org.jooq.impl.SQLDataType
import org.jooq.impl.TableImpl


const val DEFAULT_SRID = 2193

data class FarmManagementUnit(
  val id: Int = 0,
  val gid: Int,
  val objectId: Double,
  val fmuNo: Int,
  val location: String,
  val fmuName1: String,
  val fmuGroup: String,
  val shapeLeng: Double,
  val shapeArea: Double,
  val byWhen: String,
  val fmuIssue: String,
  val topFmuGrp: String,
  val ecoliBase: String,
  val periBase: String,
  val periObj: String,
  val aToxBase: String,
  val aToxObj: String,
  val nToxBase: String,
  val nToxObj: String,
  val phytoBase: String,
  val phytoObj: String,
  val tnBase: String,
  val tnObj: String,
  val tpBase: String,
  val tpObj: String,
  val tliBase: String,
  val tliObj: String,
  val tssBase: String,
  val tssObj: String,
  val macroBase: String,
  val macroObj: String,
  val mciBase: String,
  val mciObj: String,
  val ecoliObj: String,
  val geom: Any
)