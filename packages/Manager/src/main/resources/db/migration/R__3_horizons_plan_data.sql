DELETE
FROM council_plan_documents
WHERE council_id = 8;

INSERT INTO council_plan_documents (council_id, source_id, document)
VALUES (8, 'ONE_PLAN_2023',
        '
        {
          "id": "ONE_PLAN_2023",
          "name": "One Plan",
          "defaultSurfaceWaterLimit": "10% of MALF",
          "regions": [
            {
              "id": "akitio",
              "name": "Akitio",
              "boundaryId": "akit_1",
              "surfaceWaterLimits": [
                {
                  "id": "akit_1",
                  "name": "Akitio",
                  "allocationLimit": 2592,
                  "boundaryId": "akit_1",
                  "children": [
                    {
                      "id": "akit_1a",
                      "name": "Upper Akitio",
                      "allocationLimit": 864,
                      "boundaryId": "akit_1a"
                    },
                    {
                      "id": "akit_1b",
                      "name": "Lower Akitio",
                      "allocationLimit": 2592,
                      "boundaryId": "akit_1b"
                    },
                    {
                      "id": "akit_1c",
                      "name": "Waihi",
                      "allocationLimit": 1296,
                      "boundaryId": "akit_1c"
                    }
                  ]
                }
              ]
            },
            {
              "id": "lake_horowhenua",
              "name": "Lake Horowhenua",
              "boundaryId": "hoki_1",
              "surfaceWaterLimits": [
                {
                  "id": "hoki_1",
                  "name": "Lake Horowhenua",
                  "allocationLimit": 0,
                  "boundaryId": "hoki_1",
                  "children": [
                    {
                      "id": "hoki_1a",
                      "name": "Lake Horowhenua",
                      "allocationLimit": 0,
                      "boundaryId": "hoki_1a"
                    },
                    {
                      "id": "hoki_1b",
                      "name": "Hokio",
                      "allocationLimit": 0,
                      "boundaryId": "hoki_1b"
                    }
                  ]
                }
              ],
              "groundwaterLimits": [
                {
                  "id": "horowhenua",
                  "name": "Horowhenua",
                  "allocationLimit": 27000000,
                  "areas": [
                    {
                      "id": "horowhenua",
                      "depth": "All depths",
                      "boundaryId": "horowhenua_gw"
                    }
                  ]
                }
              ]
            },
            {
              "id": "manawatu",
              "name": "Manawatu",
              "boundaryId": "manawatu",
              "surfaceWaterLimits": [
                {
                  "id": "mana_1",
                  "name": "Upper Manawatu",
                  "allocationLimit": 17712,
                  "boundaryId": "mana_1",
                  "children": [
                    {
                      "id": "mana_1a",
                      "name": "Upper Manawatu",
                      "allocationLimit": 17712,
                      "boundaryId": "mana_1a"
                    },
                    {
                      "id": "mana_1b",
                      "name": "Mangatewainui",
                      "allocationLimit": 5616,
                      "boundaryId": "mana_1b"
                    },
                    {
                      "id": "mana_1c",
                      "name": "Mangatoro",
                      "allocationLimit": 10368,
                      "boundaryId": "mana_1c"
                    }
                  ]
                },
                {
                  "id": "mana_10",
                  "name": "Middle Manawatu",
                  "allocationLimit": 264384,
                  "boundaryId": "mana_10",
                  "children": [
                    {
                      "id": "mana_10a",
                      "name": "Middle Manawatu",
                      "allocationLimit": 264384,
                      "boundaryId": "mana_10a"
                    },
                    {
                      "id": "mana_10b",
                      "name": "Upper Pohangina",
                      "allocationLimit": 9936,
                      "boundaryId": "mana_10b"
                    },
                    {
                      "id": "mana_10c",
                      "name": "Middle Pohangina",
                      "allocationLimit": 39312,
                      "boundaryId": "mana_10c"
                    },
                    {
                      "id": "mana_10d",
                      "name": "Lower Pohangina",
                      "allocationLimit": 39312,
                      "boundaryId": "mana_10d"
                    },
                    {
                      "id": "mana_10e",
                      "name": "Aokautere",
                      "allocationLimit": 432,
                      "boundaryId": "mana_10e"
                    }
                  ]
                },
                {
                  "id": "mana_11",
                  "name": "Lower Manawatu",
                  "allocationLimit": 336096,
                  "boundaryId": "mana_11",
                  "children": [
                    {
                      "id": "mana_11a",
                      "name": "Lower Manawatu",
                      "allocationLimit": 336096,
                      "boundaryId": "mana_11a"
                    },
                    {
                      "id": "mana_11b",
                      "name": "Turitea",
                      "allocationLimit": 37100,
                      "boundaryId": "mana_11b"
                    },
                    {
                      "id": "mana_11c",
                      "name": "Kahuterawa",
                      "allocationLimit": 864,
                      "boundaryId": "mana_11c"
                    },
                    {
                      "id": "mana_11d",
                      "name": "Upper Mangaone Stream",
                      "allocationLimit": 432,
                      "boundaryId": "mana_11d"
                    },
                    {
                      "id": "mana_11e",
                      "name": "Lower Mangaone Stream",
                      "allocationLimit": 864,
                      "boundaryId": "mana_11e"
                    },
                    {
                      "id": "mana_11f",
                      "name": "Main Drain",
                      "allocationLimit": 0,
                      "boundaryId": "mana_11f"
                    }
                  ]
                },
                {
                  "id": "mana_12",
                  "name": "Oroua",
                  "allocationLimit": 37152,
                  "boundaryId": "mana_12",
                  "children": [
                    {
                      "id": "mana_12a",
                      "name": "Upper Oroua",
                      "allocationLimit": 34128,
                      "boundaryId": "mana_12a"
                    },
                    {
                      "id": "mana_12b",
                      "name": "Middle Oroua",
                      "allocationLimit": 34992,
                      "boundaryId": "mana_12b"
                    },
                    {
                      "id": "mana_12c",
                      "name": "Lower Oroua",
                      "allocationLimit": 37152,
                      "boundaryId": "mana_12c"
                    },
                    {
                      "id": "mana_12d",
                      "name": "Kiwitea",
                      "allocationLimit": 1296,
                      "boundaryId": "mana_12d"
                    },
                    {
                      "id": "mana_12e",
                      "name": "Makino",
                      "allocationLimit": 1296,
                      "boundaryId": "mana_12e"
                    }
                  ]
                },
                {
                  "id": "mana_13",
                  "name": "Coastal Manawatu",
                  "allocationLimit": 598752,
                  "boundaryId": "mana_13",
                  "children": [
                    {
                      "id": "mana_13a",
                      "name": "Coastal Manawatu",
                      "allocationLimit": 598752,
                      "boundaryId": "mana_13a"
                    },
                    {
                      "id": "mana_13b",
                      "name": "Upper Tokomaru",
                      "allocationLimit": 1296,
                      "boundaryId": "mana_13b"
                    },
                    {
                      "id": "mana_13c",
                      "name": "Lower Tokomaru",
                      "allocationLimit": 14688,
                      "boundaryId": "mana_13c"
                    },
                    {
                      "id": "mana_13d",
                      "name": "Mangaore",
                      "allocationLimit": 0,
                      "boundaryId": "mana_13d"
                    },
                    {
                      "id": "mana_13e",
                      "name": "Koputaroa",
                      "allocationLimit": 432,
                      "boundaryId": "mana_13e"
                    },
                    {
                      "id": "mana_13f",
                      "name": "Foxton Loop",
                      "allocationLimit": 0,
                      "boundaryId": "mana_13f"
                    }
                  ]
                },
                {
                  "id": "mana_2",
                  "name": "Weber-Tamaki",
                  "allocationLimit": 21600,
                  "boundaryId": "mana_2",
                  "children": [
                    {
                      "id": "mana_2a",
                      "name": "Weber-Tamaki",
                      "allocationLimit": 21600,
                      "boundaryId": "mana_2a"
                    },
                    {
                      "id": "mana_2b",
                      "name": "Mangatera",
                      "allocationLimit": 3888,
                      "boundaryId": "mana_2b"
                    }
                  ]
                },
                {
                  "id": "mana_3",
                  "name": "Upper Tamaki",
                  "allocationLimit": 6912,
                  "boundaryId": "mana_3",
                  "children": [
                    {
                      "id": "mana_3_sub",
                      "name": "Upper Tamaki",
                      "allocationLimit": 6912,
                      "boundaryId": "mana_3"
                    }
                  ]
                },
                {
                  "id": "mana_4",
                  "name": "Upper Kumeti",
                  "allocationLimit": 864,
                  "boundaryId": "mana_4",
                  "children": [
                    {
                      "id": "mana_4_sub",
                      "name": "Upper Kumeti",
                      "allocationLimit": 864,
                      "boundaryId": "mana_4"
                    }
                  ]
                },
                {
                  "id": "mana_5",
                  "name": "Tamaki-Hopelands",
                  "allocationLimit": 83808,
                  "boundaryId": "mana_5",
                  "children": [
                    {
                      "id": "mana_5a",
                      "name": "Tamaki-Hopelands",
                      "allocationLimit": 83808,
                      "boundaryId": "mana_5a"
                    },
                    {
                      "id": "mana_5b",
                      "name": "Lower Tamaki",
                      "allocationLimit": 12096,
                      "boundaryId": "mana_5b"
                    },
                    {
                      "id": "mana_5c",
                      "name": "Lower Kumeti",
                      "allocationLimit": 5184,
                      "boundaryId": "mana_5c"
                    },
                    {
                      "id": "mana_5d",
                      "name": "Oruakeretaki",
                      "allocationLimit": 13651,
                      "boundaryId": "mana_5d"
                    },
                    {
                      "id": "mana_5e",
                      "name": "Raparapawai",
                      "allocationLimit": 1296,
                      "boundaryId": "mana_5e"
                    }
                  ]
                },
                {
                  "id": "mana_6",
                  "name": "Hopelands-Tiraumea",
                  "allocationLimit": 90720,
                  "boundaryId": "mana_6",
                  "children": [
                    {
                      "id": "mana_6_sub",
                      "name": "Hopelands-Tiraumea",
                      "allocationLimit": 90720,
                      "boundaryId": "mana_6"
                    }
                  ]
                },
                {
                  "id": "mana_7",
                  "name": "Tiraumea",
                  "allocationLimit": 23328,
                  "boundaryId": "mana_7",
                  "children": [
                    {
                      "id": "mana_7a",
                      "name": "Upper Tiraumea",
                      "allocationLimit": 3456,
                      "boundaryId": "mana_7a"
                    },
                    {
                      "id": "mana_7b",
                      "name": "Lower Tiraumea",
                      "allocationLimit": 23328,
                      "boundaryId": "mana_7b"
                    },
                    {
                      "id": "mana_7c",
                      "name": "Mangaone River",
                      "allocationLimit": 1728,
                      "boundaryId": "mana_7c"
                    },
                    {
                      "id": "mana_7d",
                      "name": "Makuri",
                      "allocationLimit": 8640,
                      "boundaryId": "mana_7d"
                    },
                    {
                      "id": "mana_7e",
                      "name": "Mangaramarama",
                      "allocationLimit": 2160,
                      "boundaryId": "mana_7e"
                    }
                  ]
                },
                {
                  "id": "mana_8",
                  "name": "Mangatainoka",
                  "allocationLimit": 27913,
                  "boundaryId": "mana_8",
                  "children": [
                    {
                      "id": "mana_8a",
                      "name": "Upper Mangatainoka",
                      "allocationLimit": 1728,
                      "boundaryId": "mana_8a"
                    },
                    {
                      "id": "mana_8b",
                      "name": "Middle Mangatainoka",
                      "allocationLimit": 5184,
                      "boundaryId": "mana_8b"
                    },
                    {
                      "id": "mana_8c",
                      "name": "Lower Mangatainoka",
                      "allocationLimit": 27913,
                      "boundaryId": "mana_8c"
                    },
                    {
                      "id": "mana_8d",
                      "name": "Makakahi",
                      "allocationLimit": 2694,
                      "boundaryId": "mana_8d"
                    }
                  ]
                },
                {
                  "id": "mana_9",
                  "name": "Upper Gorge",
                  "allocationLimit": 198288,
                  "boundaryId": "mana_9",
                  "children": [
                    {
                      "id": "mana_9a",
                      "name": "Upper Gorge",
                      "allocationLimit": 198288,
                      "boundaryId": "mana_9a"
                    },
                    {
                      "id": "mana_9b",
                      "name": "Mangapapa",
                      "allocationLimit": 1296,
                      "boundaryId": "mana_9b"
                    },
                    {
                      "id": "mana_9c",
                      "name": "Mangaatua",
                      "allocationLimit": 432,
                      "boundaryId": "mana_9c"
                    },
                    {
                      "id": "mana_9d",
                      "name": "Upper Mangahao",
                      "allocationLimit": 7344,
                      "boundaryId": "mana_9d"
                    },
                    {
                      "id": "mana_9e",
                      "name": "Lower Mangahao",
                      "allocationLimit": 7344,
                      "boundaryId": "mana_9e"
                    }
                  ]
                }
              ],
              "groundwaterLimits": [
                {
                  "id": "manawatu",
                  "name": "Manawatu",
                  "allocationLimit": 166000000,
                  "areas": [
                    {
                      "id": "manawatu",
                      "depth": "All depths",
                      "boundaryId": "manawatu_gw"
                    }
                  ]
                },
                {
                  "id": "tararua",
                  "name": "Tararua",
                  "allocationLimit": 239000000,
                  "areas": [
                    {
                      "id": "tararua",
                      "depth": "All depths",
                      "boundaryId": "tararua_gw"
                    }
                  ]
                }
              ]
            },
            {
              "id": "rangitikei",
              "name": "Rangitikei",
              "boundaryId": "rangitikei",
              "surfaceWaterLimits": [
                {
                  "id": "rang_1",
                  "name": "Upper Rangitikei",
                  "allocationLimit": 0,
                  "boundaryId": "rang_1",
                  "children": [
                    {
                      "id": "rang_1_sub",
                      "name": "Upper Rangitikei",
                      "allocationLimit": 0,
                      "boundaryId": "rang_1"
                    }
                  ]
                },
                {
                  "id": "rang_2",
                  "name": "Middle Rangitikei",
                  "allocationLimit": 52704,
                  "boundaryId": "rang_2",
                  "children": [
                    {
                      "id": "rang_2a",
                      "name": "Middle Rangitikei",
                      "allocationLimit": 21600,
                      "boundaryId": "rang_2a"
                    },
                    {
                      "id": "rang_2b",
                      "name": "Pukeokahu- Mangaweka",
                      "allocationLimit": 52704,
                      "boundaryId": "rang_2b"
                    },
                    {
                      "id": "rang_2c",
                      "name": "Upper Moawhango",
                      "allocationLimit": 0,
                      "boundaryId": "rang_2c"
                    },
                    {
                      "id": "rang_2d",
                      "name": "Middle Moawhango",
                      "allocationLimit": 0,
                      "boundaryId": "rang_2d"
                    },
                    {
                      "id": "rang_2e",
                      "name": "Lower Moawhango",
                      "allocationLimit": 0,
                      "boundaryId": "rang_2e"
                    },
                    {
                      "id": "rang_2f",
                      "name": "Upper Hautapu",
                      "allocationLimit": 9936,
                      "boundaryId": "rang_2f"
                    },
                    {
                      "id": "rang_2g",
                      "name": "Lower Hautapu",
                      "allocationLimit": 12960,
                      "boundaryId": "rang_2g"
                    }
                  ]
                },
                {
                  "id": "rang_3",
                  "name": "Lower Rangitikei",
                  "allocationLimit": 141696,
                  "boundaryId": "rang_3",
                  "children": [
                    {
                      "id": "rang_3a",
                      "name": "Lower Rangitikei",
                      "allocationLimit": 141696,
                      "boundaryId": "rang_3a"
                    },
                    {
                      "id": "rang_3b",
                      "name": "Makohine",
                      "allocationLimit": 864,
                      "boundaryId": "rang_3b"
                    }
                  ]
                },
                {
                  "id": "rang_4",
                  "name": "Coastal Rangitikei",
                  "allocationLimit": 285120,
                  "boundaryId": "rang_4",
                  "children": [
                    {
                      "id": "rang_4a",
                      "name": "Coastal Rangitikei",
                      "allocationLimit": 213840,
                      "boundaryId": "rang_4a"
                    },
                    {
                      "id": "rang_4b",
                      "name": "Tidal Rangitikei",
                      "allocationLimit": 285120,
                      "boundaryId": "rang_4b"
                    },
                    {
                      "id": "rang_4c",
                      "name": "Porewa",
                      "allocationLimit": 0,
                      "boundaryId": "rang_4c"
                    },
                    {
                      "id": "rang_4d",
                      "name": "Tutaenui",
                      "allocationLimit": 6653,
                      "boundaryId": "rang_4d"
                    }
                  ]
                }
              ],
              "groundwaterLimits": [
                {
                  "id": "rangitikei",
                  "name": "Rangitikei",
                  "allocationLimit": 75000000,
                  "areas": [
                    {
                      "id": "rangitikei",
                      "depth": "All depths",
                      "boundaryId": "rangitikei_gw"
                    }
                  ]
                },
                {
                  "id": "northern_rangitikei",
                  "name": "Northern Rangitikei",
                  "allocationLimit": 0,
                  "areas": [
                    {
                      "id": "northern_rangitikei",
                      "depth": "All depths",
                      "boundaryId": "northern_rangitikei_gw"
                    }
                  ]
                }
              ]
            },
            {
              "id": "whanganui",
              "name": "Whanganui",
              "boundaryId": "whanganui",
              "surfaceWaterLimits": [
                {
                  "id": "whai_1",
                  "name": "Upper Whanganui",
                  "allocationLimit": 518,
                  "boundaryId": "whai_1",
                  "children": [
                    {
                      "id": "whai_1_sub",
                      "name": "Upper Whanganui",
                      "allocationLimit": 518,
                      "boundaryId": "whai_1"
                    }
                  ]
                },
                {
                  "id": "whai_2",
                  "name": "Cherry Grove",
                  "allocationLimit": 15121,
                  "boundaryId": "whai_2",
                  "children": [
                    {
                      "id": "whai_2a",
                      "name": "Cherry Grove",
                      "allocationLimit": 15121,
                      "boundaryId": "whai_2a"
                    },
                    {
                      "id": "whai_2b",
                      "name": "Upper Whakapapa",
                      "allocationLimit": 3937,
                      "boundaryId": "whai_2b"
                    },
                    {
                      "id": "whai_2c",
                      "name": "Lower Whakapapa",
                      "allocationLimit": 5517,
                      "boundaryId": "whai_2c"
                    },
                    {
                      "id": "whai_2d",
                      "name": "Piopiotea",
                      "allocationLimit": 80,
                      "boundaryId": "whai_2d"
                    },
                    {
                      "id": "whai_2e",
                      "name": "Pungapunga",
                      "allocationLimit": 0,
                      "boundaryId": "whai_2e"
                    },
                    {
                      "id": "whai_2f",
                      "name": "Upper Ongarue",
                      "allocationLimit": 1270,
                      "boundaryId": "whai_2f"
                    },
                    {
                      "id": "whai_2g",
                      "name": "Lower Ongarue",
                      "allocationLimit": 1422,
                      "boundaryId": "whai_2g"
                    }
                  ]
                },
                {
                  "id": "whai_3",
                  "name": "Te Maire",
                  "allocationLimit": 0,
                  "boundaryId": "whai_3",
                  "children": [
                    {
                      "id": "whai_3_sub",
                      "name": "Te Maire",
                      "allocationLimit": 0,
                      "boundaryId": "whai_3"
                    }
                  ]
                },
                {
                  "id": "whai_4",
                  "name": "Middle Whanganui",
                  "allocationLimit": 0,
                  "boundaryId": "whai_4",
                  "children": [
                    {
                      "id": "whai_4a",
                      "name": "Middle Whanganui",
                      "allocationLimit": 0,
                      "boundaryId": "whai_4a"
                    },
                    {
                      "id": "whai_4b",
                      "name": "Upper Ohura",
                      "allocationLimit": 0,
                      "boundaryId": "whai_4b"
                    },
                    {
                      "id": "whai_4c",
                      "name": "Lower Ohura",
                      "allocationLimit": 0,
                      "boundaryId": "whai_4c"
                    },
                    {
                      "id": "whai_4d",
                      "name": "Retaruke",
                      "allocationLimit": 0,
                      "boundaryId": "whai_4d"
                    }
                  ]
                },
                {
                  "id": "whai_5",
                  "name": "Pipiriki",
                  "allocationLimit": 0,
                  "boundaryId": "whai_5",
                  "children": [
                    {
                      "id": "whai_5a",
                      "name": "Pipiriki",
                      "allocationLimit": 0,
                      "boundaryId": "whai_5a"
                    },
                    {
                      "id": "whai_5b",
                      "name": "Tangarakau",
                      "allocationLimit": 0,
                      "boundaryId": "whai_5b"
                    },
                    {
                      "id": "whai_5c",
                      "name": "Whangamomona",
                      "allocationLimit": 0,
                      "boundaryId": "whai_5c"
                    },
                    {
                      "id": "whai_5d",
                      "name": "Upper Manganui o te Ao",
                      "allocationLimit": 0,
                      "boundaryId": "whai_5d"
                    },
                    {
                      "id": "whai_5e",
                      "name": "Makatote",
                      "allocationLimit": 0,
                      "boundaryId": "whai_5e"
                    },
                    {
                      "id": "whai_5f",
                      "name": "Waimarino",
                      "allocationLimit": 0,
                      "boundaryId": "whai_5f"
                    },
                    {
                      "id": "whai_5g",
                      "name": "Middle Manganui o te Ao",
                      "allocationLimit": 0,
                      "boundaryId": "whai_5g"
                    },
                    {
                      "id": "whai_5h",
                      "name": "Mangaturuturu",
                      "allocationLimit": 0,
                      "boundaryId": "whai_5h"
                    },
                    {
                      "id": "whai_5i",
                      "name": "Lower Manganui o te Ao",
                      "allocationLimit": 0,
                      "boundaryId": "whai_5i"
                    },
                    {
                      "id": "whai_5j",
                      "name": "Orautoha",
                      "allocationLimit": 0,
                      "boundaryId": "whai_5j"
                    }
                  ]
                },
                {
                  "id": "whai_6",
                  "name": "Paetawa",
                  "allocationLimit": 0,
                  "boundaryId": "whai_6",
                  "children": [
                    {
                      "id": "whai_6_sub",
                      "name": "Paetawa",
                      "allocationLimit": 0,
                      "boundaryId": "whai_6"
                    }
                  ]
                },
                {
                  "id": "whai_7",
                  "name": "Lower Whanganui",
                  "allocationLimit": 0,
                  "boundaryId": "whai_7",
                  "children": [
                    {
                      "id": "whai_7a",
                      "name": "Lower Whanganui",
                      "allocationLimit": 0,
                      "boundaryId": "whai_7a"
                    },
                    {
                      "id": "whai_7b",
                      "name": "Coastal Whanganui",
                      "allocationLimit": 0,
                      "boundaryId": "whai_7b"
                    },
                    {
                      "id": "whai_7c",
                      "name": "Upokongaro",
                      "allocationLimit": 0,
                      "boundaryId": "whai_7c"
                    },
                    {
                      "id": "whai_7d",
                      "name": "Matarawa",
                      "allocationLimit": 0,
                      "boundaryId": "whai_7d"
                    }
                  ]
                }
              ],
              "groundwaterLimits": [
                {
                  "id": "whanganui",
                  "name": "Whanganui",
                  "allocationLimit": 46000000,
                  "areas": [
                    {
                      "id": "whanganui",
                      "depth": "All depths",
                      "boundaryId": "whanganui_gw"
                    }
                  ]
                },
                {
                  "id": "northern_whanganui",
                  "name": "Northern Whanganui",
                  "allocationLimit": 0,
                  "areas": [
                    {
                      "id": "northern_whanganui",
                      "depth": "All depths",
                      "boundaryId": "northern_whanganui_gw"
                    }
                  ]
                }
              ]
            },
            {
              "id": "whangaehu",
              "name": "Whangaehu",
              "boundaryId": "whangaehu",
              "surfaceWaterLimits": [
                {
                  "id": "whau_1",
                  "name": "Upper Whangaehu",
                  "allocationLimit": 47520,
                  "boundaryId": "whau_1",
                  "children": [
                    {
                      "id": "whau_1a",
                      "name": "Upper Whangaehu",
                      "allocationLimit": 47520,
                      "boundaryId": "whau_1a"
                    },
                    {
                      "id": "whau_1b",
                      "name": "Waitangi",
                      "allocationLimit": 9504,
                      "boundaryId": "whau_1b"
                    },
                    {
                      "id": "whau_1c",
                      "name": "Tokiahuru",
                      "allocationLimit": 41472,
                      "boundaryId": "whau_1c"
                    }
                  ]
                },
                {
                  "id": "whau_2",
                  "name": "Middle Whangaehu",
                  "allocationLimit": 52272,
                  "boundaryId": "whau_2",
                  "children": [
                    {
                      "id": "whau_2_sub",
                      "name": "Middle Whangaehu",
                      "allocationLimit": 52272,
                      "boundaryId": "whau_2"
                    }
                  ]
                },
                {
                  "id": "whau_3",
                  "name": "Lower Whangaehu",
                  "allocationLimit": 127008,
                  "boundaryId": "whau_3",
                  "children": [
                    {
                      "id": "whau_3a",
                      "name": "Lower Whangaehu",
                      "allocationLimit": 127008,
                      "boundaryId": "whau_3a"
                    },
                    {
                      "id": "whau_3b",
                      "name": "Upper Makotuku",
                      "allocationLimit": 2506,
                      "boundaryId": "whau_3b"
                    },
                    {
                      "id": "whau_3c",
                      "name": "Lower Makotuku",
                      "allocationLimit": 3802,
                      "boundaryId": "whau_3c"
                    },
                    {
                      "id": "whau_3d",
                      "name": "Upper Mangawhero",
                      "allocationLimit": 20736,
                      "boundaryId": "whau_3d"
                    },
                    {
                      "id": "whau_3e",
                      "name": "Lower Mangawhero",
                      "allocationLimit": 24624,
                      "boundaryId": "whau_3e"
                    },
                    {
                      "id": "whau_3f",
                      "name": "Makara",
                      "allocationLimit": 0,
                      "boundaryId": "whau_3f"
                    }
                  ]
                },
                {
                  "id": "whau_4",
                  "name": "Coastal Whangaehu",
                  "allocationLimit": 127008,
                  "boundaryId": "whau_4",
                  "children": [
                    {
                      "id": "whau_4_sub",
                      "name": "Coastal Whangaehu",
                      "allocationLimit": 127008,
                      "boundaryId": "whau_4"
                    }
                  ]
                }
              ],
              "groundwaterLimits": [
                {
                  "id": "whangaehu",
                  "name": "Whangaehu",
                  "allocationLimit": 122000000,
                  "areas": [
                    {
                      "id": "whangaehu",
                      "depth": "All depths",
                      "boundaryId": "whangaehu_gw"
                    }
                  ]
                }
              ]
            },
            {
              "id": "turakina",
              "name": "Turakina",
              "boundaryId": "tura_1",
              "surfaceWaterLimits": [
                {
                  "id": "tura_1",
                  "name": "Turakina",
                  "allocationLimit": 12528,
                  "boundaryId": "tura_1",
                  "children": [
                    {
                      "id": "tura_1a",
                      "name": "Upper Turakina",
                      "allocationLimit": 3024,
                      "boundaryId": "tura_1a"
                    },
                    {
                      "id": "tura_1b",
                      "name": "Lower Turakina",
                      "allocationLimit": 12528,
                      "boundaryId": "tura_1b"
                    },
                    {
                      "id": "tura_1c",
                      "name": "Ratana",
                      "allocationLimit": 0,
                      "boundaryId": "tura_1c"
                    }
                  ]
                }
              ],
              "groundwaterLimits": [
                {
                  "id": "turakina",
                  "name": "Turakina",
                  "allocationLimit": 50000000,
                  "areas": [
                    {
                      "id": "turakina",
                      "depth": "All depths",
                      "boundaryId": "turakina_gw"
                    }
                  ]
                }
              ]
            },
            {
              "id": "ohau",
              "name": "Ohau",
              "boundaryId": "ohau_1",
              "surfaceWaterLimits": [
                {
                  "id": "ohau_1",
                  "name": "Ohau",
                  "allocationLimit": 24192,
                  "boundaryId": "ohau_1",
                  "children": [
                    {
                      "id": "ohau_1a",
                      "name": "Upper Ohau",
                      "allocationLimit": 24192,
                      "boundaryId": "ohau_1a"
                    },
                    {
                      "id": "ohau_1b",
                      "name": "Lower Ohau",
                      "allocationLimit": 24192,
                      "boundaryId": "ohau_1b"
                    }
                  ]
                }
              ]
            },
            {
              "id": "owahanga",
              "name": "Owahanga",
              "boundaryId": "owha_1",
              "surfaceWaterLimits": [
                {
                  "id": "owha_1",
                  "name": "Owahanga",
                  "allocationLimit": 0,
                  "boundaryId": "owha_1",
                  "children": [
                    {
                      "id": "owha_1_sub",
                      "name": "Owahanga",
                      "allocationLimit": 432,
                      "boundaryId": "owha_1"
                    }
                  ]
                }
              ]
            },
            {
              "id": "east_coast",
              "name": "East Coast",
              "boundaryId": "east_1",
              "surfaceWaterLimits": [
                {
                  "id": "east_1",
                  "name": "East Coast",
                  "allocationLimit": 0,
                  "boundaryId": "east_1",
                  "children": [
                    {
                      "id": "east_1_sub",
                      "name": "East Coast",
                      "allocationLimit": 0,
                      "boundaryId": "east_1"
                    }
                  ]
                }
              ],
              "groundwaterLimits": [
                {
                  "id": "east_coast",
                  "name": "East Coast",
                  "allocationLimit": 0,
                  "areas": [
                    {
                      "id": "east_coast",
                      "depth": "All depths",
                      "boundaryId": "east_coast_gw"
                    }
                  ]
                }
              ]
            },
            {
              "id": "west_coast",
              "name": "West Coast",
              "boundaryId": "west_coast",
              "surfaceWaterLimits": [
                {
                  "id": "west_1",
                  "name": "Northern Coastal",
                  "allocationLimit": 0,
                  "boundaryId": "west_1",
                  "children": [
                    {
                      "id": "west_1_sub",
                      "name": "Northern Coastal",
                      "allocationLimit": 0,
                      "boundaryId": "west_1"
                    }
                  ]
                },
                {
                  "id": "west_2",
                  "name": "Kai Iwi",
                  "allocationLimit": 3888,
                  "boundaryId": "west_2",
                  "children": [
                    {
                      "id": "west_2_sub",
                      "name": "Kai Iwi",
                      "allocationLimit": 3888,
                      "boundaryId": "west_2"
                    }
                  ]
                },
                {
                  "id": "west_3",
                  "name": "Mowhanau",
                  "allocationLimit": 0,
                  "boundaryId": "west_3",
                  "children": [
                    {
                      "id": "west_3_sub",
                      "name": "Mowhanau",
                      "allocationLimit": 0,
                      "boundaryId": "west_3"
                    }
                  ]
                },
                {
                  "id": "west_4",
                  "name": "Kaitoke Lakes",
                  "allocationLimit": 0,
                  "boundaryId": "west_4",
                  "children": [
                    {
                      "id": "west_4_sub",
                      "name": "Kaitoke Lakes",
                      "allocationLimit": 0,
                      "boundaryId": "west_4"
                    }
                  ]
                },
                {
                  "id": "west_5",
                  "name": "Southern Whanganui Lakes",
                  "allocationLimit": 0,
                  "boundaryId": "west_5",
                  "children": [
                    {
                      "id": "west_5_sub",
                      "name": "Southern Whanganui Lakes",
                      "allocationLimit": 0,
                      "boundaryId": "west_5"
                    }
                  ]
                },
                {
                  "id": "west_6",
                  "name": "Northern Manawatu Lakes",
                  "allocationLimit": 0,
                  "boundaryId": "west_6",
                  "children": [
                    {
                      "id": "west_6_sub",
                      "name": "Northern Manawatu Lakes",
                      "allocationLimit": 0,
                      "boundaryId": "west_6"
                    }
                  ]
                },
                {
                  "id": "west_7",
                  "name": "Waitarere",
                  "allocationLimit": 0,
                  "boundaryId": "west_7",
                  "children": [
                    {
                      "id": "west_7_sub",
                      "name": "Waitarere",
                      "allocationLimit": 0,
                      "boundaryId": "west_7"
                    }
                  ]
                },
                {
                  "id": "west_8",
                  "name": "Lake Papaitonga",
                  "allocationLimit": 0,
                  "boundaryId": "west_8",
                  "children": [
                    {
                      "id": "west_8_sub",
                      "name": "Lake Papaitonga",
                      "allocationLimit": 0,
                      "boundaryId": "west_8"
                    }
                  ]
                },
                {
                  "id": "west_9",
                  "name": "Waikawa",
                  "allocationLimit": 6048,
                  "boundaryId": "west_9",
                  "children": [
                    {
                      "id": "west_9a",
                      "name": "Waikawa",
                      "allocationLimit": 6048,
                      "boundaryId": "west_9a"
                    },
                    {
                      "id": "west_9b",
                      "name": "Manakau",
                      "allocationLimit": 432,
                      "boundaryId": "west_9b"
                    }
                  ]
                }
              ]
            }
          ]
        }');