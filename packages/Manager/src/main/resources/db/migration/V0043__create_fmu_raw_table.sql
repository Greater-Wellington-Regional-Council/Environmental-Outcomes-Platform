SET CLIENT_ENCODING TO UTF8;

SET STANDARD_CONFORMING_STRINGS TO ON;

CREATE TABLE farm_management_units_raw
(
    gid          NUMERIC,
    "objectid"   FLOAT8,
    "fmu_no"     INT4,
    "location"   VARCHAR,
    "fmu_name1"  VARCHAR,
    "fmu_group"  VARCHAR,
    "shape_leng" NUMERIC,
    "shape_area" NUMERIC,
    "by_when"    VARCHAR,
    "fmu_issue"  VARCHAR,
    "top_fmugrp" VARCHAR,
    "ecoli_base" VARCHAR,
    "peri_base"  VARCHAR,
    "peri_obj"   VARCHAR,
    "a_tox_base" VARCHAR,
    "a_tox_obj"  VARCHAR,
    "n_tox_base" VARCHAR,
    "n_tox_obj"  VARCHAR,
    "phyto_base" VARCHAR,
    "phyto_obj"  VARCHAR,
    "tn_base"    VARCHAR,
    "tn_obj"     VARCHAR,
    "tp_base"    VARCHAR,
    "tp_obj"     VARCHAR,
    "tli_base"   VARCHAR,
    "tli_obj"    VARCHAR,
    "tss_base"   VARCHAR,
    "tss_obj"    VARCHAR,
    "macro_base" VARCHAR,
    "macro_obj"  VARCHAR,
    "mci_base"   VARCHAR,
    "mci_obj"    VARCHAR,
    "ecoli_obj"  VARCHAR,
    "geom"       GEOMETRY
);

CREATE INDEX ON farm_management_units_raw ("gid");

CREATE INDEX ON farm_management_units_raw USING GIST ("geom");

ANALYZE farm_management_units_raw;