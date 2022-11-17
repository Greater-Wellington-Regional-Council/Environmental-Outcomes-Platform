INSERT INTO
  sites (siteid_hilltop, NAME, geom)
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
  minimum_flow_limits (
    plan_description,
    plan_management_point_name,
    plan_minimum_flow_value,
    plan_minimum_flow_unit,
    siteid_hilltop,
    plan_table,
    plan_version,
    hydro_id
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
    257409
  ),
  (
    'Between the confluence with the Waiohine River and the Belvedere Road bridge',
    'Mangatarere River at Gorge',
    200,
    'L/s',
    758,
    7.1,
    'final appeals version 2022',
    257905
  ),
  (
    'Kopuaranga River upstream of the confluence with the Ruamāhanga River',
    'Palmers',
    270,
    'L/s',
    597,
    7.1,
    'final appeals version 2022',
    254602
  ),
  (
    'Waipoua River upstream of the confluence with the Ruamāhanga River',
    'Mikimiki Bridge',
    250,
    'L/s',
    2634,
    7.1,
    'final appeals version 2022',
    256291
  ),
  (
    'Waingawa River upstream of the confluence with the Ruamāhanga River',
    'Kaituna',
    1100,
    'L/s',
    2559,
    7.1,
    'final appeals version 2022',
    257578
  ),
  (
    'Parkvale Stream upstream of the confluence with the Ruamāhanga River',
    'Renalls Weir recorder',
    100,
    'L/s',
    1136,
    7.1,
    'final appeals version 2022',
    259497
  ),
  (
    'Waiohine River upstream of the confluence with the Ruamāhanga River',
    'Gorge recorder',
    2300,
    'L/s',
    2609,
    7.1,
    'final appeals version 2022',
    260015
  ),
  (
    'Papawai Stream upstream of the confluence with the Ruamāhanga River',
    'Fabians Road recorder',
    180,
    'L/s',
    1093,
    7.1,
    'final appeals version 2022',
    260343
  ),
  (
    'Upper and Middle Ruamāhanga River upstream of the confluence with the Waiohine River',
    'Wardells ',
    2400,
    'L/s',
    1521,
    7.1,
    'final appeals version 2022',
    259960
  ),
  (
    'Otukura Stream upstream of the confluence with Dock/Stonestead Creek',
    'Weir recorder ',
    95,
    'L/s',
    1045,
    7.1,
    'final appeals version 2022',
    262397
  ),
  (
    'Tauherenikau River upstream of Lake Wairarapa',
    'Gorge recorder',
    1100,
    'L/s',
    2368,
    7.1,
    'final appeals version 2022',
    261930
  ),
  (
    'Lower Ruamāhanga River between the boundary with the coastal marine area and the Waiohine River confluence ',
    'Waihenga recorder',
    8500,
    'L/s',
    1518,
    7.1,
    'final appeals version 2022',
    267143
  ),
  (
    'Te Awa Kairangi/Hutt River Upstream of the confluence with the Pakuratahi River',
    'Kaitoke water supply intake',
    600,
    'L/s',
    454,
    8.1,
    'final appeals version 2022',
    258639
  ),
  (
    'Te Awa Kairangi/Hutt River Downstream of the confluence with the Pakuratahi River',
    'Birchville recorder ',
    1200,
    'L/s',
    434,
    8.1,
    'final appeals version 2022',
    263323
  ),
  (
    'Wainuiomata River Between Manuka Track and the confluence with Georges Creek ',
    'Manuka recorder',
    100,
    'L/s',
    2589,
    8.1,
    'final appeals version 2022',
    264063
  ),
  (
    'Wainuiomata River Between Georges Creek and the boundary of the coastal marine area',
    'Leonard Wood Park recorder',
    300,
    'L/s',
    2588,
    8.1,
    'final appeals version 2022',
    267323
  ),
  (
    'Orongorongo River upstream of the boundary with the coastal marine area',
    'Truss Bridge recorder',
    100,
    'L/s',
    978,
    8.1,
    'final appeals version 2022',
    267384
  ),
  (
    'Waitohu Stream upstream of the coastal marine area boundary',
    'KCDC Water Supply Intake recorder ',
    140,
    'L/s',
    2666,
    10.1,
    'final appeals version 2022',
    249434
  ),
  (
    'Ōtaki River upstream of the coastal marine area boundary',
    'Pukehinau recorder',
    2550,
    'L/s',
    1012,
    10.1,
    'final appeals version 2022',
    250291
  ),
  (
    'Mangaone Stream upstream of the coastal marine area boundary',
    'Ratanui recorder',
    22,
    'L/s',
    706,
    10.1,
    'final appeals version 2022',
    251029
  ),
  (
    'Waikanae River upstream of the coastal marine area boundary ',
    'WTP recorder',
    750,
    'L/s',
    2528,
    10.1,
    'final appeals version 2022',
    253589
  );

INSERT INTO
  allocation_amounts (
    area_description,
    category,
    hydro_id,
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
    NULL,
    480000,
    'm 3 /year',
    TRUE,
    'Upper Ruamāhanga',
    'Te Ore Ore Category B groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Waingawa Category B groundwater and Waingawa Category C groundwater',
    'Category B groundwater',
    NULL,
    1900000,
    'm 3 /year',
    FALSE,
    'Upper Ruamāhanga',
    'Waingawa Category B groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Waingawa Category B groundwater and Waingawa Category C groundwater',
    'Category C groundwater',
    NULL,
    1900000,
    'm 3 /year',
    FALSE,
    'Upper Ruamāhanga',
    'Waingawa Category C groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Ruamāhanga Category B groundwater and Ruamāhanga Category C groundwater',
    'Category B groundwater',
    NULL,
    3550000,
    'm 3 /year',
    FALSE,
    'Upper Ruamāhanga',
    'Ruamāhanga Category B groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Ruamāhanga Category B groundwater and Ruamāhanga Category C groundwater',
    'Category C groundwater',
    NULL,
    3550000,
    'm 3 /year',
    FALSE,
    'Upper Ruamāhanga',
    'Ruamāhanga Category C groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Fernhill-Tiffen Category C groundwater',
    'Category C groundwater',
    NULL,
    1200000,
    'm 3 /year',
    FALSE,
    'Middle Ruamāhanga',
    'Fernhill-Tiffen Category C groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Taratahi Category B groundwater and Taratahi Category C groundwater',
    'Category B groundwater',
    NULL,
    1400000,
    'm 3 /year',
    FALSE,
    'Middle Ruamāhanga',
    'Taratahi Category B groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Taratahi Category B groundwater and Taratahi Category C groundwater',
    'Category C groundwater',
    NULL,
    1400000,
    'm 3 /year',
    FALSE,
    'Middle Ruamāhanga',
    'Taratahi Category C groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Parkvale Category B groundwater and Parkvale Category C groundwater (confined)',
    'Category B groundwater (confined)',
    NULL,
    350000,
    'm 3 /year',
    TRUE,
    'Middle Ruamāhanga',
    'Parkvale Category B groundwater (confined)',
    'final appeals version 2022',
    7.5
  ),
  (
    'Parkvale Category B groundwater and Parkvale Category C groundwater (confined)',
    'Category C groundwater (confined)',
    NULL,
    350000,
    'm 3 /year',
    TRUE,
    'Middle Ruamāhanga',
    'Parkvale Category C groundwater (confined)',
    'final appeals version 2022',
    7.5
  ),
  (
    'Parkvale Category B groundwater and Parkvale Category C groundwater (unconfined)',
    'Category B groundwater (unconfined)',
    NULL,
    1550000,
    'm 3 /year',
    TRUE,
    'Middle Ruamāhanga',
    'Parkvale Category B groundwater (unconfined)',
    'final appeals version 2022',
    7.5
  ),
  (
    'Parkvale Category B groundwater and Parkvale Category C groundwater (unconfined)',
    'Category C groundwater (unconfined)',
    NULL,
    1550000,
    'm 3 /year',
    TRUE,
    'Middle Ruamāhanga',
    'Parkvale Category C groundwater (unconfined)',
    'final appeals version 2022',
    7.5
  ),
  (
    'Mangatarere Category B groundwater and Mangatarere Category C groundwater',
    'Category B groundwater',
    NULL,
    2300000,
    'm 3 /year',
    TRUE,
    'Middle Ruamāhanga',
    'Mangatarere Category B groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Mangatarere Category B groundwater and Mangatarere Category C groundwater',
    'Category C groundwater',
    NULL,
    2300000,
    'm 3 /year',
    TRUE,
    'Middle Ruamāhanga',
    'Mangatarere Category C groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Tauherenikau Category B groundwater',
    'Category B groundwater',
    NULL,
    6600000,
    'm 3 /year',
    TRUE,
    'Lower Ruamāhanga',
    'Tauherenikau Category B groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Lower Ruamāhanga Category B groundwater',
    'Category B groundwater',
    NULL,
    3300000,
    'm 3 /year',
    FALSE,
    'Lower Ruamāhanga',
    'Lower Ruamāhanga Category B groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Lake Category B groundwater and Lake Category C groundwater',
    'Category B groundwater',
    NULL,
    6750000,
    'm 3 /year',
    TRUE,
    'Lower Ruamāhanga',
    'Lake Category B groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Lake Category B groundwater and Lake Category C groundwater',
    'Category C groundwater',
    NULL,
    6750000,
    'm 3 /year',
    TRUE,
    'Lower Ruamāhanga',
    'Lake Category C groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Huangarua Category B groundwater',
    'Category B groundwater',
    NULL,
    650000,
    'm 3 /year',
    TRUE,
    'Lower Ruamāhanga',
    'Huangarua Category B groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Martinborough Category C groundwater',
    'Category C groundwater',
    NULL,
    800000,
    'm 3 /year',
    FALSE,
    'Lower Ruamāhanga',
    'Martinborough Category C groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Dry River Category B groundwater',
    'Category B groundwater',
    NULL,
    650000,
    'm 3 /year',
    FALSE,
    'Lower Ruamāhanga',
    'Dry River Category B groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Onoke Category C groundwater',
    'Category C groundwater',
    NULL,
    2100000,
    'm 3 /year',
    FALSE,
    'Lower Ruamāhanga',
    'Onoke Category C groundwater',
    'final appeals version 2022',
    7.5
  ),
  (
    'Ruamāhanga River and tributaries, upstream of (but not including) the confluence with the Lake Wairarapa outflow, and all Category A groundwater and Category B groundwater (stream depletion) identified in the catchment management sub-units below in Table 7.3',
    'Surface Water',
    9265128,
    7430,
    'L/s',
    FALSE,
    'Ruamāhanga River catchment above the Lake Wairarapa outflow',
    'Ruamāhanga River and tributaries, upstream of (but not including) the confluence with the Lake Wairarapa outflow',
    'final appeals version 2022',
    7.3
  ),
  (
    'Ruamāhanga River and tributaries, upstream of (but not including) the confluence with the Lake Wairarapa outflow, and all Category A groundwater and Category B groundwater (stream depletion) identified in the catchment management sub-units below in Table 7.3',
    'Category A groundwater',
    9265128,
    7430,
    'L/s',
    FALSE,
    'Ruamāhanga River catchment above the Lake Wairarapa outflow',
    'All Category A groundwater identified in the catchment management sub-units in Table 7.3',
    'final appeals version 2022',
    7.3
  ),
  (
    'Ruamāhanga River and tributaries, upstream of (but not including) the confluence with the Lake Wairarapa outflow, and all Category A groundwater and Category B groundwater (stream depletion) identified in the catchment management sub-units below in Table 7.3',
    'Category B groundwater (stream depletion)',
    9265128,
    7430,
    'L/s',
    FALSE,
    'Ruamāhanga River catchment above the Lake Wairarapa outflow',
    'All Category B groundwater (stream depletion) identified in the catchment management sub-units in Table 7.3',
    'final appeals version 2022',
    7.3
  ),
  (
    'Kopuaranga River and tributaries, Category A groundwater and Upper Ruamāhanga Category B groundwater(stream depletion)',
    'Surface Water',
    9254500,
    180,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Kopuaranga River and tributaries',
    'final appeals version 2022',
    7.3
  ),
  (
    'Kopuaranga River and tributaries, Category A groundwater and Upper Ruamāhanga Category B groundwater(stream depletion)',
    'Category A groundwater',
    9254500,
    180,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Kopuaranga River Category A groundwater',
    'final appeals version 2022',
    7.3
  ),
  (
    'Kopuaranga River and tributaries, Category A groundwater and Upper Ruamāhanga Category B groundwater(stream depletion)',
    'Category B groundwater (stream depletion)',
    9254500,
    180,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Upper Ruamāhanga Category B groundwater(stream depletion)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Waipoua River and tributaries, Category A groundwater and Upper Ruamāhanga or Waingawa Category B groundwater (stream depletion)',
    'Surface Water',
    9256259,
    145,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Waipoua River and tributaries',
    'final appeals version 2022',
    7.3
  ),
  (
    'Waipoua River and tributaries, Category A groundwater and Upper Ruamāhanga or Waingawa Category B groundwater (stream depletion)',
    'Category A groundwater',
    9256259,
    145,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Waipoua River Category A groundwater',
    'final appeals version 2022',
    7.3
  ),
  (
    'Waipoua River and tributaries, Category A groundwater and Upper Ruamāhanga or Waingawa Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9256259,
    145,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Upper Ruamāhanga or Waingawa Category B groundwater (stream depletion)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Waingawa River and tributaries, Waingawa Category A groundwater) and Taratahi or Waingawa Category B groundwater (stream depletion)',
    'Surface Water',
    9257515,
    920,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Waingawa River and tributaries',
    'final appeals version 2022',
    7.3
  ),
  (
    'Waingawa River and tributaries, Waingawa Category A groundwater) and Taratahi or Waingawa Category B groundwater (stream depletion)',
    'Category A groundwater',
    9257515,
    920,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Waingawa Category A groundwater',
    'final appeals version 2022',
    7.3
  ),
  (
    'Waingawa River and tributaries, Waingawa Category A groundwater) and Taratahi or Waingawa Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9257515,
    920,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Taratahi or Waingawa Category B groundwater (stream depletion)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Ruamāhanga River and tributaries upstream of the confluence with the Waingawa River, Upper Ruamāhanga Category A groundwater and Waingawa, Te Ore Ore or Upper Ruamāhanga Category B groundwater (stream depletion), excluding all the above catchment management subunits in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Surface Water',
    9257572,
    1200,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Ruamāhanga River and tributaries upstream of the confluence with the Waingawa River',
    'final appeals version 2022',
    7.3
  ),
  (
    'Ruamāhanga River and tributaries upstream of the confluence with the Waingawa River, Upper Ruamāhanga Category A groundwater and Waingawa, Te Ore Ore or Upper Ruamāhanga Category B groundwater (stream depletion), excluding all the above catchment management subunits in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Category A groundwater',
    9257572,
    1200,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Upper Ruamāhanga Category A groundwater',
    'final appeals version 2022',
    7.3
  ),
  (
    'Ruamāhanga River and tributaries upstream of the confluence with the Waingawa River, Upper Ruamāhanga Category A groundwater and Waingawa, Te Ore Ore or Upper Ruamāhanga Category B groundwater (stream depletion), excluding all the above catchment management subunits in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Category B groundwater (stream depletion)',
    9257572,
    1200,
    'L/s',
    FALSE,
    'Upper Ruamāhanga',
    'Waingawa, Te Ore Ore or Upper Ruamāhanga Category B groundwater (stream depletion), excluding all the above catchment management subunits in the Ruamāhanga catchment (above this row in Table 7.3)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Parkvale Stream and tributaries, and Taratahi or Parkvale Category B groundwater (stream depletion)',
    'Surface Water',
    9259306,
    40,
    'L/s',
    TRUE,
    'Middle Ruamāhanga',
    'Parkvale Stream and tributaries',
    'final appeals version 2022',
    7.3
  ),
  (
    'Parkvale Stream and tributaries, and Taratahi or Parkvale Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9259306,
    40,
    'L/s',
    TRUE,
    'Middle Ruamāhanga',
    'Taratahi or Parkvale Category B groundwater (stream depletion)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Booths Creek and tributaries and Parkvale, Mangatarere or Taratahi Category B groundwater (stream depletion)',
    'Surface Water',
    9259591,
    25,
    'L/s',
    TRUE,
    'Middle Ruamāhanga',
    'Booths Creek and tributaries and Parkvale',
    'final appeals version 2022',
    7.3
  ),
  (
    'Booths Creek and tributaries and Parkvale, Mangatarere or Taratahi Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9259591,
    25,
    'L/s',
    TRUE,
    'Middle Ruamāhanga',
    'Mangatarere or Taratahi Category B groundwater (stream depletion)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Mangatarere Stream and tributaries, Mangatarere Category A groundwater and Mangatarere Category B groundwater (stream depletion)',
    'Surface Water',
    9257756,
    110,
    'L/s',
    FALSE,
    'Middle Ruamāhanga',
    'Mangatarere Stream and tibutaries',
    'final appeals version 2022',
    7.3
  ),
  (
    'Mangatarere Stream and tributaries, Mangatarere Category A groundwater and Mangatarere Category B groundwater (stream depletion)',
    'Category A groundwater',
    9257756,
    110,
    'L/s',
    FALSE,
    'Middle Ruamāhanga',
    'Mangatarere Category A groundwater',
    'final appeals version 2022',
    7.3
  ),
  (
    'Mangatarere Stream and tributaries, Mangatarere Category A groundwater and Mangatarere Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9257756,
    110,
    'L/s',
    FALSE,
    'Middle Ruamāhanga',
    'Managatere Category B groundwater (stream depletion)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Waiohine River and tributaries (excluding Mangatarere Stream and tributaries) Waiohine Category A groundwater) and Mangatarere Category B groundwater (stream depletion)',
    'Surface Water',
    9259933,
    1590,
    'L/s',
    FALSE,
    'Middle Ruamāhanga',
    'Waiohine River and tributaries (excluding Mangatarere Stream and tributaries)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Waiohine River and tributaries (excluding Mangatarere Stream and tributaries) Waiohine Category A groundwater) and Mangatarere Category B groundwater (stream depletion)',
    'Category A groundwater',
    9259933,
    1590,
    'L/s',
    FALSE,
    'Middle Ruamāhanga',
    'Waiohine Category A groundwater',
    'final appeals version 2022',
    7.3
  ),
  (
    'Waiohine River and tributaries (excluding Mangatarere Stream and tributaries) Waiohine Category A groundwater) and Mangatarere Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9259933,
    1590,
    'L/s',
    FALSE,
    'Middle Ruamāhanga',
    'Mangatarere Category B groundwater (stream depletion)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Papawai Stream and tributaries and Waiohine Category A groundwater',
    'Surface Water',
    9260403,
    105,
    'L/s',
    TRUE,
    'Middle Ruamāhanga',
    'Papawai Stream and tributaries',
    'final appeals version 2022',
    7.3
  ),
  (
    'Papawai Stream and tributaries and Waiohine Category A groundwater',
    'Category A groundwater',
    9260403,
    105,
    'L/s',
    TRUE,
    'Middle Ruamāhanga',
    'Waiohine Category A groundwater',
    'final appeals version 2022',
    7.3
  ),
  (
    'Ruamāhanga River and tributaries upstream of the confluence with the Papawai Stream, and Middle Ruamāhanga Category A groundwater excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Surface Water',
    9260404,
    1240,
    'L/s',
    FALSE,
    'Middle Ruamāhanga',
    'Ruamāhanga River and tributaries upstream of the confluence with the Papawai Stream',
    'final appeals version 2022',
    7.3
  ),
  (
    'Ruamāhanga River and tributaries upstream of the confluence with the Papawai Stream, and Middle Ruamāhanga Category A groundwater excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Category A groundwater',
    9260404,
    1240,
    'L/s',
    FALSE,
    'Middle Ruamāhanga',
    'Middle Ruamāhanga Category A groundwater excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Huangarua River and tributaries and Huangarua Category A groundwater and Huangarua Category B groundwater (stream depletion)',
    'Surface Water',
    9262716,
    110,
    'L/s',
    FALSE,
    'Lower Ruamāhanga',
    'Huangarua River and tributaries',
    'final appeals version 2022',
    7.3
  ),
  (
    'Huangarua River and tributaries and Huangarua Category A groundwater and Huangarua Category B groundwater (stream depletion)',
    'Category A groundwater',
    9262716,
    110,
    'L/s',
    FALSE,
    'Lower Ruamāhanga',
    'Huangarua Category A groundwater',
    'final appeals version 2022',
    7.3
  ),
  (
    'Huangarua River and tributaries and Huangarua Category A groundwater and Huangarua Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9262716,
    110,
    'L/s',
    FALSE,
    'Lower Ruamāhanga',
    'Huangarua Category B groundwater (stream depletion)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Lower Ruamāhanga River and tributaries upstream of (but not including) the confluence with the Lake Wairarapa outflow, and Lower Ruamāhanga Category A groundwater and Lake Category B groundwater (stream depletion) excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Surface Water',
    9265128,
    1370,
    'L/s',
    FALSE,
    'Lower Ruamāhanga',
    'Lower Ruamāhanga River and tributaries upstream of (but not including) the confluence with the Lake Wairarapa outflow',
    'final appeals version 2022',
    7.3
  ),
  (
    'Lower Ruamāhanga River and tributaries upstream of (but not including) the confluence with the Lake Wairarapa outflow, and Lower Ruamāhanga Category A groundwater and Lake Category B groundwater (stream depletion) excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Category A groundwater',
    9265128,
    1370,
    'L/s',
    FALSE,
    'Lower Ruamāhanga',
    'Lower Ruamāhanga Category A groundwater',
    'final appeals version 2022',
    7.3
  ),
  (
    'Lower Ruamāhanga River and tributaries upstream of (but not including) the confluence with the Lake Wairarapa outflow, and Lower Ruamāhanga Category A groundwater and Lake Category B groundwater (stream depletion) excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'Category B groundwater (stream depletion)',
    9265128,
    1370,
    'L/s',
    FALSE,
    'Lower Ruamāhanga',
    'Lake Category B groundwater (stream depletion) excluding all the above catchment management sub-units in the Ruamāhanga catchment (above this row in Table 7.3)',
    'final appeals version 2022',
    7.3
  ),
  (
    'Lake Wairarapa and tributaries above the confluence of the Lake Wairarapa outflow with the Ruamāhanga River, and Tauherenikau Category A groundwater and Lake or Tauherenikau Category B groundwater (stream depletion)',
    'Surface Water',
    9265450,
    1800,
    'L/s',
    FALSE,
    'Lake Wairarapa',
    'Lake Wairarapa and tributaries above the confluence of the Lake Wairarapa outflow with the Ruamāhanga River',
    'final appeals version 2022',
    7.4
  ),
  (
    'Lake Wairarapa and tributaries above the confluence of the Lake Wairarapa outflow with the Ruamāhanga River, and Tauherenikau Category A groundwater and Lake or Tauherenikau Category B groundwater (stream depletion)',
    'Category A groundwater',
    9265450,
    1800,
    'L/s',
    FALSE,
    'Lake Wairarapa',
    'Tauherenikau Category A groundwater',
    'final appeals version 2022',
    7.4
  ),
  (
    'Lake Wairarapa and tributaries above the confluence of the Lake Wairarapa outflow with the Ruamāhanga River, and Tauherenikau Category A groundwater and Lake or Tauherenikau Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9265450,
    1800,
    'L/s',
    FALSE,
    'Lake Wairarapa',
    'Lake or Tauherenikau Category B groundwater (stream depletion)',
    'final appeals version 2022',
    7.4
  ),
  (
    'Otukura Stream and tributaries above (but not including) the confluence with Dock/Stonestead Creek and Tauherenikau Category B groundwater (stream depletion)',
    'Surface Water',
    9262384,
    30,
    'L/s',
    TRUE,
    'Lake Wairarapa',
    'Otukura Stream and tributaries above (but not including) the confluence with Dock/Stonestead Creek',
    'final appeals version 2022',
    7.4
  ),
  (
    'Otukura Stream and tributaries above (but not including) the confluence with Dock/Stonestead Creek and Tauherenikau Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9262384,
    30,
    'L/s',
    TRUE,
    'Lake Wairarapa',
    'Tauherenikau Category B groundwater (stream depletion)',
    'final appeals version 2022',
    7.4
  ),
  (
    'Tauherenikau River and tributaries, and Tauherenikau Category A groundwater and Tauherenikau Category B groundwater (stream depletion)',
    'Surface Water',
    9262043,
    410,
    'L/s',
    FALSE,
    'Lake Wairarapa',
    'Tauherenikau River and tributaries',
    'final appeals version 2022',
    7.4
  ),
  (
    'Tauherenikau River and tributaries, and Tauherenikau Category A groundwater and Tauherenikau Category B groundwater (stream depletion)',
    'Category A groundwater',
    9262043,
    410,
    'L/s',
    FALSE,
    'Lake Wairarapa',
    'Tauherenikau Category A groundwater',
    'final appeals version 2022',
    7.4
  ),
  (
    'Tauherenikau River and tributaries, and Tauherenikau Category A groundwater and Tauherenikau Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9262043,
    410,
    'L/s',
    FALSE,
    'Lake Wairarapa',
    'Tauherenikau Category B groundwater (stream depletion)',
    'final appeals version 2022',
    7.4
  ),
  (
    'Te Awa Kairangi/Hutt River and tributaries, Upper Hutt or Lower Hutt Category A groundwater and Upper or Lower Hutt Category B groundwater (stream depletion) in the catchment management units shown in Figures 8.1 and 8.2',
    'Surface Water',
    9263188,
    2140,
    'L/s',
    FALSE,
    'Te Awa Kairangi/Hutt River',
    'Te Awa Kairangi/Hutt River and tributaries',
    'final appeals version 2022',
    8.2
  ),
  (
    'Te Awa Kairangi/Hutt River and tributaries, Upper Hutt or Lower Hutt Category A groundwater and Upper or Lower Hutt Category B groundwater (stream depletion) in the catchment management units shown in Figures 8.1 and 8.2',
    'Category A groundwater',
    9263188,
    2140,
    'L/s',
    FALSE,
    'Te Awa Kairangi/Hutt River',
    'Upper Hutt or Lower Hutt Category A groundwater',
    'final appeals version 2022',
    8.2
  ),
  (
    'Te Awa Kairangi/Hutt River and tributaries, Upper Hutt or Lower Hutt Category A groundwater and Upper or Lower Hutt Category B groundwater (stream depletion) in the catchment management units shown in Figures 8.1 and 8.2',
    'Category B groundwater (stream depletion)',
    9263188,
    2140,
    'L/s',
    FALSE,
    'Te Awa Kairangi/Hutt River',
    'Upper or Lower Hutt Category B groundwater (stream depletion) in the catchment management units shown in Figures 8.1 and 8.2',
    'final appeals version 2022',
    8.2
  ),
  (
    'Wainuiomata River and tributaries',
    'Surface Water',
    9267263,
    180,
    'L/s',
    FALSE,
    'Wainuiomata River',
    'Wainuiomata River and tributaries',
    'final appeals version 2022',
    8.2
  ),
  (
    'Orongorongo River and tributaries',
    'Surface Water',
    9267413,
    95,
    'L/s',
    FALSE,
    'Orongorongo River',
    'Orongorongo River and tributaries',
    'final appeals version 2022',
    8.2
  ),
  (
    'Upper Hutt Category B groundwater and Upper Hutt Category C groundwater',
    'Category B groundwater',
    NULL,
    770000,
    'm 3 /year',
    FALSE,
    'Wellington Harbour and Hutt Valley Whaitua',
    'Upper Hutt Category B groundwater',
    'final appeals version 2022',
    8.3
  ),
  (
    'Upper Hutt Category B groundwater and Upper Hutt Category C groundwater',
    'Category C groundwater',
    NULL,
    770000,
    'm 3 /year',
    FALSE,
    'Wellington Harbour and Hutt Valley Whaitua',
    'Upper Hutt Category C groundwater',
    'final appeals version 2022',
    8.3
  ),
  (
    'Lower Hutt Category B groundwater',
    'Category B groundwater',
    NULL,
    36500000,
    'm 3 /year',
    FALSE,
    'Wellington Harbour and Hutt Valley Whaitua',
    'Lower Hutt Category B groundwater',
    'final appeals version 2022',
    8.3
  ),
  (
    'Waitohu Stream and tributaries, Waitohu Category A groundwater and Ōtaki Category B groundwater (stream depletion)',
    'Surface Water',
    9249511,
    45,
    'L/s',
    FALSE,
    'Waitohu Stream and tributaries',
    'Waitohu Stream and tributaries',
    'final appeals version 2022',
    10.2
  ),
  (
    'Waitohu Stream and tributaries, Waitohu Category A groundwater and Ōtaki Category B groundwater (stream depletion)',
    'Category A groundwater',
    9249511,
    45,
    'L/s',
    FALSE,
    'Waitohu Category A groundwater',
    'Waitohu Category A groundwater',
    'final appeals version 2022',
    10.2
  ),
  (
    'Waitohu Stream and tributaries, Waitohu Category A groundwater and Ōtaki Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9249511,
    45,
    'L/s',
    FALSE,
    'Ōtaki Category B groundwater (stream depletion)',
    'Ōtaki Category B groundwater (stream depletion)',
    'final appeals version 2022',
    10.2
  ),
  (
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Surface Water',
    9250231,
    590,
    'L/s',
    FALSE,
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Ōtaki River and tributaries',
    'final appeals version 2022',
    10.2
  ),
  (
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Category A groundwater',
    9250231,
    590,
    'L/s',
    FALSE,
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Ōtaki Category A groundwater',
    'final appeals version 2022',
    10.2
  ),
  (
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9250231,
    590,
    'L/s',
    FALSE,
    'Ōtaki River and tributaries, Ōtaki Category A groundwater and Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'Ōtaki or Te Horo Category B groundwater (stream depletion)',
    'final appeals version 2022',
    10.2
  ),
  (
    'Mangaone Stream and tributaries, Te Horo Category B groundwater (stream depletion)',
    'Surface Water',
    9251129,
    24,
    'L/s',
    FALSE,
    'Mangaone Stream and tributaries',
    'Mangaone Stream and tributaries',
    'final appeals version 2022',
    10.2
  ),
  (
    'Mangaone Stream and tributaries, Te Horo Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9251129,
    24,
    'L/s',
    FALSE,
    'Te Horo Category B groundwater (stream depletion)',
    'Te Horo Category B groundwater (stream depletion)',
    'final appeals version 2022',
    10.2
  ),
  (
    'Waikanae River and tributaries, Waikanae Category A groundwater and Waikanae Category B groundwater (stream depletion)',
    'Surface Water',
    9253625,
    220,
    'L/s',
    FALSE,
    'Waikanae River and tributaries',
    'Waikanae River and tributaries',
    'final appeals version 2022',
    10.2
  ),
  (
    'Waikanae River and tributaries, Waikanae Category A groundwater and Waikanae Category B groundwater (stream depletion)',
    'Category A groundwater',
    9253625,
    220,
    'L/s',
    FALSE,
    'Waikanae Category A groundwater',
    'Waikanae Category A groundwater',
    'final appeals version 2022',
    10.2
  ),
  (
    'Waikanae River and tributaries, Waikanae Category A groundwater and Waikanae Category B groundwater (stream depletion)',
    'Category B groundwater (stream depletion)',
    9253625,
    220,
    'L/s',
    FALSE,
    'Waikanae Category B groundwater (stream depletion)',
    'Waikanae Category B groundwater (stream depletion)',
    'final appeals version 2022',
    10.2
  ),
  (
    'Raumati Category B groundwater',
    'Category B groundwater',
    NULL,
    1229000,
    'm 3 /year',
    FALSE,
    'Raumati Category B groundwater',
    'Raumati Category B groundwater',
    'final appeals version 2022',
    10.3
  ),
  (
    'Waikanae Category B groundwater',
    'Category B groundwater',
    NULL,
    2710000,
    'm 3 /year',
    FALSE,
    'Waikanae Category B groundwater',
    'Waikanae Category B groundwater',
    'final appeals version 2022',
    10.3
  ),
  (
    'Te Horo Category B groundwater',
    'Category B groundwater',
    NULL,
    1620000,
    'm 3 /year',
    FALSE,
    'Te Horo Category B groundwater',
    'Te Horo Category B groundwater',
    'final appeals version 2022',
    10.3
  ),
  (
    'Waitohu Category B groundwater',
    'Category B groundwater',
    NULL,
    1080000,
    'm 3 /year',
    FALSE,
    'Waitohu Category B groundwater',
    'Waitohu Category B groundwater',
    'final appeals version 2022',
    10.3
  );

;

;
