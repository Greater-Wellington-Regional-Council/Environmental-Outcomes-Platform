SET CLIENT_ENCODING TO UTF8;

SET STANDARD_CONFORMING_STRINGS TO ON;

BEGIN;

CREATE TABLE farm_management_units (gid serial,
                                            "objectid" float8,
                                            "fmu_no" int4,
                                            "location" varchar(10),
                                            "fmu_name1" varchar(70),
                                            "fmu_group" varchar(50),
                                            "shape_leng" numeric,
                                            "shape_area" numeric,
                                            "by_when" varchar(254),
                                            "fmu_issue" varchar(100),
                                            "top_fmugrp" varchar(100),
                                            "ecoli_base" varchar(50),
                                            "peri_base" varchar(50),
                                            "peri_obj" varchar(50),
                                            "a_tox_base" varchar(50),
                                            "a_tox_obj" varchar(50),
                                            "n_tox_base" varchar(50),
                                            "n_tox_obj" varchar(50),
                                            "phyto_base" varchar(50),
                                            "phyto_obj" varchar(50),
                                            "tn_base" varchar(50),
                                            "tn_obj" varchar(50),
                                            "tp_base" varchar(50),
                                            "tp_obj" varchar(50),
                                            "tli_base" varchar(50),
                                            "tli_obj" varchar(50),
                                            "tss_base" varchar(50),
                                            "tss_obj" varchar(50),
                                            "macro_base" varchar(50),
                                            "macro_obj" varchar(50),
                                            "mci_base" varchar(50),
                                            "mci_obj" varchar(50),
                                            "ecoli_obj" varchar(50));

ALTER TABLE farm_management_units ADD PRIMARY KEY (gid);

SELECT AddGeometryColumn('public', 'farm_management_units','geom','2193','MULTIPOLYGON',2);

CREATE INDEX ON farm_management_units USING GIST ("geom");

COMMIT;

ANALYZE farm_management_units;
