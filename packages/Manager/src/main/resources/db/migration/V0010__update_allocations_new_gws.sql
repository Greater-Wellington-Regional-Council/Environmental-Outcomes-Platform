INSERT INTO allocation_amounts
  (
    id,
    take_type,
    management_unit_type,
    area_description,
    surfacewater_subunit_name,
    parent_surfacewatersubunit_id,
    hydro_id,
    excluded_hydro_ids,
    allocation_amount,
    allocation_amount_unit,
    consented_allocation_greater_than_allocation_amount,
    catchment_management_unit,
    plan_version,
    plan_table
  )
VALUES
  (56,'GROUNDWATER',NULL,'Waiohine Category A groundwater',NULL,25,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (57,'GROUNDWATER',NULL,'Waiohine Category A groundwater',NULL,25,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (58,'GROUNDWATER',NULL,'Waiohine Category A groundwater',NULL,26,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (59,'GROUNDWATER',NULL,'Moiki Category A groundwater',NULL,26,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (60,'GROUNDWATER',NULL,'Moiki Category A groundwater',NULL,25,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (61,'GROUNDWATER',NULL,'Moiki Category A groundwater',NULL,28,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (62,'GROUNDWATER',NULL,'Moiki Category A groundwater',NULL,27,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (63,'GROUNDWATER',NULL,'Lower Ruamāhanga Category A groundwater',NULL,28,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (64,'GROUNDWATER',NULL,'Middle Ruamāhanga Category A groundwater',NULL,24,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (65,'GROUNDWATER',NULL,'Middle Ruamāhanga Category A groundwater',NULL,22,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (66,'GROUNDWATER',NULL,'Middle Ruamāhanga Category A groundwater',NULL,21,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (67,'GROUNDWATER',NULL,'Waignawa Category A groundwater',NULL,20,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (68,'GROUNDWATER',NULL,'Waignawa Category A groundwater',NULL,26,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (69,'GROUNDWATER',NULL,'Waignawa Category A groundwater',NULL,19,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (70,'GROUNDWATER',NULL,'Waignawa Category A groundwater',NULL,19,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (71,'GROUNDWATER',NULL,'Waignawa Category A groundwater',NULL,19,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (72,'GROUNDWATER',NULL,'Waignawa Category A groundwater',NULL,19,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (73,'GROUNDWATER',NULL,'Waignawa Category A groundwater',NULL,19,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (74,'GROUNDWATER',NULL,'Upper Ruamāhanga Category A groundwater',NULL,17,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (75,'GROUNDWATER',NULL,'Onoke Category A groundwater',NULL,NULL,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (76,'GROUNDWATER',NULL,'Waikanae Category A groundwater',NULL,NULL,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (77,'GROUNDWATER',NULL,'Waikanae Category A groundwater',NULL,40,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (78,'GROUNDWATER',NULL,'Ōtaki Category A groundwater',NULL,38,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (79,'GROUNDWATER',NULL,'Ōtaki Category A groundwater',NULL,37,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (80,'GROUNDWATER',NULL,'Mangatarere Catergory A',NULL,22,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (81,'GROUNDWATER',NULL,'Tauherenikau Category A',NULL,NULL,NULL,NULL,NULL,'',FALSE,'','',NULL),
  (82,'GROUNDWATER',NULL,'Lower Hutt Category A groundwater',NULL,NULL,NULL,NULL,NULL,'',FALSE,'','',NULL);

UPDATE allocation_amounts
SET parent_surfacewatersubunit_id=26
WHERE id=4;

UPDATE allocation_amounts
SET parent_surfacewatersubunit_id=28
WHERE id=13;

UPDATE allocation_amounts
SET parent_surfacewatersubunit_id=28
WHERE id=14;

UPDATE allocation_amounts
SET parent_surfacewatersubunit_id=24
WHERE id=45;

UPDATE allocation_amounts
SET area_description='Parkvale Category C groundwater (confined)'
WHERE id=6;

UPDATE allocation_amounts
SET area_description='Parkvale Category B groundwater (unconfined)'
WHERE id=7;
