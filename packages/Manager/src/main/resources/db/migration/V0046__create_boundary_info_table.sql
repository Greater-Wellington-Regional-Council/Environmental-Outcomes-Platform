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
    created_at         timestamptz NOT NULL DEFAULT NOW(),
    updated_at         timestamptz NOT NULL DEFAULT NOW(),
    UNIQUE (council_id, source_id, context),
    FOREIGN KEY (council_id) REFERENCES councils(id)
);

INSERT INTO boundary_info (
    "council_id",
    "source_id",
    "context",
    "name",
    "description"
) VALUES (
    9,
    '5d258ee90fd8373c2f5a9691e9c0ed9b03fed6bc305b145fc0a3888ce0a40910',
    'cccv_catchments',
    'Parkvale Stream and Tributaries',
    '<p>The Parkvale catchment is located on the lowland plains of the Valley floor streams Freshwater Management Unit group (FMU) in the Ruamāhanga Whaitua. The area is known for its high leaching soils and complex hydrologyand waterways. These waterbodies include the spring fed and intermittently flowing Parkvale stream and the Taratahi water race, which are fed by the Waingawa River. The catchment contains a mix of dairy/dairy support, sheep and beef farming, and lifestyle blocks, and sits between Carterton and Masterton townships.</p><p>This is an area of intensive farming activity and productive soils. The soils tend to be very thin, meaning ground and closely connected surface water are at risk of becoming polluted with highly soluble contaminants such as nitrates. The Parkvale is impacted by high nutrient levels, lowish flows and a lack of shading, meaning that periphyton can be a considerable problem.</p><p>Parkvale Stream is identified in Schedule H2 of the PNRP as a second priority water body for improvements for secondary contact recreation.</p>'
);

CREATE INDEX boundary_info_council_source_context on boundary_info(council_id, source_id, context);
CREATE INDEX boundary_info_context_name on boundary_info(context, name);

CREATE INDEX cpb_boundary ON council_plan_boundaries USING gist(boundary);
CREATE INDEX fmu_geom ON freshwater_management_units USING gist(geom);

ANALYZE boundary_info;