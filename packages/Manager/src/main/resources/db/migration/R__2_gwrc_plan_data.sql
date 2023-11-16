DELETE FROM council_plan_documents
WHERE
  council_id = 9;

INSERT INTO
  council_plan_documents (council_id, source_id, document)
VALUES
  (
    9,
    'NRP_2023',
    '{
          "id": "NRP_2023",
          "name": "Natural Resources Plan",
          "regions": [
            {
              "id": "b012dd3c-6b10-4db7-a332-e25c42667238",
              "name": "Kāpiti Whaitua",
              "referenceUrl": "https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-10.pdf",
              "boundaryId": "87e15f4f1b8284a0d6f77316e45108fb1761897012ee87229ebb74f384cb65a0",
              "groundwaterLimits": [
                {
                  "id": "OtakiGW",
                  "name": "Ōtaki",
                  "areas": [
                    {
                      "id": "da928e28-6d60-4f63-9e48-4962a7d69fda",
                      "depth": "All depths",
                      "category": "B",
                      "boundaryId": "993b06e0bd3aed57449a919f166657b226a4e939c4c7c5f837195bdc62cc4d8b",
                      "depletionLimitId": "OtakiSW"
                    }
                  ],
                  "allocationLimit": 0
                },
                {
                  "id": "OtakiRiverGW",
                  "name": "Ōtaki River subcatchment",
                  "areas": [
                    {
                      "id": "204a6a90-d3a5-492b-99af-6c56507e10fe",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "2c7014f211ace8b54e793a38eebaa116ebd343fe890c78dd2255095698fb6096",
                      "depletionLimitId": "WaitohuSW"
                    },
                    {
                      "id": "177920cb-8d67-4aae-8a6a-ec4201df4eb9",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "b21ee7b2414f58912cdea0ccfae2f60e106f3906d6c1a4502d2750d5d4b7d69d",
                      "depletionLimitId": "OtakiSW"
                    },
                    {
                      "id": "98dd4ea9-63d6-4dfd-b169-5a29c87fed46",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "77fe2d5815c41b2c4b4ba684084a3beafb951a65765af5bd08246156dc535c5d",
                      "depletionLimitId": "OtakiSW"
                    }
                  ],
                  "allocationLimit": 0
                },
                {
                  "id": "RaumatiGW",
                  "name": "Raumati",
                  "areas": [
                    {
                      "id": "56d3f76d-c346-49c2-b4c2-b12f39b51c46",
                      "depth": "All depths",
                      "category": "B",
                      "boundaryId": "ebf85fed40920846683063b41af8b230d476dacbeafed77ab90801622b20b33a"
                    }
                  ],
                  "allocationLimit": 1229000
                },
                {
                  "id": "Te HoroGW",
                  "name": "Te Horo",
                  "areas": [
                    {
                      "id": "efb38129-7722-4a4d-9a08-9a42a9a7527f",
                      "depth": "All depths",
                      "category": "B",
                      "boundaryId": "f2353e6babbd049b8a46f7c91b553f92fc4bb7a8effb3f1e0ca2f30273f3d4db",
                      "depletionLimitId": "OtakiSW"
                    }
                  ],
                  "allocationLimit": 1620000
                },
                {
                  "id": "WaikanaeGW",
                  "name": "Waikanae",
                  "areas": [
                    {
                      "id": "282bea81-300f-4a5f-b79f-a5a1fca8e59c",
                      "depth": "All depths",
                      "category": "B",
                      "boundaryId": "e3c4adacb4e1f46611dff13ad712f29651bc209baf0e7a7b8d44f0dcb20ddc6d",
                      "depletionLimitId": "WaikanaeSW"
                    }
                  ],
                  "allocationLimit": 2710000
                },
                {
                  "id": "WaikanaeRiverGW",
                  "name": "Waikanae River",
                  "areas": [
                    {
                      "id": "4084237f-ef1e-4048-8834-5c552ba58d90",
                      "depth": ">20 m",
                      "category": "B",
                      "boundaryId": "d1783fc35886e4ffe0e84a198d6001e1e79f687933008ab54b2678ae4783bd1b",
                      "depletionLimitId": "WaikanaeSW"
                    },
                    {
                      "id": "14f85abf-fb7d-45b6-b6e4-3d341847b0b2",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "d1783fc35886e4ffe0e84a198d6001e1e79f687933008ab54b2678ae4783bd1b",
                      "depletionLimitId": "WaikanaeSW"
                    },
                    {
                      "id": "8c0e67d9-0f7e-4006-a703-71ba811d0bef",
                      "depth": ">20 m",
                      "category": "B",
                      "boundaryId": "a2c561c116137c2d63fb6d9f1bc8a5b777973d28b92c3e8d9264f53ef6655156",
                      "depletionLimitId": "WaikanaeSW"
                    },
                    {
                      "id": "3c60355b-e48c-4897-ad6b-3d97076df33f",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "a2c561c116137c2d63fb6d9f1bc8a5b777973d28b92c3e8d9264f53ef6655156",
                      "depletionLimitId": "WaikanaeSW"
                    },
                    {
                      "id": "993c1bf3-0d89-448a-a3ef-a6c5f61f2d07",
                      "depth": ">20 m",
                      "category": "B",
                      "boundaryId": "686c593b3bdbfe3bfedba2ad2187071b76930529b3710e26f1ab23bb7f733387"
                    },
                    {
                      "id": "348210ed-d6fc-4fc2-b4f3-b6cb1ef81b7f",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "686c593b3bdbfe3bfedba2ad2187071b76930529b3710e26f1ab23bb7f733387"
                    }
                  ],
                  "allocationLimit": 0
                },
                {
                  "id": "WaitohuGW",
                  "name": "Waitohu Stream subcatchment",
                  "areas": [
                    {
                      "id": "d1a43869-7332-44ee-9307-6ba3065adc6c",
                      "depth": ">40 m",
                      "category": "B",
                      "boundaryId": "aa11addc9b0b8deb6f9d70b6fc2d5effb8eb847235a1179e3e8f6302912603df",
                      "depletionLimitId": "WaitohuSW"
                    },
                    {
                      "id": "b42da10b-bde4-450a-89c7-ebbe5f9e12d2",
                      "depth": "0-40 m",
                      "category": "A",
                      "boundaryId": "aa11addc9b0b8deb6f9d70b6fc2d5effb8eb847235a1179e3e8f6302912603df",
                      "depletionLimitId": "WaitohuSW"
                    }
                  ],
                  "allocationLimit": 1080000
                }
              ],
              "minimumFlowLimits": {
                "limits": [
                  {
                    "id": "e5ee8b76-ab3a-492c-a48b-e78672a71ad5",
                    "limit": 140,
                    "boundaryId": "65b26d0ee0d7444fda1e284e44be5ce44e7db70d584427b64cbae78e74066436",
                    "plan_table": 10.1,
                    "description": "Waitohu Stream upstream of the coastal marine area boundary",
                    "measuredAtId": "2666"
                  },
                  {
                    "id": "1af8bb02-84b3-4895-8d50-5edec3320418",
                    "limit": 22,
                    "boundaryId": "ed0820c7eaabb6aac97b1d02a3c698485ca06923241f9d62ad0a642d70cb2476",
                    "plan_table": 10.1,
                    "description": "Mangaone Stream upstream of the coastal marine area boundary",
                    "measuredAtId": "706"
                  },
                  {
                    "id": "cce3879a-49b5-422f-982c-86074bbbf1ca",
                    "limit": 750,
                    "boundaryId": "26d4f7cfc7c3e6aaf215db5a3f95453715b100bd82a56171e7602243beaeb44a",
                    "plan_table": 10.1,
                    "description": "Waikanae River upstream of the coastal marine area boundary ",
                    "measuredAtId": "2528"
                  },
                  {
                    "id": "a2a83c72-58fe-4660-b762-e0ad5c1470d5",
                    "limit": 2550,
                    "boundaryId": "a3c143d9a2d3b0f435b82b85b1c2cfe1ef38d1cd161e16ef288ddef83f135fab",
                    "plan_table": 10.1,
                    "description": "Ōtaki River upstream of the coastal marine area boundary",
                    "measuredAtId": "1012"
                  }
                ],
                "measurementSites": [
                  {
                    "id": "706",
                    "name": "Mangaone Stream at Ratanui",
                    "geometryId": "8820723c3ad664def0beb137ebe6aa220fd0f663f453fb9b08defc88fd746487"
                  },
                  {
                    "id": "1012",
                    "name": "Ōtaki River at Pukehinau",
                    "geometryId": "933d7edde869396b5edcd18ffe84c8a4303683c34f80e6bae7f422fd5186fead"
                  },
                  {
                    "id": "2528",
                    "name": "Waikanae River at Water Treatment Plant",
                    "geometryId": "d311b2b5fd9330916c28f7aadb8ae9ff0bb5986089334eaaa856cba1151d4724"
                  },
                  {
                    "id": "2666",
                    "name": "Waitohu Stream at Water Supply Intake",
                    "geometryId": "843b48620b0bc2d62975757f4801de7ddd70337cafb92c7bf818912013775315"
                  }
                ]
              },
              "surfaceWaterLimits": [
                {
                  "id": "MangaoneSW",
                  "name": "Mangaone Stream and tributaries",
                  "boundaryId": "ed0820c7eaabb6aac97b1d02a3c698485ca06923241f9d62ad0a642d70cb2476",
                  "allocationLimit": 24
                },
                {
                  "id": "OtakiSW",
                  "name": "Ōtaki River and tributaries",
                  "boundaryId": "a3c143d9a2d3b0f435b82b85b1c2cfe1ef38d1cd161e16ef288ddef83f135fab",
                  "allocationLimit": 590
                },
                {
                  "id": "WaikanaeSW",
                  "name": "Waikanae River and tributaries",
                  "boundaryId": "26d4f7cfc7c3e6aaf215db5a3f95453715b100bd82a56171e7602243beaeb44a",
                  "allocationLimit": 220
                },
                {
                  "id": "WaitohuSW",
                  "name": "Waitohu Stream and tributaries",
                  "boundaryId": "65b26d0ee0d7444fda1e284e44be5ce44e7db70d584427b64cbae78e74066436",
                  "allocationLimit": 45
                }
              ],
              "defaultFlowManagementSite": "Refer to Policy K.P1",
              "defaultFlowManagementLimit": "Refer to Policy K.P1"
            },
            {
              "id": "0b247e41-d840-4a4e-98c3-0ff6d5c31efd",
              "name": "Te Awarua-o-Porirua Whaitua",
              "referenceUrl": "https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-9.pdf",
              "boundaryId": "8069b11b5844a90828c91fcf55deffe9665f1ac1464c54cfd1d80e389adea380",
              "defaultFlowManagementSite": "Refer to Policy P.P1",
              "defaultFlowManagementLimit": "Refer to Policy P.P1"
            },
            {
              "id": "02df17ed-041e-4bef-854d-7def4f7524d4",
              "name": "Te Whanganui-a-Tara Whaitua",
              "referenceUrl": "https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-8.pdf",
              "boundaryId": "a8280a23d2820c34344a402e008e6a48114d315c461e07b4f5ba815dc59861b9",
              "groundwaterLimits": [
                {
                  "id": "Lower HuttGW",
                  "name": "Lower Hutt",
                  "areas": [
                    {
                      "id": "a3deaeb2-2d81-417b-ad63-b34469986061",
                      "depth": "0-10 m",
                      "category": "A",
                      "boundaryId": "2e3b93cd9250adaa6a43b63cf4776a0695cf3f305253ff954521aaee09f4bf3e",
                      "depletionLimitId": "HuttSW"
                    },
                    {
                      "id": "e05a524c-3b36-41ea-98cf-b3a9a11ff35c",
                      "depth": "All depths",
                      "category": "B",
                      "boundaryId": "dd91245c1f01de5ec6fcb4bc9a413e32facd7af13165360831316a572f44b8fb",
                      "depletionLimitId": "HuttSW"
                    },
                    {
                      "id": "04484a8f-dde6-48ff-ab4d-ac7fec8b68e2",
                      "depth": ">10 m",
                      "category": "B",
                      "boundaryId": "b5a78900b6a81c584e95bf5977b2d61b1ef98537fd61d9bed9e8aa699e29e07a",
                      "depletionLimitId": "HuttSW"
                    },
                    {
                      "id": "c20f8ffe-bf66-41c1-b808-65798cbc8ed0",
                      "depth": "0-10 m",
                      "category": "A",
                      "boundaryId": "19c925fd4a2c824fcff76b312720edda6877d2224a091caf8e0614ee5ddeafb5",
                      "depletionLimitId": "HuttSW"
                    }
                  ],
                  "allocationLimit": 36500000
                },
                {
                  "id": "Upper HuttGW",
                  "name": "Upper Hutt",
                  "areas": [
                    {
                      "id": "8fadb869-7156-41ac-af76-08b2d8891a95",
                      "depth": "All depths",
                      "category": "C",
                      "boundaryId": "25cfdbb5f34d8c9d368760c0047c1ede81b811179f8c86d883a6318c0a706c9a",
                      "depletionLimitId": "HuttSW"
                    },
                    {
                      "id": "26ec721f-62be-4152-bffe-4d2a48d5b845",
                      "depth": ">50m",
                      "category": "C",
                      "boundaryId": "1f7805e11e66dbbb8b9cae7c84d3dfff35f61961331794b6ddd920630557d60d",
                      "depletionLimitId": "HuttSW"
                    },
                    {
                      "id": "1d658c4b-e7a5-43a2-af57-73fb6d70eed2",
                      "depth": "0-50m",
                      "category": "A",
                      "boundaryId": "1f7805e11e66dbbb8b9cae7c84d3dfff35f61961331794b6ddd920630557d60d",
                      "depletionLimitId": "HuttSW"
                    },
                    {
                      "id": "2a61e26e-40d5-44c3-bd9e-dea83be859e2",
                      "depth": ">50m",
                      "category": "C",
                      "boundaryId": "ae189062364de95ace3ee8391015594c6830b3df7649495a8221c4f7741eae6a",
                      "depletionLimitId": "HuttSW"
                    },
                    {
                      "id": "11d9d601-ee7f-4b0a-b02e-1676142d2c8f",
                      "depth": "0-50m",
                      "category": "B",
                      "boundaryId": "ae189062364de95ace3ee8391015594c6830b3df7649495a8221c4f7741eae6a",
                      "depletionLimitId": "HuttSW"
                    }
                  ],
                  "allocationLimit": 770000
                }
              ],
              "minimumFlowLimits": {
                "limits": [
                  {
                    "id": "701b19b8-0ac9-42ca-850f-bfb42a8ef9b7",
                    "limit": 1200,
                    "boundaryId": "8936935d0ccb80be87860bd028e8cbf05c3c60340da3a44f38c684494afa17d3",
                    "description": "Te Awa Kairangi/Hutt River Downstream of the confluence with the Pakuratahi River",
                    "measuredAtId": "434"
                  },
                  {
                    "id": "84ccb060-be93-4942-afe8-52fb7727185a",
                    "limit": 600,
                    "boundaryId": "e2878d050e48cf276fad2787cc6d4bc6367b47af2184ad97bc81be7afc1a5879",
                    "description": "Te Awa Kairangi/Hutt River Upstream of the confluence with the Pakuratahi River",
                    "measuredAtId": "454"
                  },
                  {
                    "id": "ab3a5afb-696e-4a08-9485-a1247dd0183e",
                    "limit": 100,
                    "boundaryId": "574db494ce7dac19de4818842b54650f59053db35603ebcbee83d6ebd9b8ea7f",
                    "description": "Wainuiomata River Between Manuka Track and the confluence with Georges Creek ",
                    "measuredAtId": "2589"
                  },
                  {
                    "id": "50bff41a-4006-459d-8340-6c5373a75639",
                    "limit": 100,
                    "boundaryId": "e1456834316aaa32fa33cd839db529fba0d2bc3381af5f02753bfb946d186660",
                    "description": "Orongorongo River upstream of the boundary with the coastal marine area",
                    "measuredAtId": "978"
                  },
                  {
                    "id": "4911c774-252e-4864-a512-c4fb9b17e624",
                    "limit": 300,
                    "boundaryId": "198c5deeceb5dfbd7b1037bd6a7bbe109b02f69e05701586ec9379f06d1fb295",
                    "description": "Wainuiomata River Between Georges Creek and the boundary of the coastal marine area",
                    "measuredAtId": "2588"
                  }
                ],
                "measurementSites": [
                  {
                    "id": "454",
                    "name": "Hutt River at Kaitoke",
                    "geometryId": "374fa34bae3919e81a6c5d15b7bae11c02a4c8be174d05cc1a1b42613d1927f8"
                  },
                  {
                    "id": "978",
                    "name": "Orongorongo River at Truss Bridge",
                    "geometryId": "dba440c9e0e12be14a626510f2092e8ad5d45f0c5c1bd83b31edf4a05b8e8f30"
                  },
                  {
                    "id": "2588",
                    "name": "Wainuiomata River at Leonard Wood Park",
                    "geometryId": "ca19b4a373b62a9aa9382f50e59d6dfd44edafa72d8f82c3835b6b010dd3d9d3"
                  },
                  {
                    "id": "2589",
                    "name": "Wainuiomata River at Manuka Track",
                    "geometryId": "adc62696d71df8371c390773383dbb28ffe83b01c66b9283fd99c79fa6faa4f4"
                  },
                  {
                    "id": "434",
                    "name": "Hutt River at Birchville",
                    "geometryId": "05013e41f023c2ec0208d4879d0e008e62c25689275c071e5b538fa6c6cf7fa8"
                  }
                ]
              },
              "surfaceWaterLimits": [
                {
                  "id": "WainuiomataSW",
                  "name": "Wainuiomata River and tributaries",
                  "boundaryId": "44d2d26e5f17a27977b23681ffe1cd3e92a0c68127278bd61d973f6233e6a9d8",
                  "allocationLimit": 180
                },
                {
                  "id": "HuttSW",
                  "name": "Te Awa Kairangi/Hutt River and tributaries",
                  "boundaryId": "c95603b8325afaed91bf4d6d86386b775ba976201b45b9dd84d005cbf093cff6",
                  "allocationLimit": 2140
                },
                {
                  "id": "OrongorongoSW",
                  "name": "Orongorongo River and tributaries",
                  "boundaryId": "e1456834316aaa32fa33cd839db529fba0d2bc3381af5f02753bfb946d186660",
                  "allocationLimit": 95
                }
              ],
              "defaultFlowManagementSite": "Refer to Policy TW.P1",
              "defaultFlowManagementLimit": "Refer to Policy TW.P1"
            },
            {
              "id": "493cb5ae-4086-4649-8d3a-6d41ee9fded7",
              "name": "Ruamāhanga Whaitua",
              "referenceUrl": "https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-7.pdf",
              "boundaryId": "5f4835dd489ae103689e742430de37f92067f64fe3e8dddb5ba77e39659b9808",
              "groundwaterLimits": [
                {
                  "id": "Dry RiverGW",
                  "name": "Dry River",
                  "areas": [
                    {
                      "id": "03f2e7a6-2385-4b0e-9746-6e19aebede7b",
                      "depth": "All depths",
                      "category": "B",
                      "boundaryId": "eb2608be46465f332c647e4b05afbf8b487515fd2bdeae471abfbc7ddb199da5",
                      "depletionLimitId": "Ruamahanga_LowerSW"
                    }
                  ],
                  "allocationLimit": 650000
                },
                {
                  "id": "Fernhill TiffenGW",
                  "name": "Fernhill-Tiffen",
                  "areas": [
                    {
                      "id": "3c4c5448-4d44-4127-8792-721442bec8fd",
                      "depth": "All depths",
                      "category": "C",
                      "boundaryId": "253527356aeffeab8a0d5585ba9304ddb8d7d30a6f6471a6773d17f86224df8b",
                      "depletionLimitId": "Ruamahanga_MiddleSW"
                    }
                  ],
                  "allocationLimit": 1200000
                },
                {
                  "id": "HuangaruaGW",
                  "name": "Huangarua",
                  "areas": [
                    {
                      "id": "813d6705-abb4-4844-820b-03548ca319cd",
                      "depth": ">20 m",
                      "category": "B",
                      "boundaryId": "7d6b7daf5838ed724ae25c4c873874ffa5cf8a4f94b5b3b8837614e03a95b512",
                      "depletionLimitId": "HuangaruaSW"
                    },
                    {
                      "id": "ba09d219-3602-4df6-b4e2-fcbe9ea5a4c3",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "ba9cc076210778466d6860fc3240e42ed713af0d8831d51348eb05307823bb40",
                      "depletionLimitId": "HuangaruaSW"
                    },
                    {
                      "id": "26cee948-f082-427a-adb7-1a352f58638d",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "d0b15c5604db2cbf3f66930730adf9b2dfdc6053e5fa6c9b6027ab64a158449d",
                      "depletionLimitId": "HuangaruaSW"
                    }
                  ],
                  "allocationLimit": 650000
                },
                {
                  "id": "LakeGW",
                  "name": "Lake",
                  "areas": [
                    {
                      "id": "a620d6c9-adec-4a21-88d4-312399f24460",
                      "depth": ">15 m",
                      "category": "C",
                      "boundaryId": "08f82b16b954414b00d6fb920d9f81917520b06ab67f2769ddc331865b74d014",
                      "depletionLimitId": "LakeWairarapaSW"
                    },
                    {
                      "id": "fc4b13f6-b781-44df-9b3a-6b126cd53817",
                      "depth": "0-15 m",
                      "category": "B",
                      "boundaryId": "8650709f7e1f1d6e84dfe601f3b90e5878a4315d7b689cac6a79f597545b7481",
                      "depletionLimitId": "LakeWairarapaSW"
                    }
                  ],
                  "allocationLimit": 6750000
                },
                {
                  "id": "Lower RuamahangaGW",
                  "name": "Lower Ruamāhanga",
                  "areas": [
                    {
                      "id": "da8c3d94-faa1-4c48-b44b-fdfae009f890",
                      "depth": "0-10 m",
                      "category": "A",
                      "boundaryId": "6ecee3ba2cbcb4e36ab6929a2259cc5176ee772a5cf2e0000a0e2047bcdf54db",
                      "depletionLimitId": "Ruamahanga_LowerSW"
                    },
                    {
                      "id": "a6fe7f29-4d91-4462-98d7-556aad9fdea1",
                      "depth": ">10 m",
                      "category": "B",
                      "boundaryId": "d3eb1d0cebe7548648b61701505701f6800d86cdb0d234d2f98d2f14409f0153",
                      "depletionLimitId": "Ruamahanga_LowerSW"
                    },
                    {
                      "id": "6edf7743-269b-4b23-8c90-b84de378b765",
                      "depth": "0-10 m",
                      "category": "A",
                      "boundaryId": "156b0f71e6905a0538f06dfa4798a363bd58b18de7ce4dcabc8812bfb755c030",
                      "depletionLimitId": "Ruamahanga_LowerSW"
                    }
                  ],
                  "allocationLimit": 3300000
                },
                {
                  "id": "MangatarereGW",
                  "name": "Mangatarere",
                  "areas": [
                    {
                      "id": "85d07056-7862-4e97-a3b4-907dcc824c14",
                      "depth": ">30 m",
                      "category": "C",
                      "boundaryId": "79fc88c4fd4551638cbaf1eaef780b7b51a7aac0672833f60226a755c02087e8",
                      "depletionLimitId": "MangatarereSW"
                    },
                    {
                      "id": "0c24dd00-c001-4512-9a80-c262d16e09f5",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "e394d59e648749867ba6fb4d4490d3095e8927997578566229890d9284f82b0c",
                      "depletionLimitId": "MangatarereSW"
                    },
                    {
                      "id": "096c60ad-6240-45fc-b347-72afd9aa27c7",
                      "depth": ">20 m",
                      "category": "C",
                      "boundaryId": "83a65a5ee1979d7296142f2da74806aa9207498c4cfa203ff349541c38c310eb",
                      "depletionLimitId": "MangatarereSW"
                    },
                    {
                      "id": "07f58128-b951-4d79-9c88-b2ec28e6802e",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "2cf5721b8ce0426370eada8fbb8811df0ec99b43ea52e95a083607317ba2332d",
                      "depletionLimitId": "MangatarereSW"
                    },
                    {
                      "id": "3f492d82-150c-411b-b9f5-1040dc0b1b76",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "83a65a5ee1979d7296142f2da74806aa9207498c4cfa203ff349541c38c310eb",
                      "depletionLimitId": "MangatarereSW"
                    },
                    {
                      "id": "f20bf3af-263a-4d9e-bc0f-3c4e6fd395ab",
                      "depth": "20-30 m",
                      "category": "B",
                      "boundaryId": "79fc88c4fd4551638cbaf1eaef780b7b51a7aac0672833f60226a755c02087e8",
                      "depletionLimitId": "MangatarereSW"
                    }
                  ],
                  "allocationLimit": 2300000
                },
                {
                  "id": "MartinboroughGW",
                  "name": "Martinborough",
                  "areas": [
                    {
                      "id": "0f35c050-d0d1-45ff-9f0f-8bb1881198ce",
                      "depth": "All depths",
                      "category": "C",
                      "boundaryId": "898c58d4b73c73b705561be200bd6c173b990f29449dd49aa560e83b17d4e404",
                      "depletionLimitId": "Ruamahanga_LowerSW"
                    }
                  ],
                  "allocationLimit": 800000
                },
                {
                  "id": "Middle RuamahangaGW",
                  "name": "Middle Ruamāhanga",
                  "areas": [
                    {
                      "id": "02c61414-86e8-4350-a67c-64a25d65503e",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "e3cd43854617b6997448930887c654891ec52144d32495d0b12ccd9702f9e49d",
                      "depletionLimitId": "BoothsSW"
                    },
                    {
                      "id": "c0ad3ab4-7d6a-481e-a345-3cb852e51780",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "2cb5b27d63e90cf8fdfe7c4a799d1c67d27d0fd53ed694944cc75639a3119ccf",
                      "depletionLimitId": "ParkvaleSW"
                    },
                    {
                      "id": "023c23c0-9a4d-4041-87b1-275384da9271",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "61a0401a1175076fab74da55c1764cf5df492be413931665824d10316316b1e8",
                      "depletionLimitId": "Ruamahanga_MiddleSW"
                    },
                    {
                      "id": "4178c850-d87f-488f-9c17-4bc294a89955",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "5af1365d90ae261a9ed84a1750bd1076c7a491d0004cbbed722fed222f20c071",
                      "depletionLimitId": "WaiohineSW"
                    }
                  ],
                  "allocationLimit": 0
                },
                {
                  "id": "MoikiGW",
                  "name": "Moiki",
                  "areas": [
                    {
                      "id": "197175be-f892-48ce-9571-5998981376c1",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "3378fd30ffc8274febdf2d0009d4601a4ac67dbc36b81590f39d363afdb2ccc5",
                      "depletionLimitId": "HuangaruaSW"
                    },
                    {
                      "id": "b5a08c08-c88e-4cd7-9b3e-576bfe31c200",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "2a13ad17bdfb5f1ef9982fbfbca060fda50b277c889b37bc642e87044064daac",
                      "depletionLimitId": "Ruamahanga_MiddleSW"
                    },
                    {
                      "id": "8f70414f-50fb-4fde-9438-036afa902fd9",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "8cf3837e9fe3dd559fc4bc601fe4e7fb9f4a2e25833b80a3ec2bb603c7228266",
                      "depletionLimitId": "PapawaiSW"
                    },
                    {
                      "id": "c579fc4a-52b3-44da-9d1c-42788e6c867b",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "5ee078621de727a847cc53c37c6c4f0ae74153a7806d061e45d74648fd450776",
                      "depletionLimitId": "Ruamahanga_LowerSW"
                    },
                    {
                      "id": "9cc8e149-5223-447d-aefc-dd774e8a9030",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "e287deb13dfe6c5d3befed4657d35e8886dc671220ae4450debacd5dcdd1e4e7",
                      "depletionLimitId": "Ruamahanga_LowerSW"
                    }
                  ],
                  "allocationLimit": 0
                },
                {
                  "id": "OnokeGW",
                  "name": "Onoke",
                  "areas": [
                    {
                      "id": "23fbcc27-0f23-423f-9f6e-d30396761bd9",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "c83ea8d878b72b7618ba99a342aac58c356acc1f76b8bd848a6050c1f6f517a5"
                    },
                    {
                      "id": "13ad3306-fe97-4f09-aa2f-ab08c0c7bc7e",
                      "depth": "All depths",
                      "category": "C",
                      "boundaryId": "6747b621c08db02635d91bb6da2e790eaf4ee73946b9fb0bcf79905b551b6e21"
                    }
                  ],
                  "allocationLimit": 2100000
                },
                {
                  "id": "Parkvale_ConfinedGW",
                  "name": "Parkvale",
                  "areas": [
                    {
                      "id": "330f9876-5545-4a09-8203-99bc68cff0aa",
                      "depth": ">20 m",
                      "category": "C",
                      "boundaryId": "356b9b07d7185408a399e35e3eefb0ed3045a7c801b6e90c7fb064120b5b6e7f",
                      "depletionLimitId": "ParkvaleSW"
                    },
                    {
                      "id": "5af22f58-664d-4cdb-9230-388a0b59fee4",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "356b9b07d7185408a399e35e3eefb0ed3045a7c801b6e90c7fb064120b5b6e7f",
                      "depletionLimitId": "ParkvaleSW"
                    }
                  ],
                  "allocationLimit": 1550000
                },
                {
                  "id": "TaratahiGW",
                  "name": "Taratahi",
                  "areas": [
                    {
                      "id": "82123016-944e-4207-956f-129594f1d9f7",
                      "depth": ">20 m",
                      "category": "C",
                      "boundaryId": "2f509592cd80270e934aacd98617f7279ac943b0030d1c798077fc59be3dd88e",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "2ce42857-aa79-4285-8576-348fae6358e1",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "2f509592cd80270e934aacd98617f7279ac943b0030d1c798077fc59be3dd88e",
                      "depletionLimitId": "WaingawaSW"
                    }
                  ],
                  "allocationLimit": 1400000
                },
                {
                  "id": "TauherenikauGW",
                  "name": "Tauherenikau",
                  "areas": [
                    {
                      "id": "1260dd9d-5273-480d-9c13-b6090be7d549",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "7edd9e3772c67c9d08f2f6ebdc223531157e94222287b6164eecf2ef48fb7252",
                      "depletionLimitId": "LakeWairarapaSW"
                    },
                    {
                      "id": "feb56569-5651-4a01-95df-908d7f0d41bf",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "da0297049f3e6ee364d77feb3db8fe160fb360ed1c7c2047060f91df59c07f62",
                      "depletionLimitId": "LakeWairarapaSW"
                    },
                    {
                      "id": "80b0c3d7-2479-4949-87a1-b13660749a97",
                      "depth": ">20 m",
                      "category": "B",
                      "boundaryId": "df3a7efa9c3282110402cde83849bbcdc1f2a4407422cfc9cc2bc5d8b2821470",
                      "depletionLimitId": "TauherenikauSW"
                    },
                    {
                      "id": "54012663-a406-436b-a101-0565db1a9ba5",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "f8cb30d91a89283d3b7e789fada6c09dfbdaed411b76a14b79fde42da5962c7f",
                      "depletionLimitId": "TauherenikauSW"
                    },
                    {
                      "id": "6b278f44-d90c-41d2-ba1c-065521552151",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "438deb2b09e041a14260c11c33099ee5a441ee0eb4fa6c177928c8c5495718e0",
                      "depletionLimitId": "TauherenikauSW"
                    },
                    {
                      "id": "cf43a1d2-2f03-4083-a06a-d8c9c9e9ae66",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "89d32777c818e84d6395f8ccdc5f88d8ea7fc0b90e9ed5e35ff77a6e0e352b68",
                      "depletionLimitId": "TauherenikauSW"
                    }
                  ],
                  "allocationLimit": 6600000
                },
                {
                  "id": "Te Ore OreGW",
                  "name": "Te Ore Ore",
                  "areas": [
                    {
                      "id": "e2437617-b206-4e4e-b7d1-1d7b8642e684",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "5f6db4cb7ba0c2124653ad1b86a5076eecfe708a2a59e0515cbe84504f61c168",
                      "depletionLimitId": "Ruamahanga_UpperSW"
                    },
                    {
                      "id": "9765a996-c62a-46a7-9455-65f2d3a53870",
                      "depth": ">20 m",
                      "category": "B",
                      "boundaryId": "be251ad6eea80d39e164fc0e6c1414a5c47596838a1c58c4c3699c830abb36e6",
                      "depletionLimitId": "Ruamahanga_UpperSW"
                    }
                  ],
                  "allocationLimit": 480000
                },
                {
                  "id": "Upper RuamahangaGW",
                  "name": "Upper Ruamāhanga",
                  "areas": [
                    {
                      "id": "ca481e7e-48b9-4b3e-b4f7-4e568a890c14",
                      "depth": "20-30 m",
                      "category": "B",
                      "boundaryId": "eb9b6fe5efd4420e726991f4c81f332f887c6df584e2b0a28786bba00a98a908"
                    },
                    {
                      "id": "fe439fb7-8328-495e-9d8e-2f9093222829",
                      "depth": "0-20 m",
                      "category": "C",
                      "boundaryId": "46860573370a0be49f9ec1ef439a26f59e2c8d1316abbdb7371e46439bf70e08"
                    },
                    {
                      "id": "b5ba08aa-90e6-43cf-8a5a-8860f7557539",
                      "depth": ">30 m",
                      "category": "C",
                      "boundaryId": "7dc19fe47f86e5f4e46c509878f77cd684fa97781f77a1b170575737bd549eae"
                    },
                    {
                      "id": "f4d6bda6-7456-4a6b-89fd-b062cd5834df",
                      "depth": "0-20 m",
                      "category": "C",
                      "boundaryId": "57bc995121288c9821e0ad370e6df77b3e5691a3d4faaee6c0868d57b3a12cdb"
                    },
                    {
                      "id": "5edf79c5-b45d-4b46-ae85-b988f6089e85",
                      "depth": "20-30 m",
                      "category": "B",
                      "boundaryId": "70fd5c5fc7e51b2f0e27bdb65ab45cdf4ec531fd82f062669a39e5724e68e905"
                    },
                    {
                      "id": "314932a9-2fbe-4ffc-9bef-3bb2850e0eb7",
                      "depth": "20-30 m",
                      "category": "C",
                      "boundaryId": "91617746e8f63c46b89b17e188cc1230cf2fb91b5602246a76e4a48ce44f0d09"
                    },
                    {
                      "id": "0ac1bba3-c1fa-448d-b9f0-6c98f24ef987",
                      "depth": "20-30 m",
                      "category": "C",
                      "boundaryId": "46860573370a0be49f9ec1ef439a26f59e2c8d1316abbdb7371e46439bf70e08"
                    },
                    {
                      "id": "90c2acc4-d58d-4554-8148-a3f845f9a2c0",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "6795bcec15ca50dabc705626f7220d918df960572a4fea56232192fe6257acc2",
                      "depletionLimitId": "KopuarangaSW"
                    },
                    {
                      "id": "325368c0-0df2-4e92-bfe6-0e08c736d9c6",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "05f0ad2d004101f814116f959579585b9dffba340c3a32001a14cb553a284e74",
                      "depletionLimitId": "WaipouaSW"
                    },
                    {
                      "id": "d852511e-7374-42a0-b669-bc71cb248cd3",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "93b8e9ae71d35b27b07bcd91c308912f873fd3854d80c46a71b0aac2efdbbd74",
                      "depletionLimitId": "Ruamahanga_UpperSW"
                    },
                    {
                      "id": "cf4b8155-e894-4429-b22e-fc50ef8995a8",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "52be52a52b850d906e58fd059080ad2d40c4ace9673ab5174e8697e7adcd2ffa",
                      "depletionLimitId": "Ruamahanga_UpperSW"
                    },
                    {
                      "id": "6d8710ef-2f17-463c-8e00-a210fcbcc25a",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "e3fdec268cbf50a49d6669c1d93df5b41b3e297e46d4e30d927281c78ab249e0",
                      "depletionLimitId": "Ruamahanga_UpperSW"
                    }
                  ],
                  "allocationLimit": 3550000
                },
                {
                  "id": "WaingawaGW",
                  "name": "Waingawa",
                  "areas": [
                    {
                      "id": "99088e24-260d-4f9d-b277-85d74330dded",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "07a224278fa3ccaf94afaeda72d1d360dd06429edbb6d952db064088aadef477",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "d678d79d-8eb8-4d7c-800f-1ee637d5aab5",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "b68e4762e8488f02f65a776cd1b3eea9e7b8632ee547331356197f3d33486b4b",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "474e192f-e1d3-4e06-9346-18ee33f6b045",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "0e6547ed39fee7316ff22d87621db2e11997657afd7c9cb6507804db2a25d7ca",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "6133197f-f791-4588-b8bb-e8999070bdeb",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "f894bc25495905244f0cf23475477f5aada2d317ee15d154fe837b2cd66f646e",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "0d66f4d9-c57b-41e9-981a-b0fffd432a29",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "e077c1cef2dfe81cddef1a01c1b69b58a4e520a4fb9778862cd115934bdfe06c",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "f64a3e13-eefb-45a4-bf12-02203ffc902a",
                      "depth": "0-20 m",
                      "category": "B",
                      "boundaryId": "9cfd63ae24fd04e54958362ca6e4e9bbb334d9ab17a158c39ffe4d433a65e5b2",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "8ceea820-0b65-4a47-8cbc-62e51af8d30a",
                      "depth": "0-20 m",
                      "category": "C",
                      "boundaryId": "16bb456ab670a5b721bc7e366fccf87e5f4f3b5f81c7b3cdfd544c970929c3a7",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "f268fdbc-8815-4f29-99c9-3fa4989a48bf",
                      "depth": "0-20 m",
                      "category": "C",
                      "boundaryId": "9cc2d05281b54a67b906d4df92ae7fb21409f56ef0dfed8c47b5d6e703184b84",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "19c16d82-ee6f-4fe6-b09c-9b48fa46f1d2",
                      "depth": ">30 m",
                      "category": "C",
                      "boundaryId": "a837a555db66b1da3ddff04566658efe6a2704e94047e111872ee5b4b1a9e53f",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "87eb19fb-70b5-40a6-90f9-d3c7a4a8d7d9",
                      "depth": "20-30 m",
                      "category": "B",
                      "boundaryId": "c0d4c27c44b4f29712c73034c47329147c072b0166b18cd23610af5e165fbdd2",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "1fff3c27-bc2a-444e-b53f-6db5f9ae0272",
                      "depth": "20-30 m",
                      "category": "C",
                      "boundaryId": "e077c1cef2dfe81cddef1a01c1b69b58a4e520a4fb9778862cd115934bdfe06c",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "4082419e-4262-4216-afd5-56a4f68d1a53",
                      "depth": "20-30 m",
                      "category": "C",
                      "boundaryId": "37f5ce9f37481900e0f76a79ce2e80819a036ebc5152f7cdc03c00d1405af39e",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "53b03e83-f034-45eb-a7c0-2d86959deeb7",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "22e89a4d1bbe0b1752740d320c5d156e9da32cae3822ef3a51cbc64c7926897b",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "267c1d39-b204-4141-b136-83de2e5bcf09",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "8645a68733926f9dd5d48f5137d7c436e8e96832c0858a0e4b783bc1b16c6b01",
                      "depletionLimitId": "WaingawaSW"
                    },
                    {
                      "id": "2e06acf4-7526-4d6f-9969-a00d540aea7a",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "1629caf3e5bbd49f3cdbc849b94d9588b41aec5619fc5d03c4ddd3ffdda2f712",
                      "depletionLimitId": "Ruamahanga_MiddleSW"
                    },
                    {
                      "id": "aae8caeb-92a3-4aed-83c7-d24c32ab9cc1",
                      "depth": "0-20 m",
                      "category": "A",
                      "boundaryId": "39280115927daefb66c5066035bd065a92239cd8937b170da40137dcde8ba967",
                      "depletionLimitId": "Ruamahanga_UpperSW"
                    }
                  ],
                  "allocationLimit": 1900000
                },
                {
                  "id": "WaiohineGW",
                  "name": "Waiohine",
                  "areas": [
                    {
                      "id": "8b51e22d-21c3-493f-bfbc-034d4114b19e",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "b325180256546b4e7c9cc92aa2327c308e7a3f8d59be2a0e9f63f9573f0c7928",
                      "depletionLimitId": "Ruamahanga_MiddleSW"
                    },
                    {
                      "id": "4f5b208c-4731-44ea-95e8-fd2a43b8c0e5",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "2d6b094ee0e358abf0ef220f0febf99b56e781c2097d1fc6416785f6acd87297",
                      "depletionLimitId": "PapawaiSW"
                    },
                    {
                      "id": "f0398f0e-bd24-417f-8ef5-1370a623067b",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "f4e698cdb02e08f43a609e7b6b4080ebb65fa6ce4c2fc7c828e9ba840140535f",
                      "depletionLimitId": "PapawaiSW"
                    },
                    {
                      "id": "9f71fa99-3bdb-4e0d-b41d-0cb77020c851",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "6cba7def0caad71125e7b50726f35f3541c54ca9fd07ae2d8cf4ef7691e628de",
                      "depletionLimitId": "PapawaiSW"
                    },
                    {
                      "id": "eb7c1141-c1e1-48c8-9655-b6bfb46e9b22",
                      "depth": "All depths",
                      "category": "A",
                      "boundaryId": "5190d73ca3d8b7c9de819a9db4881bff56e03e540b75ce4c58a715b79d74b9f6",
                      "depletionLimitId": "WaiohineSW"
                    }
                  ],
                  "allocationLimit": 0
                }
              ],
              "minimumFlowLimits": {
                "limits": [
                  {
                    "id": "6e43db45-620f-4d56-85a2-5cf8390a85cd",
                    "limit": 250,
                    "boundaryId": "e038ef03b6936c6b744481f6dd74027e08c38214e5895da2f54f0a3e058f0e33",
                    "description": "Waipoua River upstream of the confluence with the Ruamāhanga River",
                    "measuredAtId": "2634"
                  },
                  {
                    "id": "ceb5c5fb-fd3c-479b-b15a-e56ca1191b5b",
                    "limit": 95,
                    "boundaryId": "a87958fa1d6450b7ca9f0118bd7b8d8889a3228f8d157fa08c98285027df6d70",
                    "description": "Otukura Stream upstream of the confluence with Dock/Stonestead Creek",
                    "measuredAtId": "1045"
                  },
                  {
                    "id": "8d55bc56-2473-4621-9be7-6a8d14567a9e",
                    "limit": 2400,
                    "boundaryId": "3988543c6048d63eb01f7ce917f79fadd8255cd864219696da849cc5e0509f6f",
                    "description": "Upper and Middle Ruamāhanga River upstream of the confluence with the Waiohine River",
                    "measuredAtId": "1521"
                  },
                  {
                    "id": "0c5588e0-daa4-4f46-958e-464d13837917",
                    "limit": 100,
                    "boundaryId": "42b509675ef045937de6f344dc73d762de872dbae33117cd0095b15d0153439a",
                    "description": "Parkvale Stream upstream of the confluence with the Ruamāhanga River",
                    "measuredAtId": "1136"
                  },
                  {
                    "id": "a6affe15-61eb-495e-a52b-972eacefb192",
                    "limit": 8500,
                    "boundaryId": "f6ad7fdbbf223ba262e2a1e3473c3fc04210fea773ed3a1f3cb527b4650841ff",
                    "description": "Lower Ruamāhanga River between the boundary with the coastal marine area and the Waiohine River confluence ",
                    "measuredAtId": "1518"
                  },
                  {
                    "id": "d380cb76-8d12-4479-b996-09532ca4c29f",
                    "limit": 1100,
                    "boundaryId": "84e369c5b5e8256a47c7c0b746f45e1f57419abbc6cc6a7cc172bba3e1a52a1e",
                    "description": "Waingawa River upstream of the confluence with the Ruamāhanga River",
                    "measuredAtId": "2559"
                  },
                  {
                    "id": "f5269e8c-5db0-4176-9fce-a2887e65104c",
                    "limit": 2300,
                    "boundaryId": "296395ca5820e70e51d5df41e66cd947fa268b337872759fb2419b9f498794da",
                    "description": "Waiohine River upstream of the confluence with the Ruamāhanga River",
                    "measuredAtId": "2609"
                  },
                  {
                    "id": "8be603bd-fd0a-4baf-87e9-10dd372b6c2c",
                    "limit": 180,
                    "boundaryId": "dad310c6bbd3c999f7fa576b18c30698094605dc6dfdb9fbd4d459174e9b2863",
                    "description": "Papawai Stream upstream of the confluence with the Ruamāhanga River",
                    "measuredAtId": "1093"
                  },
                  {
                    "id": "7816e6fa-0f97-4ab6-9e0a-9b8336769f8f",
                    "limit": 1100,
                    "boundaryId": "ae383f41ef598b5381af8be7e1a661f8b28c4259a06eb37a1a18c816c441c536",
                    "description": "Tauherenikau River upstream of Lake Wairarapa",
                    "measuredAtId": "2368"
                  },
                  {
                    "id": "2cf729b8-8db3-4c06-ad60-4a4f209bfd53",
                    "limit": 240,
                    "boundaryId": "5e77850b98e2bf078c0a9d2ef64d06a49119765bc503fc2e5dfbed189c47c990",
                    "description": "Upstream of Belvedere road bridge",
                    "measuredAtId": "758"
                  },
                  {
                    "id": "44e53604-0470-47be-9600-c2ff5841f26f",
                    "limit": 200,
                    "boundaryId": "ab19c63d84d22ce9d6f4fe3e02da70100799ff1204dc9b51d45d7b514528ff7b",
                    "description": "Between the confluence with the Waiohine River and the Belvedere Road bridge",
                    "measuredAtId": "758"
                  },
                  {
                    "id": "b37eaeec-3dbb-42f8-a7aa-4e37391277f9",
                    "limit": 270,
                    "boundaryId": "c806df38e88df06e7b3e0f638b2442e6848d7b035cbab17c9dac34b95af633e6",
                    "description": "Kopuaranga River upstream of the confluence with the Ruamāhanga River",
                    "measuredAtId": "597"
                  }
                ],
                "measurementSites": [
                  {
                    "id": "2634",
                    "name": "Waipoua River at Mikimiki Bridge",
                    "geometryId": "af53f8a2b9e02528e4ed67e47e748224b80d57d025a5f8fe32109b4262b3758f"
                  },
                  {
                    "id": "1518",
                    "name": "Ruamāhanga River at Waihenga Bridge",
                    "geometryId": "bc3e5022f9d2db5f80509a635a6f7c34a558224a3430129750fd8a6fb46a6a8b"
                  },
                  {
                    "id": "1521",
                    "name": "Ruamāhanga River at Wardells",
                    "geometryId": "f53a835d276a7f4273d69b3767ff7ed380155e0485bd13ca200dd95634346d2a"
                  },
                  {
                    "id": "2368",
                    "name": "Tauherenikau at Gorge",
                    "geometryId": "d6f662756877123819664021407337463386d5530bc22b63b8d61cb69ba7045b"
                  },
                  {
                    "id": "2559",
                    "name": "Waingawa River at Kaituna",
                    "geometryId": "0f6c6448aea38d1553ac08bfd41066d0687c32b9202cc22b1b57dab86aa6d5cc"
                  },
                  {
                    "id": "2609",
                    "name": "Waiohine River at Gorge",
                    "geometryId": "fa6a77a0f8a5fe7f91e15f650cee371369e0b2b66df533400b79ae48ddb3e114"
                  },
                  {
                    "id": "597",
                    "name": "Kopuaranga at Palmers Bridge",
                    "geometryId": "1cf326c37c789a5a00f2d0279def3dcfbb25099881380bd8ba4caa40a260692a"
                  },
                  {
                    "id": "758",
                    "name": "Mangatarere River at Gorge",
                    "geometryId": "db2b3e18d0c8852e52c7bf788e13fddc8a522e7fc39fb416f1eb612582e669d3"
                  },
                  {
                    "id": "1045",
                    "name": "Otukura Stream at Weir",
                    "geometryId": "000ddc566df46403e4a83fb6cd0510d84b10b2b2a7a4f52d51ceb27bbb07d67b"
                  },
                  {
                    "id": "1093",
                    "name": "Papawai Stream at Fabians Road",
                    "geometryId": "d668e49d488c1c461516cdec7f7ee171f393425abe26a96d9044e5e0c5dcd72b"
                  },
                  {
                    "id": "1136",
                    "name": "Parkvale Stream at Renalls Weir",
                    "geometryId": "dd9a032e5dbf8b9cb8ff3e29b7eab877c652bc9f4796481a4ca1d5bc1a37bee1"
                  }
                ]
              },
              "surfaceWaterLimits": [
                {
                  "id": "RuamahangaTotalSW",
                  "name": "Ruamāhanga River and tributaries, upstream of (but not including) the confluence with the Lake Wairarapa outflow",
                  "children": [
                    {
                      "id": "BoothsSW",
                      "name": "Booths Creek and tributaries",
                      "boundaryId": "b76f0b4c6771d94dbb637ac983500651df8660b6a614a6892fdf7eed5d44e5d1",
                      "allocationLimit": 25
                    },
                    {
                      "id": "KopuarangaSW",
                      "name": "Kopuaranga River and tributaries",
                      "boundaryId": "c806df38e88df06e7b3e0f638b2442e6848d7b035cbab17c9dac34b95af633e6",
                      "allocationLimit": 180
                    },
                    {
                      "id": "MangatarereSW",
                      "name": "Mangatarere Stream and tributaries",
                      "boundaryId": "e4ff5780476cf451e610cc43f91e552aec93809b306c128f6a5c50d983dcf4ce",
                      "allocationLimit": 110
                    },
                    {
                      "id": "ParkvaleSW",
                      "name": "Parkvale Stream and tributaries",
                      "boundaryId": "5d258ee90fd8373c2f5a9691e9c0ed9b03fed6bc305b145fc0a3888ce0a40910",
                      "allocationLimit": 40
                    },
                    {
                      "id": "WaingawaSW",
                      "name": "Waingawa River and tributaries",
                      "boundaryId": "84e369c5b5e8256a47c7c0b746f45e1f57419abbc6cc6a7cc172bba3e1a52a1e",
                      "allocationLimit": 920
                    },
                    {
                      "id": "WaipouaSW",
                      "name": "Waipoua River and tributaries",
                      "boundaryId": "e038ef03b6936c6b744481f6dd74027e08c38214e5895da2f54f0a3e058f0e33",
                      "allocationLimit": 145
                    },
                    {
                      "id": "HuangaruaSW",
                      "name": "Huangarua River and tributaries",
                      "boundaryId": "7da4215c428766fb1763fa4354f2c1abffe8d50af908d0a2f27372fcb5408517",
                      "allocationLimit": 110
                    },
                    {
                      "id": "Ruamahanga_MiddleSW",
                      "name": "Ruamāhanga River and tributaries upstream of the confluence with the Papawai Stream",
                      "boundaryId": "7065d1da29f6abe20a5574aa81159a9fe8bd2012610786d7581d0b7751d6f518",
                      "allocationLimit": 1240
                    },
                    {
                      "id": "Ruamahanga_UpperSW",
                      "name": "Ruamāhanga River and tributaries upstream of the confluence with the Waingawa River",
                      "boundaryId": "cbe2f64766fb5f963b5b2c293d94d1ed55ee5cd54ca2fd475c1af15bc2b3d791",
                      "allocationLimit": 1200
                    },
                    {
                      "id": "PapawaiSW",
                      "name": "Papawai Stream and tributaries",
                      "boundaryId": "dad310c6bbd3c999f7fa576b18c30698094605dc6dfdb9fbd4d459174e9b2863",
                      "allocationLimit": 105
                    },
                    {
                      "id": "Ruamahanga_LowerSW",
                      "name": "Lower Ruamāhanga River and tributaries upstream of (but not including) the confluence with the Lake Wairarapa outflow",
                      "boundaryId": "f94d3ee10d7fe8900d2944d32ecdb87c0c088a5f4b80a178373c0b84af96e41a",
                      "allocationLimit": 1370
                    },
                    {
                      "id": "WaiohineSW",
                      "name": "Waiohine River and tributaries",
                      "boundaryId": "296395ca5820e70e51d5df41e66cd947fa268b337872759fb2419b9f498794da",
                      "allocationLimit": 1590
                    }
                  ],
                  "boundaryId": "d96efd7e8e50ff0e36f6c44f730faa0dedd9f84bb9225a3a3d9aab28d1e8907b",
                  "allocationLimit": 7430
                },
                {
                  "id": "LakeWairarapaSW",
                  "name": "Lake Wairarapa and tributaries above the confluence of the Lake Wairarapa outflow with the Ruamāhanga River",
                  "children": [
                    {
                      "id": "TauherenikauSW",
                      "name": "Tauherenikau River and tributaries",
                      "boundaryId": "505b3568249348ac4b0230f8a8589a6ca32734779c3ef28f5da59ffd44f97ef5",
                      "allocationLimit": 410
                    },
                    {
                      "id": "OtukuraSW",
                      "name": "Otukura Stream and tributaries above the confluence with Dock/Stonestead Creek",
                      "boundaryId": "a87958fa1d6450b7ca9f0118bd7b8d8889a3228f8d157fa08c98285027df6d70",
                      "allocationLimit": 30
                    }
                  ],
                  "boundaryId": "ba0938cd9149a91f3747a5f9908bfa87dcba39267e8d96137e07bc8e419d06f2",
                  "allocationLimit": 1800
                }
              ],
              "defaultFlowManagementSite": "Refer to Policy R.P1",
              "defaultFlowManagementLimit": "Refer to Policy R.P1"
            },
            {
              "id": "ab941729-fc03-4359-a226-2a6ce8c4ab45",
              "name": "Wairarapa Coast Whaitua",
              "referenceUrl": "https://www.gw.govt.nz/assets/Documents/2023/07/Chapter-11.pdf",
              "boundaryId": "4cb6c6190e686a5c3d64d062b9ce854d540a0774b4aba8542a9152b05f344727",
              "defaultFlowManagementSite": "Refer to Policy WC.P1",
              "defaultFlowManagementLimit": "Refer to Policy WC.P1"
            }
          ],
          "defaultGroundwaterLimit": "Refer to Policy P121 of NRP",
          "defaultSurfaceWaterLimit": "Refer to Policy P121 of NRP"
        }
        '
  );