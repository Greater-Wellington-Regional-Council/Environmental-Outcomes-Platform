SET CLIENT_ENCODING TO UTF8;

SET STANDARD_CONFORMING_STRINGS TO ON;

CREATE SEQUENCE freshwater_management_units_id_seq;

CREATE TABLE freshwater_management_units
(
    id INTEGER PRIMARY KEY DEFAULT nextval('freshwater_management_units_id_seq'),
    LIKE freshwater_management_units_raw INCLUDING ALL

);

INSERT INTO freshwater_management_units (
    gid,
    "objectid",
    "fmu_no",
    "location",
    "fmu_name1",
    "fmu_group",
    "shape_leng",
    "shape_area",
    "by_when",
    "fmu_issue",
    "top_fmugrp",
    "ecoli_base",
    "peri_base",
    "peri_obj",
    "a_tox_base",
    "a_tox_obj",
    "n_tox_base",
    "n_tox_obj",
    "phyto_base",
    "phyto_obj",
    "tn_base",
    "tn_obj",
    "tp_base",
    "tp_obj",
    "tli_base",
    "tli_obj",
    "tss_base",
    "tss_obj",
    "macro_base",
    "macro_obj",
    "mci_base",
    "mci_obj",
    "ecoli_obj",
    "geom"
)
SELECT * FROM freshwater_management_units_raw;

CREATE INDEX ON freshwater_management_units USING GIST ("geom");

ANALYZE freshwater_management_units;