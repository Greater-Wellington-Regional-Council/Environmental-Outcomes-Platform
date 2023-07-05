INSERT INTO hilltop_sources (council_id, hts_url)
VALUES (1, 'http://hilltop.nrc.govt.nz/Data.hts'),
       (5, 'http://hilltop.gdc.govt.nz/data.hts'),
       (6, 'https://data.hbrc.govt.nz/Envirodata/EMAR.hts'),
       (8, 'https://tsdata.horizons.govt.nz/hydrology.hts'),
       (9, 'https://hilltop.gw.govt.nz/merged.hts'),
       (12, 'http://data.wcrc.govt.nz:9083/data.hts'),
       (16, 'https://envdata.tasman.govt.nz/data.hts'),
       (17, 'http://envdata.nelson.govt.nz/data.hts'),
       (18, 'https://hydro.marlborough.govt.nz/data.hts'),
       (13, 'http://wateruse.ecan.govt.nz/WQAll.hts'),
       (14, 'http://gisdata.orc.govt.nz/Hilltop//data.hts'),
       (15, 'http://odp.es.govt.nz/data.hts')
ON CONFLICT DO NOTHING;
