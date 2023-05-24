DELETE
FROM council_plan_documents
WHERE council_id = 8;

INSERT INTO council_plan_documents (council_id, source_id, document)
VALUES (8, 'ONE_PLAN_2023',
        '
        {
          "id": "ONE_PLAN_2023",
          "name": "One Plan",
          "regions": [
            {
              "id": "akitio",
              "name": "Akitio",
              "boundaryId": "akit_1",
              "surfaceWaterLimits": [
                {
                  "id": "akit_1",
                  "name": "Akitio",
                  "boundaryId": "akit_1",
                  "allocationLimit": 2592,
                  "children": [
                    {
                      "id": "akit_1a",
                      "name": "Upper Akitio",
                      "boundaryId": "akit_1a",
                      "allocationLimit": 864
                    },
                    {
                      "id": "akit_1b",
                      "name": "Lower Akitio",
                      "boundaryId": "akit_1b",
                      "allocationLimit": 2592
                    },
                    {
                      "id": "akit_1c",
                      "name": "Waihi",
                      "boundaryId": "akit_1c",
                      "allocationLimit": 1296
                    }
                  ]
                }
              ]
            },
            {
              "id": "Lake_Horowhenua",
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
                      "boundaryId": "hoki_1a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "hoki_1b",
                      "name": "Hokio",
                      "boundaryId": "hoki_1b",
                      "allocationLimit": 0
                    }
                  ]
                }
              ],
              "defaultSurfaceWaterLimit": "10% of MALF"
            },
            {
              "id": "manawatu",
              "name": "Manawatu",
              "boundaryId": "manawatu",
              "surfaceWaterLimits": [
                {
                  "id": "mana_1",
                  "name": "Upper Manawatu",
                  "boundaryId": "mana_1",
                  "allocationLimit": 205,
                  "children": [
                    {
                      "id": "mana_1a",
                      "name": "Upper Manawatu",
                      "boundaryId": "mana_1a",
                      "allocationLimit": 205
                    },
                    {
                      "id": "mana_1b",
                      "name": "Mangatewainui",
                      "boundaryId": "mana_1b",
                      "allocationLimit": 65
                    },
                    {
                      "id": "mana_1c",
                      "name": "Mangatoro",
                      "boundaryId": "mana_1c",
                      "allocationLimit": 120
                    }
                  ]
                },
                {
                  "id": "mana_10",
                  "name": "Middle Manawatu",
                  "boundaryId": "mana_10",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "mana_10a",
                      "name": "Middle Manawatu",
                      "boundaryId": "mana_10a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_10b",
                      "name": "Upper Pohangina",
                      "boundaryId": "mana_10b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_10c",
                      "name": "Middle Pohangina",
                      "boundaryId": "mana_10c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_10d",
                      "name": "Lower Pohangina",
                      "boundaryId": "mana_10d",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_10e",
                      "name": "Aokautere",
                      "boundaryId": "mana_10e",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "mana_11",
                  "name": "Lower Manawatu",
                  "boundaryId": "mana_11",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "mana_11a",
                      "name": "Lower Manawatu",
                      "boundaryId": "mana_11a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_11b",
                      "name": "Turitea",
                      "boundaryId": "mana_11b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_11c",
                      "name": "Kahuterawa",
                      "boundaryId": "mana_11c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_11d",
                      "name": "Upper Mangaone Stream",
                      "boundaryId": "mana_11d",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_11e",
                      "name": "Lower Mangaone Stream",
                      "boundaryId": "mana_11e",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_11f",
                      "name": "Main Drain",
                      "boundaryId": "mana_11f",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "mana_12",
                  "name": "Oroua",
                  "boundaryId": "mana_12",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "mana_12a",
                      "name": "Upper Oroua",
                      "boundaryId": "mana_12a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_12b",
                      "name": "Middle Oroua",
                      "boundaryId": "mana_12b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_12c",
                      "name": "Lower Oroua",
                      "boundaryId": "mana_12c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_12d",
                      "name": "Kiwitea",
                      "boundaryId": "mana_12d",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_12e",
                      "name": "Makino",
                      "boundaryId": "mana_12e",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "mana_13",
                  "name": "Coastal Manawatu",
                  "boundaryId": "mana_13",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "mana_13a",
                      "name": "Coastal Manawatu",
                      "boundaryId": "mana_13a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_13b",
                      "name": "Upper Tokomaru",
                      "boundaryId": "mana_13b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_13c",
                      "name": "Lower Tokomaru",
                      "boundaryId": "mana_13c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_13d",
                      "name": "Mangaore",
                      "boundaryId": "mana_13d",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_13e",
                      "name": "Koputaroa",
                      "boundaryId": "mana_13e",
                      "allocationLimit": 0
                    },
                    {
                      "id": "mana_13f",
                      "name": "Foxton Loop",
                      "boundaryId": "mana_13f",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "mana_2",
                  "name": "Weber-Tamaki",
                  "boundaryId": "mana_2",
                  "allocationLimit": 250,
                  "children": [
                    {
                      "id": "mana_2a",
                      "name": "Weber-Tamaki",
                      "boundaryId": "mana_2a",
                      "allocationLimit": 250
                    },
                    {
                      "id": "mana_2b",
                      "name": "Mangatera",
                      "boundaryId": "mana_2b",
                      "allocationLimit": 45
                    }
                  ]
                },
                {
                  "id": "mana_3",
                  "name": "Upper Tamaki",
                  "boundaryId": "mana_3",
                  "allocationLimit": 80,
                  "children": [
                    {
                      "id": "mana_3_sub",
                      "name": "Upper Tamaki",
                      "boundaryId": "mana_3",
                      "allocationLimit": 80
                    }
                  ]
                },
                {
                  "id": "mana_4",
                  "name": "Upper Kumeti",
                  "boundaryId": "mana_4",
                  "allocationLimit": 10,
                  "children": [
                    {
                      "id": "mana_4_sub",
                      "name": "Upper Kumeti",
                      "boundaryId": "mana_4",
                      "allocationLimit": 10
                    }
                  ]
                },
                {
                  "id": "mana_5",
                  "name": "Tamaki-Hopelands",
                  "boundaryId": "mana_5",
                  "allocationLimit": 970,
                  "children": [
                    {
                      "id": "mana_5a",
                      "name": "Tamaki-Hopelands",
                      "boundaryId": "mana_5a",
                      "allocationLimit": 970
                    },
                    {
                      "id": "mana_5b",
                      "name": "Lower Tamaki",
                      "boundaryId": "mana_5b",
                      "allocationLimit": 140
                    },
                    {
                      "id": "mana_5c",
                      "name": "Lower Kumeti",
                      "boundaryId": "mana_5c",
                      "allocationLimit": 60
                    },
                    {
                      "id": "mana_5d",
                      "name": "Oruakeretaki",
                      "boundaryId": "mana_5d",
                      "allocationLimit": 158
                    },
                    {
                      "id": "mana_5e",
                      "name": "Raparapawai",
                      "boundaryId": "mana_5e",
                      "allocationLimit": 15
                    }
                  ]
                },
                {
                  "id": "mana_6",
                  "name": "Hopelands-Tiraumea",
                  "boundaryId": "mana_6",
                  "allocationLimit": 1050,
                  "children": [
                    {
                      "id": "mana_6_sub",
                      "name": "Hopelands-Tiraumea",
                      "boundaryId": "mana_6",
                      "allocationLimit": 1050
                    }
                  ]
                },
                {
                  "id": "mana_7",
                  "name": "Tiraumea",
                  "boundaryId": "mana_7",
                  "allocationLimit": 270,
                  "children": [
                    {
                      "id": "mana_7a",
                      "name": "Upper Tiraumea",
                      "boundaryId": "mana_7a",
                      "allocationLimit": 40
                    },
                    {
                      "id": "mana_7b",
                      "name": "Lower Tiraumea",
                      "boundaryId": "mana_7b",
                      "allocationLimit": 270
                    },
                    {
                      "id": "mana_7c",
                      "name": "Mangaone River",
                      "boundaryId": "mana_7c",
                      "allocationLimit": 20
                    },
                    {
                      "id": "mana_7d",
                      "name": "Makuri",
                      "boundaryId": "mana_7d",
                      "allocationLimit": 100
                    },
                    {
                      "id": "mana_7e",
                      "name": "Mangaramarama",
                      "boundaryId": "mana_7e",
                      "allocationLimit": 25
                    }
                  ]
                },
                {
                  "id": "mana_8",
                  "name": "Mangatainoka",
                  "boundaryId": "mana_8",
                  "allocationLimit": 323,
                  "children": [
                    {
                      "id": "mana_8a",
                      "name": "Upper Mangatainoka",
                      "boundaryId": "mana_8a",
                      "allocationLimit": 20
                    },
                    {
                      "id": "mana_8b",
                      "name": "Middle Mangatainoka",
                      "boundaryId": "mana_8b",
                      "allocationLimit": 60
                    },
                    {
                      "id": "mana_8c",
                      "name": "Lower Mangatainoka",
                      "boundaryId": "mana_8c",
                      "allocationLimit": 323
                    },
                    {
                      "id": "mana_8d",
                      "name": "Makakahi",
                      "boundaryId": "mana_8d",
                      "allocationLimit": 31
                    }
                  ]
                },
                {
                  "id": "mana_9",
                  "name": "Upper Gorge",
                  "boundaryId": "mana_9",
                  "allocationLimit": 2295,
                  "children": [
                    {
                      "id": "mana_9a",
                      "name": "Upper Gorge",
                      "boundaryId": "mana_9a",
                      "allocationLimit": 2295
                    },
                    {
                      "id": "mana_9b",
                      "name": "Mangapapa",
                      "boundaryId": "mana_9b",
                      "allocationLimit": 15
                    },
                    {
                      "id": "mana_9c",
                      "name": "Mangaatua",
                      "boundaryId": "mana_9c",
                      "allocationLimit": 5
                    },
                    {
                      "id": "mana_9d",
                      "name": "Upper Mangahao",
                      "boundaryId": "mana_9d",
                      "allocationLimit": 85
                    },
                    {
                      "id": "mana_9e",
                      "name": "Lower Mangahao",
                      "boundaryId": "mana_9e",
                      "allocationLimit": 85
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
                  "boundaryId": "rang_1",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "rang_1_sub",
                      "name": "Upper Rangitikei",
                      "boundaryId": "rang_1",
                      "allocationLimit": 0
                    },
                    {
                      "id": "rang_2a",
                      "name": "Middle Rangitikei",
                      "boundaryId": "rang_2a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "rang_2b",
                      "name": "Pukeokahu- Mangaweka",
                      "boundaryId": "rang_2b",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "rang_2",
                  "name": "Middle Rangitikei",
                  "boundaryId": "rang_2",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "rang_2c",
                      "name": "Upper Moawhango",
                      "boundaryId": "rang_2c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "rang_2d",
                      "name": "Middle Moawhango",
                      "boundaryId": "rang_2d",
                      "allocationLimit": 0
                    },
                    {
                      "id": "rang_2e",
                      "name": "Lower Moawhango",
                      "boundaryId": "rang_2e",
                      "allocationLimit": 0
                    },
                    {
                      "id": "rang_2f",
                      "name": "Upper Hautapu",
                      "boundaryId": "rang_2f",
                      "allocationLimit": 0
                    },
                    {
                      "id": "rang_2g",
                      "name": "Lower Hautapu",
                      "boundaryId": "rang_2g",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "rang_3",
                  "name": "Lower Rangitikei",
                  "boundaryId": "rang_3",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "rang_3a",
                      "name": "Lower Rangitikei",
                      "boundaryId": "rang_3a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "rang_3b",
                      "name": "Makohine",
                      "boundaryId": "rang_3b",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "rang_4",
                  "name": "Coastal Rangitikei",
                  "boundaryId": "rang_4",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "rang_4a",
                      "name": "Coastal Rangitikei",
                      "boundaryId": "rang_4a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "rang_4b",
                      "name": "Tidal Rangitikei",
                      "boundaryId": "rang_4b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "rang_4c",
                      "name": "Porewa",
                      "boundaryId": "rang_4c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "rang_4d",
                      "name": "Tutaenui",
                      "boundaryId": "rang_4d",
                      "allocationLimit": 0
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
                  "boundaryId": "whai_1",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whai_1_sub",
                      "name": "Upper Whanganui",
                      "boundaryId": "whai_1",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "whai_2",
                  "name": "Cherry Grove",
                  "boundaryId": "whai_2",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whai_2a",
                      "name": "Cherry Grove",
                      "boundaryId": "whai_2a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_2b",
                      "name": "Upper Whakapapa",
                      "boundaryId": "whai_2b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_2c",
                      "name": "Lower Whakapapa",
                      "boundaryId": "whai_2c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_2d",
                      "name": "Piopiotea",
                      "boundaryId": "whai_2d",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_2e",
                      "name": "Pungapunga",
                      "boundaryId": "whai_2e",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_2f",
                      "name": "Upper Ongarue",
                      "boundaryId": "whai_2f",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_2g",
                      "name": "Lower Ongarue",
                      "boundaryId": "whai_2g",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "whai_3",
                  "name": "Te Maire",
                  "boundaryId": "whai_3",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whai_3_sub",
                      "name": "Te Maire",
                      "boundaryId": "whai_3",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "whai_4",
                  "name": "Middle Whanganui",
                  "boundaryId": "whai_4",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whai_4a",
                      "name": "Middle Whanganui",
                      "boundaryId": "whai_4a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_4b",
                      "name": "Upper Ohura",
                      "boundaryId": "whai_4b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_4c",
                      "name": "Lower Ohura",
                      "boundaryId": "whai_4c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_4d",
                      "name": "Retaruke",
                      "boundaryId": "whai_4d",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "whai_5",
                  "name": "Pipiriki",
                  "boundaryId": "whai_5",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whai_5a",
                      "name": "Pipiriki",
                      "boundaryId": "whai_5a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_5b",
                      "name": "Tangarakau",
                      "boundaryId": "whai_5b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_5c",
                      "name": "Whangamomona",
                      "boundaryId": "whai_5c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_5d",
                      "name": "Upper Manganui o te Ao",
                      "boundaryId": "whai_5d",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_5e",
                      "name": "Makatote",
                      "boundaryId": "whai_5e",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_5f",
                      "name": "Waimarino",
                      "boundaryId": "whai_5f",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_5g",
                      "name": "Middle Manganui o te Ao",
                      "boundaryId": "whai_5g",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_5h",
                      "name": "Mangaturuturu",
                      "boundaryId": "whai_5h",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_5i",
                      "name": "Lower Manganui o te Ao",
                      "boundaryId": "whai_5i",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_5j",
                      "name": "Orautoha",
                      "boundaryId": "whai_5j",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "whai_6",
                  "name": "Paetawa",
                  "boundaryId": "whai_6",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whai_6_sub",
                      "name": "Paetawa",
                      "boundaryId": "whai_6",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "whai_7",
                  "name": "Lower Whanganui",
                  "boundaryId": "whai_7",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whai_7a",
                      "name": "Lower Whanganui",
                      "boundaryId": "whai_7a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_7b",
                      "name": "Coastal Whanganui",
                      "boundaryId": "whai_7b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_7c",
                      "name": "Upokongaro",
                      "boundaryId": "whai_7c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whai_7d",
                      "name": "Matarawa",
                      "boundaryId": "whai_7d",
                      "allocationLimit": 0
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
                  "boundaryId": "whau_1",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whau_1a",
                      "name": "Upper Whangaehu",
                      "boundaryId": "whau_1a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whau_1b",
                      "name": "Waitangi",
                      "boundaryId": "whau_1b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whau_1c",
                      "name": "Tokiahuru",
                      "boundaryId": "whau_1c",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "whau_2",
                  "name": "Middle Whangaehu",
                  "boundaryId": "whau_2",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whau_2_sub",
                      "name": "Middle Whangaehu",
                      "boundaryId": "whau_2",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "whau_3",
                  "name": "Lower Whangaehu",
                  "boundaryId": "whau_3",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whau_3a",
                      "name": "Lower Whangaehu",
                      "boundaryId": "whau_3a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whau_3b",
                      "name": "Upper Makotuku",
                      "boundaryId": "whau_3b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whau_3c",
                      "name": "Lower Makotuku",
                      "boundaryId": "whau_3c",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whau_3d",
                      "name": "Upper Mangawhero",
                      "boundaryId": "whau_3d",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whau_3e",
                      "name": "Lower Mangawhero",
                      "boundaryId": "whau_3e",
                      "allocationLimit": 0
                    },
                    {
                      "id": "whau_3f",
                      "name": "Makara",
                      "boundaryId": "whau_3f",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "whau_4",
                  "name": "Coastal Whangaehu",
                  "boundaryId": "whau_4",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "whau_4_sub",
                      "name": "Coastal Whangaehu",
                      "boundaryId": "whau_4",
                      "allocationLimit": 0
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
                  "boundaryId": "tura_1",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "tura_1a",
                      "name": "Upper Turakina",
                      "boundaryId": "tura_1a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "tura_1b",
                      "name": "Lower Turakina",
                      "boundaryId": "tura_1b",
                      "allocationLimit": 0
                    },
                    {
                      "id": "tura_1c",
                      "name": "Ratana",
                      "boundaryId": "tura_1c",
                      "allocationLimit": 0
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
                  "boundaryId": "ohau_1",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "ohau_1a",
                      "name": "Upper Ohau",
                      "boundaryId": "ohau_1a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "ohau_1b",
                      "name": "Lower Ohau",
                      "boundaryId": "ohau_1b",
                      "allocationLimit": 0
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
                  "boundaryId": "owha_1",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "owha_1_sub",
                      "name": "Owahanga",
                      "boundaryId": "owha_1",
                      "allocationLimit": 0
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
                  "boundaryId": "east_1",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "east_1_sub",
                      "name": "East Coast",
                      "boundaryId": "east_1",
                      "allocationLimit": 0
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
                  "boundaryId": "west_1",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "west_1_sub",
                      "name": "Northern Coastal",
                      "boundaryId": "west_1",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "west_2",
                  "name": "Kai Iwi",
                  "boundaryId": "west_2",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "west_2_sub",
                      "name": "Kai Iwi",
                      "boundaryId": "west_2",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "west_3",
                  "name": "Mowhanau",
                  "boundaryId": "west_3",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "west_3_sub",
                      "name": "Mowhanau",
                      "boundaryId": "west_3",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "west_4",
                  "name": "Kaitoke Lakes",
                  "boundaryId": "west_4",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "west_4_sub",
                      "name": "Kaitoke Lakes",
                      "boundaryId": "west_4",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "west_5",
                  "name": "Southern Whanganui Lakes",
                  "boundaryId": "west_5",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "west_5_sub",
                      "name": "Southern Whanganui Lakes",
                      "boundaryId": "west_5",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "west_6",
                  "name": "Northern Manawatu Lakes",
                  "boundaryId": "west_6",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "west_6_sub",
                      "name": "Northern Manawatu Lakes",
                      "boundaryId": "west_6",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "west_7",
                  "name": "Waitarere",
                  "boundaryId": "west_7",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "west_7_sub",
                      "name": "Waitarere",
                      "boundaryId": "west_7",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "west_8",
                  "name": "Lake Papaitonga",
                  "boundaryId": "west_8",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "west_8_sub",
                      "name": "Lake Papaitonga",
                      "boundaryId": "west_8",
                      "allocationLimit": 0
                    }
                  ]
                },
                {
                  "id": "west_9",
                  "name": "Waikawa",
                  "boundaryId": "west_9",
                  "allocationLimit": 0,
                  "children": [
                    {
                      "id": "west_9a",
                      "name": "Waikawa",
                      "boundaryId": "west_9a",
                      "allocationLimit": 0
                    },
                    {
                      "id": "west_9b",
                      "name": "Manakau",
                      "boundaryId": "west_9b",
                      "allocationLimit": 0
                    }
                  ]
                }
              ]
            }
          ]
        }
');
