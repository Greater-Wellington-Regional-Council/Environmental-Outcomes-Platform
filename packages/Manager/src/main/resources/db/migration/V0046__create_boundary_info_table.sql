SET CLIENT_ENCODING TO UTF8;

SET STANDARD_CONFORMING_STRINGS TO ON;

CREATE SEQUENCE boundary_info_id_seq;

CREATE TABLE boundary_info
(
    id INTEGER PRIMARY KEY DEFAULT nextval('boundary_info_id_seq'),
    council_id         INTEGER     NOT NULL,
    source_id          VARCHAR     NOT NULL,
    context            VARCHAR     NOT NULL,
    name               VARCHAR,
    description        TEXT,
    boundary           GEOMETRY,
    created_at         timestamptz NOT NULL DEFAULT NOW(),
    updated_at         timestamptz NOT NULL DEFAULT NOW(),
    UNIQUE (council_id, source_id, context),
    FOREIGN KEY (council_id) REFERENCES councils(id)
);

CREATE INDEX boundary_info_council_source_context on boundary_info(council_id, source_id, context);
CREATE INDEX boundary_info_context_name on boundary_info(context, name);
CREATE INDEX ON boundary_info USING GIST ("boundary");

CREATE INDEX cpb_boundary ON council_plan_boundaries USING gist(boundary);
CREATE INDEX fmu_geom ON freshwater_management_units USING gist(geom);

ANALYZE boundary_info;