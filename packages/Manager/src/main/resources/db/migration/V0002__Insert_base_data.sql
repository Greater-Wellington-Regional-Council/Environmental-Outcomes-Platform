INSERT INTO
  public.sites (siteid_hilltop, "name", geom)
VALUES
  (
    434,
    'Hutt River at Birchville',
    ST_GeomFromText ('POINT(175.09076014 -41.10017595)', 4326)
  ),
  (
    454,
    'Hutt River at Kaitoke',
    ST_GeomFromText ('POINT(175.19123118 -41.05101129)', 4326)
  ),
  (
    597,
    'Kopuaranga at Palmers Bridge',
    ST_GeomFromText ('POINT(175.67185573 -40.81893375)', 4326)
  ),
  (
    706,
    'Mangaone Stream at Ratanui',
    ST_GeomFromText ('POINT(175.15669569 -40.82742334)', 4326)
  ),
  (
    758,
    'Mangatarere River at Gorge',
    ST_GeomFromText ('POINT(175.51186713 -40.93499383)', 4326)
  ),
  (
    978,
    'Orongorongo River at Truss Bridge',
    ST_GeomFromText ('POINT(175.0326634 -41.29704076)', 4326)
  ),
  (
    1012,
    'Otaki River at Pukehinau',
    ST_GeomFromText ('POINT(175.19957526 -40.8220466)', 4326)
  ),
  (
    1045,
    'Otukura Stream at Weir',
    ST_GeomFromText ('POINT(175.36738907 -41.18728715)', 4326)
  ),
  (
    1093,
    'Papawai Stream at Fabians Road',
    ST_GeomFromText ('POINT(175.47431592 -41.09518572)', 4326)
  ),
  (
    1136,
    'Parkvale Stream at Renalls Weir',
    ST_GeomFromText ('POINT(175.54166084 -41.07801993)', 4326)
  ),
  (
    1518,
    'Ruamahanga River at Waihenga Bridge',
    ST_GeomFromText ('POINT(175.43999678 -41.19685836)', 4326)
  ),
  (
    1521,
    'Ruamahanga River at Wardells',
    ST_GeomFromText ('POINT(175.67236373 -41.00481677)', 4326)
  ),
  (
    2368,
    'Tauherenikau at Gorge',
    ST_GeomFromText ('POINT(175.35741926 -41.06814004)', 4326)
  ),
  (
    2528,
    'Waikanae River at Water Treatment Plant',
    ST_GeomFromText ('POINT(175.07274447 -40.88809773)', 4326)
  ),
  (
    2559,
    'Waingawa River at Kaituna',
    ST_GeomFromText ('POINT(175.5229277 -40.88669021)', 4326)
  ),
  (
    2588,
    'Wainuiomata River at Leonard Wood Park',
    ST_GeomFromText ('POINT(174.94738309 -41.28400515)', 4326)
  ),
  (
    2589,
    'Wainuiomata River at Manuka Track',
    ST_GeomFromText ('POINT(175.00892684 -41.25677265)', 4326)
  ),
  (
    2609,
    'Waiohine River at Gorge',
    ST_GeomFromText ('POINT(175.40011859 -41.01636817)', 4326)
  ),
  (
    2634,
    'Waipoua River at Mikimiki Bridge',
    ST_GeomFromText ('POINT(175.61744894 -40.84517651)', 4326)
  ),
  (
    2666,
    'Waitohu Stream at Water Supply Intake',
    ST_GeomFromText ('POINT(175.21423898 -40.76666669)', 4326)
  );

INSERT INTO
  PUBLIC.minimum_flow_limits (
    plan_description,
    plan_management_point_name,
    plan_minimum_flow_value,
    plan_minimum_flow_unit,
    siteid_hilltop,
    plan_table_reference,
    plan_version,
    nzsegment
  )
VALUES
  (
    'Upstream of Belvedere road bridge',
    'Mangatarere River at Gorge',
    240,
    'L/s',
    758,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Between the confluence with the Waiohine River and the Belvedere Road bridge',
    'Mangatarere River at Gorge',
    200,
    'L/s',
    758,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Kopuaranga River upstream of the confluence with the Ruamāhanga River',
    'Palmers',
    270,
    'L/s',
    597,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Waipoua River upstream of the confluence with the Ruamāhanga River',
    'Mikimiki Bridge',
    250,
    'L/s',
    2634,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Waingawa River upstream of the confluence with the Ruamāhanga River',
    'Kaituna',
    1100,
    'L/s',
    2559,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Parkvale Stream upstream of the confluence with the Ruamāhanga River',
    'Renalls Weir recorder',
    100,
    'L/s',
    1136,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Waiohine River upstream of the confluence with the Ruamāhanga River',
    'Gorge recorder',
    2300,
    'L/s',
    2609,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Papawai Stream upstream of the confluence with the Ruamāhanga River',
    'Fabians Road recorder',
    180,
    'L/s',
    1093,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Upper and Middle Ruamāhanga River upstream of the confluence with the Waiohine River',
    'Wardells',
    2400,
    'L/s',
    1521,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Otukura Stream upstream of the confluence with Dock/Stonestead Creek',
    'Weir recorder',
    95,
    'L/s',
    1045,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Tauherenikau River upstream of Lake Wairarapa',
    'Gorge recorder',
    1100,
    'L/s',
    2368,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Lower Ruamāhanga River between the boundary with the coastal marine area and the Waiohine River confluence',
    'Waihenga recorder',
    8500,
    'L/s',
    1518,
    7.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Te Awa Kairangi/Hutt River Upstream of the confluence with the Pakuratahi River',
    'Kaitoke water supply intake',
    600,
    'L/s',
    454,
    8.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Te Awa Kairangi/Hutt River Downstream of the confluence with the Pakuratahi River',
    'Birchville recorder',
    1200,
    'L/s',
    434,
    8.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Wainuiomata River Between Manuka Track and the confluence with Georges Creek',
    'Manuka recorder',
    100,
    'L/s',
    2589,
    8.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Wainuiomata River Between Georges Creek and the boundary of the coastal marine area',
    'Leonard Wood Park recorder',
    300,
    'L/s',
    2588,
    8.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Orongorongo River upstream of the boundary with the coastal marine area',
    'Truss Bridge recorder',
    100,
    'L/s',
    978,
    8.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Waitohu Stream upstream of the coastal marine area boundary',
    'KCDC Water Supply Intake recorder',
    140,
    'L/s',
    2666,
    10.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Ōtaki River upstream of the coastal marine area boundary',
    'Pukehinau recorder',
    2550,
    'L/s',
    1012,
    10.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Mangaone Stream upstream of the coastal marine area boundary',
    'Ratanui recorder',
    22,
    'L/s',
    706,
    10.1,
    'final appeals version 2022',
    NULL
  ),
  (
    'Waikanae River upstream of the coastal marine area boundary',
    'WTP recorder',
    750,
    'L/s',
    2528,
    10.1,
    'final appeals version 2022',
    NULL
  );

INSERT INTO
  Public.allocation_amounts (
    area_description,
    category,
    allocation_amount,
    allocation_amount_unit,
    consented_allocation_greater_than_allocation_amount,
    catchment_management_unit,
    groundwater_zone,
    plan_version,
    plan_table
  )
VALUES
  (
    'Te Ore Ore Category B groundwater',
    'Category B groundwater',
    480000,
    'm 3 /year',
    'Yes',
    'Upper Ruamāhanga',
    'Te Ore Ore Category B groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Waingawa Category B groundwater and Waingawa Category C groundwater',
    'Category B groundwater',
    1900000,
    'm 3 /year',
    NULL,
    'Upper Ruamāhanga',
    'Waingawa Category B groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Waingawa Category B groundwater and Waingawa Category C groundwater',
    'Category C groundwater',
    1900000,
    'm 3 /year',
    NULL,
    'Upper Ruamāhanga',
    'Waingawa Category C groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Ruamāhanga Category B groundwater and Ruamāhanga Category C groundwater',
    'Category B groundwater',
    3550000,
    'm 3 /year',
    NULL,
    'Upper Ruamāhanga',
    'Ruamāhanga Category B groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Ruamāhanga Category B groundwater and Ruamāhanga Category C groundwater',
    'Category C groundwater',
    3550000,
    'm 3 /year',
    NULL,
    'Upper Ruamāhanga',
    'Ruamāhanga Category C groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Fernhill-Tiffen Category C groundwater',
    'Category C groundwater',
    1200000,
    'm 3 /year',
    NULL,
    'Middle Ruamāhanga',
    'Fernhill-Tiffen Category C groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Taratahi Category B groundwater and Taratahi Category C groundwater',
    'Category B groundwater',
    1400000,
    'm 3 /year',
    NULL,
    'Middle Ruamāhanga',
    'Taratahi Category B groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Taratahi Category B groundwater and Taratahi Category C groundwater',
    'Category C groundwater',
    1400000,
    'm 3 /year',
    NULL,
    'Middle Ruamāhanga',
    'Taratahi Category C groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Parkvale Category B groundwater and Parkvale Category C groundwater (confined)',
    'Category B groundwater (confined)',
    350000,
    'm 3 /year',
    'Yes',
    'Middle Ruamāhanga',
    'Parkvale Category B groundwater (confined)',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Parkvale Category B groundwater and Parkvale Category C groundwater (confined)',
    'Category C groundwater (confined)',
    350000,
    'm 3 /year',
    'Yes',
    'Middle Ruamāhanga',
    'Parkvale Category C groundwater (confined)',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Parkvale Category B groundwater and Parkvale Category C groundwater (unconfined)',
    'Category B groundwater (unconfined)',
    1550000,
    'm 3 /year',
    'Yes',
    'Middle Ruamāhanga',
    'Parkvale Category B groundwater (unconfined)',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Parkvale Category B groundwater and Parkvale Category C groundwater (unconfined)',
    'Category C groundwater (unconfined)',
    1550000,
    'm 3 /year',
    'Yes',
    'Middle Ruamāhanga',
    'Parkvale Category C groundwater (unconfined)',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Mangatarere Category B groundwater and Mangatarere Category C groundwater',
    'Category B groundwater',
    2300000,
    'm 3 /year',
    'Yes',
    'Middle Ruamāhanga',
    'Mangatarere Category B groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Mangatarere Category B groundwater and Mangatarere Category C groundwater',
    'Category C groundwater',
    2300000,
    'm 3 /year',
    'Yes',
    'Middle Ruamāhanga',
    'Mangatarere Category C groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Tauherenikau Category B groundwater',
    'Category B groundwater',
    6600000,
    'm 3 /year',
    'Yes',
    'Lower Ruamāhanga',
    'Tauherenikau Category B groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Lower Ruamāhanga Category B groundwater',
    'Category B groundwater',
    3300000,
    'm 3 /year',
    NULL,
    'Lower Ruamāhanga',
    'Lower Ruamāhanga Category B groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Lake Category B groundwater and Lake Category C groundwater',
    'Category B groundwater',
    6750000,
    'm 3 /year',
    'Yes',
    'Lower Ruamāhanga',
    'Lake Category B groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Lake Category B groundwater and Lake Category C groundwater',
    'Category C groundwater',
    6750000,
    'm 3 /year',
    'Yes',
    'Lower Ruamāhanga',
    'Lake Category C groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Huangarua Category B groundwater',
    'Category B groundwater',
    650000,
    'm 3 /year',
    'Yes',
    'Lower Ruamāhanga',
    'Huangarua Category B groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Martinborough Category C groundwater',
    'Category C groundwater',
    800000,
    'm 3 /year',
    NULL,
    'Lower Ruamāhanga',
    'Martinborough Category C groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Dry River Category B groundwater',
    'Category B groundwater',
    650000,
    'm 3 /year',
    NULL,
    'Lower Ruamāhanga',
    'Dry River Category B groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Onoke Category C groundwater',
    'Category C groundwater',
    2100000,
    'm 3 /year',
    NULL,
    'Lower Ruamāhanga',
    'Onoke Category C groundwater',
    'final appeals version 2022',
    '7.5'
  ),
  (
    'Ruamāhanga River and tributaries, upstream of (but not including) the confluence with the Lake Wairarapa outflow, and all Category A groundwater and Category B groundwater (stream depletion) identified in the catchment management sub-units below in Table 7.3',
    'Surface Water',
    7430,
    'L/s',
    NULL,
    'Ruamāhanga River catchment above the Lake Wairarapa outflow',
    'Ruamāhanga River and tributaries, upstream of (but not including) the confluence with the Lake Wairarapa outflow',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Ruamāhanga River and tributaries, upstream of (but not including) the confluence with the Lake Wairarapa outflow, and all Category A groundwater and Category B groundwater (stream depletion) identified in the catchment management sub-units below in Table 7.3',
    'Category A groundwater',
    7430,
    'L/s',
    NULL,
    'Ruamāhanga River catchment above the Lake Wairarapa outflow',
    'All Category A groundwater identified in the catchment management sub-units in Table 7.3',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Ruamāhanga River and tributaries, upstream of (but not including) the confluence with the Lake Wairarapa outflow, and all Category A groundwater and Category B groundwater (stream depletion) identified in the catchment management sub-units below in Table 7.3',
    'Category B groundwater (stream depletion)',
    7430,
    'L/s',
    NULL,
    'Ruamāhanga River catchment above the Lake Wairarapa outflow',
    'All Category B groundwater (stream depletion) identified in the catchment management sub-units in Table 7.3',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Kopuaranga River and tributaries, Category A groundwater and Upper Ruamāhanga Category B groundwater(stream depletion)',
    'Surface Water',
    180,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Kopuaranga River and tributaries',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Kopuaranga River and tributaries, Category A groundwater and Upper Ruamāhanga Category B groundwater(stream depletion)',
    'Category A groundwater',
    180,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Kopuaranga River Category A groundwater',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Kopuaranga River and tributaries, Category A groundwater and Upper Ruamāhanga Category B groundwater(stream depletion)',
    'Category B groundwater (stream depletion)',
    180,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Upper Ruamāhanga Category B groundwater(stream depletion)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Waipoua River and tributaries, Category A groundwater and Upper Ruamāhanga or Waingawa Category B groundwater (stream depletion)',
    'Surface Water',
    145,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Waipoua River and tributaries',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Waipoua River and tributaries, Category A groundwater and Upper Ruamāhanga or Waingawa Category B groundwater (stream depletion)',
    'Category A groundwater',
    145,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Waipoua River Category A groundwater',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Waipoua River and tributaries, Category A groundwater and Upper Ruamāhanga or Waingawa Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    145,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Upper Ruamāhanga or Waingawa Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Waingawa River and tributaries, Waingawa Category A groundwater) and Taratahi or Waingawa Category B groundwater (stream depletion)',
    'Surface Water',
    920,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Waingawa River and tributaries',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Waingawa River and tributaries, Waingawa Category A groundwater) and Taratahi or Waingawa Category B groundwater (stream depletion)',
    'Category A groundwater',
    920,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Waingawa Category A groundwater',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Waingawa River and tributaries, Waingawa Category A groundwater) and Taratahi or Waingawa Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    920,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Taratahi or Waingawa Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Ruamāhanga River and tributaries upstream of the confluence with the Waingawa River, Upper Ruamāhanga Category A groundwater and Waingawa, Te Ore Ore or Upper Ruamāhanga Category B groundwater (stream depletion), excluding all the above catchment management subunits in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Surface Water',
    1200,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Ruamāhanga River and tributaries upstream of the confluence with the Waingawa River',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Ruamāhanga River and tributaries upstream of the confluence with the Waingawa River, Upper Ruamāhanga Category A groundwater and Waingawa, Te Ore Ore or Upper Ruamāhanga Category B groundwater (stream depletion), excluding all the above catchment management subunits in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Category A groundwater',
    1200,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Upper Ruamāhanga Category A groundwater',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Ruamāhanga River and tributaries upstream of the confluence with the Waingawa River, Upper Ruamāhanga Category A groundwater and Waingawa, Te Ore Ore or Upper Ruamāhanga Category B groundwater (stream depletion), excluding all the above catchment management subunits in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Category B groundwater (stream depletion)',
    1200,
    'L/s',
    NULL,
    'Upper Ruamāhanga',
    'Waingawa, Te Ore Ore or Upper Ruamāhanga Category B groundwater (stream depletion), excluding all the above catchment management subunits in the Ruamāhanga catchment (above this row in Table 7.3)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Parkvale Stream and tributaries, and Taratahi or Parkvale Category B groundwater (stream depletion)',
    'Surface Water',
    40,
    'L/s',
    'Yes',
    'Middle Ruamāhanga',
    'Parkvale Stream and tributaries',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Parkvale Stream and tributaries, and Taratahi or Parkvale Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    40,
    'L/s',
    'Yes',
    'Middle Ruamāhanga',
    'Taratahi or Parkvale Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Booths Creek and tributaries and Parkvale, Mangatarere or Taratahi Category B groundwater (stream depletion)',
    'Surface Water',
    25,
    'L/s',
    'Yes',
    'Middle Ruamāhanga',
    'Booths Creek and tributaries and Parkvale',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Booths Creek and tributaries and Parkvale, Mangatarere or Taratahi Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    25,
    'L/s',
    'Yes',
    'Middle Ruamāhanga',
    'Mangatarere or Taratahi Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Mangatarere Stream and tributaries, Mangatarere Category A groundwater and Mangatarere Category B groundwater (stream depletion)',
    'Surface Water',
    110,
    'L/s',
    NULL,
    'Middle Ruamāhanga',
    'Mangatarere Stream and tibutaries',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Mangatarere Stream and tributaries, Mangatarere Category A groundwater and Mangatarere Category B groundwater (stream depletion)',
    'Category A groundwater',
    110,
    'L/s',
    NULL,
    'Middle Ruamāhanga',
    'Mangatarere Category A groundwater',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Mangatarere Stream and tributaries, Mangatarere Category A groundwater and Mangatarere Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    110,
    'L/s',
    NULL,
    'Middle Ruamāhanga',
    'Managatere Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Waiohine River and tributaries (excluding Mangatarere Stream and tributaries) Waiohine Category A groundwater) and Mangatarere Category B groundwater (stream depletion)',
    'Surface Water',
    1590,
    'L/s',
    NULL,
    'Middle Ruamāhanga',
    'Waiohine River and tributaries (excluding Mangatarere Stream and tributaries)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Waiohine River and tributaries (excluding Mangatarere Stream and tributaries) Waiohine Category A groundwater) and Mangatarere Category B groundwater (stream depletion)',
    'Category A groundwater',
    1590,
    'L/s',
    NULL,
    'Middle Ruamāhanga',
    'Waiohine Category A groundwater',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Waiohine River and tributaries (excluding Mangatarere Stream and tributaries) Waiohine Category A groundwater) and Mangatarere Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    1590,
    'L/s',
    NULL,
    'Middle Ruamāhanga',
    'Mangatarere Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Papawai Stream and tributaries and Waiohine Category A groundwater',
    'Surface Water',
    105,
    'L/s',
    'Yes',
    'Middle Ruamāhanga',
    'Papawai Stream and tributaries',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Papawai Stream and tributaries and Waiohine Category A groundwater',
    'Category A groundwater',
    105,
    'L/s',
    'Yes',
    'Middle Ruamāhanga',
    'Waiohine Category A groundwater',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Ruamāhanga River and tributaries upstream of the confluence with the Papawai Stream, and Middle Ruamāhanga Category A groundwater excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Surface Water',
    1240,
    'L/s',
    NULL,
    'Middle Ruamāhanga',
    'Ruamāhanga River and tributaries upstream of the confluence with the Papawai Stream',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Ruamāhanga River and tributaries upstream of the confluence with the Papawai Stream, and Middle Ruamāhanga Category A groundwater excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Category A groundwater',
    1240,
    'L/s',
    NULL,
    'Middle Ruamāhanga',
    'Middle Ruamāhanga Category A groundwater excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Huangarua River and tributaries and Huangarua Category A groundwater and Huangarua Category B groundwater (stream depletion)',
    'Surface Water',
    110,
    'L/s',
    NULL,
    'Lower Ruamāhanga',
    'Huangarua River and tributaries',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Huangarua River and tributaries and Huangarua Category A groundwater and Huangarua Category B groundwater (stream depletion)',
    'Category A groundwater',
    110,
    'L/s',
    NULL,
    'Lower Ruamāhanga',
    'Huangarua Category A groundwater',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Huangarua River and tributaries and Huangarua Category A groundwater and Huangarua Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    110,
    'L/s',
    NULL,
    'Lower Ruamāhanga',
    'Huangarua Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Lower Ruamāhanga River and tributaries upstream of (but not including) the confluence with the Lake Wairarapa outflow, and Lower Ruamāhanga Category A groundwater and Lake Category B groundwater (stream depletion) excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Surface Water',
    1370,
    'L/s',
    NULL,
    'Lower Ruamāhanga',
    'Lower Ruamāhanga River and tributaries upstream of (but not including) the confluence with the Lake Wairarapa outflow',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Lower Ruamāhanga River and tributaries upstream of (but not including) the confluence with the Lake Wairarapa outflow, and Lower Ruamāhanga Category A groundwater and Lake Category B groundwater (stream depletion) excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Category A groundwater',
    1370,
    'L/s',
    NULL,
    'Lower Ruamāhanga',
    'Lower Ruamāhanga Category A groundwater',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Lower Ruamāhanga River and tributaries upstream of (but not including) the confluence with the Lake Wairarapa outflow, and Lower Ruamāhanga Category A groundwater and Lake Category B groundwater (stream depletion) excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Category B groundwater (stream depletion)',
    1370,
    'L/s',
    NULL,
    'Lower Ruamāhanga',
    'Lake Category B groundwater (stream depletion) excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'final appeals version 2022',
    '7.3'
  ),
  (
    'Lake Wairarapa and tributaries above the confluence of the Lake Wairarapa outflow with the Ruamāhanga River, and Tauherenikau Category A groundwater and Lake or Tauherenikau Category B groundwater (stream depletion)',
    'Surface Water',
    1800,
    'L/s',
    NULL,
    'Lake Wairarapa',
    'Lake Wairarapa and tributaries above the confluence of the Lake Wairarapa outflow with the Ruamāhanga River',
    'final appeals version 2022',
    '7.4'
  ),
  (
    'Lake Wairarapa and tributaries above the confluence of the Lake Wairarapa outflow with the Ruamāhanga River, and Tauherenikau Category A groundwater and Lake or Tauherenikau Category B groundwater (stream depletion)',
    'Category A groundwater',
    1800,
    'L/s',
    NULL,
    'Lake Wairarapa',
    'Tauherenikau Category A groundwater',
    'final appeals version 2022',
    '7.4'
  ),
  (
    'Lake Wairarapa and tributaries above the confluence of the Lake Wairarapa outflow with the Ruamāhanga River, and Tauherenikau Category A groundwater and Lake or Tauherenikau Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    1800,
    'L/s',
    NULL,
    'Lake Wairarapa',
    'Lake or Tauherenikau Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '7.4'
  ),
  (
    'Otukura Stream and tributaries above (but not including) the confluence with Dock/Stonestead Creek and Tauherenikau Category B groundwater (stream depletion)',
    'Surface Water',
    30,
    'L/s',
    'Yes',
    'Lake Wairarapa',
    'Otukura Stream and tributaries above (but not including) the confluence with Dock/Stonestead Creek',
    'final appeals version 2022',
    '7.4'
  ),
  (
    'Otukura Stream and tributaries above (but not including) the confluence with Dock/Stonestead Creek and Tauherenikau Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    30,
    'L/s',
    'Yes',
    'Lake Wairarapa',
    'Tauherenikau Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '7.4'
  ),
  (
    'Tauherenikau River and tributaries, and Tauherenikau Category A groundwater and Tauherenikau Category B groundwater (stream depletion)',
    'Surface Water',
    410,
    'L/s',
    NULL,
    'Lake Wairarapa',
    'Tauherenikau River and tributaries',
    'final appeals version 2022',
    '7.4'
  ),
  (
    'Tauherenikau River and tributaries, and Tauherenikau Category A groundwater and Tauherenikau Category B groundwater (stream depletion)',
    'Category A groundwater',
    410,
    'L/s',
    NULL,
    'Lake Wairarapa',
    'Tauherenikau Category A groundwater',
    'final appeals version 2022',
    '7.4'
  ),
  (
    'Tauherenikau River and tributaries, and Tauherenikau Category A groundwater and Tauherenikau Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    410,
    'L/s',
    NULL,
    'Lake Wairarapa',
    'Tauherenikau Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '7.4'
  ),
  (
    'Te Awa Kairangi/Hutt River and tributaries, Upper Hutt or Lower Hutt Category A groundwater and Upper or Lower Hutt Category B groundwater (stream depletion) in the catchment management units shown in Figures 8.1 and 8.2',
    'Surface Water',
    2140,
    'L/s',
    NULL,
    'Te Awa Kairangi/Hutt River',
    'Te Awa Kairangi/Hutt River and tributaries',
    'final appeals version 2022',
    '8.2'
  ),
  (
    'Te Awa Kairangi/Hutt River and tributaries, Upper Hutt or Lower Hutt Category A groundwater and Upper or Lower Hutt Category B groundwater (stream depletion) in the catchment management units shown in Figures 8.1 and 8.2',
    'Category A groundwater',
    2140,
    'L/s',
    NULL,
    'Te Awa Kairangi/Hutt River',
    'Upper Hutt or Lower Hutt Category A groundwater',
    'final appeals version 2022',
    '8.2'
  ),
  (
    'Te Awa Kairangi/Hutt River and tributaries, Upper Hutt or Lower Hutt Category A groundwater and Upper or Lower Hutt Category B groundwater (stream depletion) in the catchment management units shown in Figures 8.1 and 8.2',
    'Category B groundwater (stream depletion)',
    2140,
    'L/s',
    NULL,
    'Te Awa Kairangi/Hutt River',
    'Upper or Lower Hutt Category B groundwater (stream depletion) in the catchment management units shown in Figures 8.1 and 8.2',
    'final appeals version 2022',
    '8.2'
  ),
  (
    'Wainuiomata River and tributaries',
    'Surface Water',
    180,
    'L/s',
    NULL,
    'Wainuiomata River',
    'Wainuiomata River and tributaries',
    'final appeals version 2022',
    '8.2'
  ),
  (
    'Orongorongo River and tributaries',
    'Surface Water',
    95,
    'L/s',
    NULL,
    'Orongorongo River',
    'Orongorongo River and tributaries',
    'final appeals version 2022',
    '8.2'
  ),
  (
    'Upper Hutt Category B groundwater and Upper Hutt Category C groundwater',
    'Category B groundwater',
    770000,
    'm 3 /year',
    NULL,
    'Wellington Harbour and Hutt Valley Whaitua',
    'Upper Hutt Category B groundwater',
    'final appeals version 2022',
    '8.3'
  ),
  (
    'Upper Hutt Category B groundwater and Upper Hutt Category C groundwater',
    'Category C groundwater',
    770000,
    'm 3 /year',
    NULL,
    'Wellington Harbour and Hutt Valley Whaitua',
    'Upper Hutt Category C groundwater',
    'final appeals version 2022',
    '8.3'
  ),
  (
    'Lower Hutt Category B groundwater',
    'Category B groundwater',
    36500000,
    'm 3 /year',
    NULL,
    'Wellington Harbour and Hutt Valley Whaitua',
    'Lower Hutt Category B groundwater',
    'final appeals version 2022',
    '8.3'
  ),
  (
    'Waitohu Stream and tributaries, Waitohu Category A groundwater and Ōtaki Category B groundwater (stream depletion)',
    'Surface Water',
    45,
    'L/s',
    NULL,
    'Waitohu Stream and tributaries',
    'Waitohu Stream and tributaries',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Waitohu Stream and tributaries, Waitohu Category A groundwater and Ōtaki Category B groundwater (stream depletion)',
    'Category A groundwater',
    45,
    'L/s',
    NULL,
    'Waitohu Category A groundwater',
    'Waitohu Category A groundwater',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Waitohu Stream and tributaries, Waitohu Category A groundwater and Ōtaki Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    45,
    'L/s',
    NULL,
    'Ōtaki Category B groundwater (stream depletion)',
    'Ōtaki Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Surface Water',
    590,
    'L/s',
    NULL,
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Ōtaki River and tributaries',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Category A groundwater',
    590,
    'L/s',
    NULL,
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Ōtaki Category A groundwater',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    590,
    'L/s',
    NULL,
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Mangaone Stream and tributaries, Te Horo Category B groundwater (stream depletion)',
    'Surface Water',
    24,
    'L/s',
    NULL,
    'Mangaone Stream and tributaries',
    'Mangaone Stream and tributaries',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Mangaone Stream and tributaries, Te Horo Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    24,
    'L/s',
    NULL,
    'Te Horo Category B groundwater (stream depletion)',
    'Te Horo Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Waikanae River and tributaries, Waikanae Category A groundwater and Waikanae Category B groundwater (stream depletion)',
    'Surface Water',
    220,
    'L/s',
    NULL,
    'Waikanae River and tributaries',
    'Waikanae River and tributaries',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Waikanae River and tributaries, Waikanae Category A groundwater and Waikanae Category B groundwater (stream depletion)',
    'Category A groundwater',
    220,
    'L/s',
    NULL,
    'Waikanae Category A groundwater',
    'Waikanae Category A groundwater',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Waikanae River and tributaries, Waikanae Category A groundwater and Waikanae Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    220,
    'L/s',
    NULL,
    'Waikanae Category B groundwater (stream depletion)',
    'Waikanae Category B groundwater (stream depletion)',
    'final appeals version 2022',
    '10.2'
  ),
  (
    'Raumati Category B groundwater',
    'Category B groundwater',
    1229000,
    'm 3 /year',
    NULL,
    'Raumati Category B groundwater',
    'Raumati Category B groundwater',
    'final appeals version 2022',
    '10.3'
  ),
  (
    'Waikanae Category B groundwater',
    'Category B groundwater',
    2710000,
    'm 3 /year',
    NULL,
    'Waikanae Category B groundwater',
    'Waikanae Category B groundwater',
    'final appeals version 2022',
    '10.3'
  ),
  (
    'Te Horo Category B groundwater',
    'Category B groundwater',
    1620000,
    'm 3 /year',
    NULL,
    'Te Horo Category B groundwater',
    'Te Horo Category B groundwater',
    'final appeals version 2022',
    '10.3'
  ),
  (
    'Waitohu Category B groundwater',
    'Category B groundwater',
    1080000,
    'm 3 /year',
    NULL,
    'Waitohu Category B groundwater',
    'Waitohu Category B groundwater',
    'final appeals version 2022',
    '10.3'
  );
