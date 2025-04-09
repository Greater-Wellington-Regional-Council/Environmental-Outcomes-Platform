workspace "EOP - Plan Limits Viewer" {

    model {
        planLimitsUser = person "Plan Limits observer" "A person wanting to understand what NRPlan Limits apply to a area."
        planLimitshydrologist = person "Hydrologist" "A person managing the hydrological catchments and rivers."

        farmPlanCreator = person "Farm Plan Creator" "A person wanting to create a Farm Plan."
        freshwatermanagementStaff = person "Freshwater Management Staff" "A person managing FMU information."

        group "CCCV" {
            cccv = softwareSystem "CCCV Application" "The system for providing FMU information." {
                cccvUI = container "CCCV UI" "The user interface for the CCCV application to find information for a Farm Plan relating to an address/FMU" "React" "Web Browser" {
                        cccvMap = component "Whaitua Map" "The map interface for the user to interact with" "React Mapbox GL"
                        cccvInfoPanel = component "FMU Info Panel" "The sidebar for the user to display information"
                        cccvAddressSearch = component "CCCV Address Search" "The search bar for the user to find physical addresses (e.g., farms)"
                        cccvPrint = component "CCCV Print" "The ability to print PDFs of catchment and site information"
                        fmuPDF = component "FMU PDF" "PDF listing FMU information" "Document"
                }
            }
        }

        group "PlanLimitsViewer" {
          planLimitsSystem = softwareSystem "Plan Limits Viewer" "The system for providing Plan Limits information." {
            planLimitsUI = container "Plan Limits UI" "Provides ability for users to find which limits apply to what areas via a map interface." "Typescript / React" "Web Browser"
          }
        }

        group "EOP/He Kākāno" {
            EOPHub = softwareSystem "EOP Hub" "The EOP Hub system" "Existing System" {
                backend = container "Management API" "Exposes Limit, Consent and Geospatial data via API. Keeps database in sync with GIS Systems and incoming Consent data." "Kotlin / Spring Boot" {
                    managerAPI = component "REST API" "Allow access to data in the system." "Spring Boot Endpoints"
                    fetcherGis = component "Data Fetcher - GIS" "Keeps data store in sync latest version of data from the GIS system" "Spring Scheduled Http Sync"
                    loaderPlanLimits = component "Loader - Plan Limits" "Loads data store with the static plan limits data (SQL Scripts)" "Redgate Flyway"
                }

                ingestAPI = container "Ingest API" "Exposes an Authenticated HTTP API for incoming Limit and Consent data" "Kotlin / Spring Boot" {
                }

                tileServer = container "Vector Tile Server" "Exposes Rivers data via a Vector Tile API." "Open Source Go"

                database = container "Database" "Persistant storage for the Plan limits and Geospatial data, alloing for the Limits and Geospatial " "Postgis" "Database"

                kafka = container "Kafka Broker" "Message Queue and Event Source for communication between systems"

                datamodel = container "Data Model" {
                        councils = component "Councils" "The councils defined in the plan"
                        tangataWhenuaSites = component "Tangata Whenua Sites" "The observationSites defined in the plan"
                        measurementSites = component "Measurement Sites" "A site that is used for measurement"
                        observationSites = component "Observation Sites" "A site that is used for observation"
                        rivers = component "Rivers" "A river on the network"
                        catchments = component "Catchments" "A hydrological catchment for water"
                        minimumFlows = component "Minimum Flow limits" "A minimum flow defined in the plan"
                        allocationAmounts = component "Allocation amounts" "Water that can be allocated"
                        dailyWaterUsage = component "Water used daily" "Water that has been used on a daily basis"
                        amountAllocated = component "Allocated amounts" "Water that has been allocated"
                        flowLimits = component "Flow limits" "A flow limit defined in the plan"
                        digitizedPlan = component "Digitized Plan" "The digitized plan limits"
                        planRegions = component "Plan Regions" "The regions defined in the plan"
                        planBoundaries = component "Plan Boundaries" "The boundaries defined in the plan"
                        surfaceWaterLimits = component "Surface Water Limits" "The surface water limits defined in the plan"
                        groundwaterLimits = component "Groundwater Limits" "The groundwater limits defined in the plan"
                        freshwaterManagementUnits = component "Freshwater Management Units" "The FMUs defined in the plan"
                        extraBoundaryInfo = component "Extra Boundary Info" "Extra information about boundaries"
                    }

                freshwaterManagementUnitsAPI = container "Freshwater Management Units Domain" {
                        addressesAPI = component "addresses API" "Endpoints for finding and plotting addresses" "REST"
                        fmusAPI = component "FMU API" "Endpoints for retrieving FMU info" "REST"
                        linzDataServicesProxy = component "lINZ Data Service Proxy" "Endpoints for retrieving LINZ data" "REST"
                        systemValuesAPI = component "System Values API" "Endpoints for system-wide values" "REST"
                        fmuFetcher = component "FMU Data Fetcher" "Syncs FMU data from ArcGIS" "Spring Scheduled Http Sync"
                        ttwFetcher = component "Tangata Whenua Data Fetcher" "Syncs Tangata Whenua observationSites from ArcGIS" "Spring Scheduled Http Sync"
                }
            }
        }

        # Relationships in data model
        digitizedPlan -> planRegions "Digitized Plan has regions"
        planRegions -> planBoundaries "Plan Regions have Plan Boundaries"
        planBoundaries -> extraBoundaryInfo "Plan Boundaries have extra boundary information"
        councils -> digitizedPlan "Councils have digitized plans"
        planRegions -> surfaceWaterLimits "Plan Regions have Surface Water Limits"
        planRegions -> groundwaterLimits "Plan Regions have Groundwater Limits"
        planRegions -> flowLimits "Plan Regions have Flow Limits"
        councils -> freshwaterManagementUnits "Councils have Freshwater Management Units"
        freshwaterManagementUnits -> tangataWhenuaSites "intersect Tangata Whenua Sites"
        observationSites -> Rivers "monitor"
        observationSites -> flowLimits "monitor"
        rivers -> Catchments "are part of"
        minimumFLows -> "measurementSites" "are measured at"
        minimumFLows -> "Catchments" "have an effect on water use in"
        allocationAmounts -> "catchments" "belong to"
        amountAllocated -> "catchments" "belong to"

        measurementSites -> dailyWaterUsage "measure"

        group "GWRC" {
            gis = softwaresystem "GWRC [ARC]GIS System" "The GWRC GIS system(s)" "Existing System"
            plan = element "GWRC NRPlan" "Documents" "The Natural Resources Plan" "Document"
            consents = softwaresystem "GWRC Consents" "The Consents system" "Existing System"
        }

        group "External parties and sources" {
            rec = element "NIWA REC" "Documents" "River Environment Classification (REC2) Model" "Document"
            basemaps = softwaresystem "LINZ Basemaps System" "The LINZ Basemaps" "Existing System"
            LINZDataServices = softwaresystem "LINZ Data Services" "The LINZ Data Services" "Existing System"
            mapbox = softwaresystem "Mapbox GL" "The Mapbox GL system" "Existing System"
            mapLibra = softwaresystem "MapLibra" "The MapLibra system" "Existing System"
            addressFinder = softwaresystem "AddressFinder" "The AddressFinder cloud API" "Existing System"
        }

        # Relationships to Systems
        planLimitsUser -> planLimitsSystem "Uses to understand limits from the Natural Resources Plan"
        planLimitsHydrologist -> planLimitsSystem "Uses to manage hydrological catchments and rivers"
        farmPlanCreator -> cccvUI "Uses to retrieve FMU info for Farm Plan"
        freshwatermanagementStaff -> cccvUI "Uses to monitor and provide FMU info for Freshwater Management"
        cccvMap -> mapbox "Uses to display map"
        cccvMap -> basemaps "Uses to display basemaps"
        cccvInfoPanel -> fmusAPI "Retrieves FMU information from"
        cccvAddressSearch -> addressesAPI "Gets physical address boundaries from"
        addressesAPI -> LINZDataServices "Gets LINZ address parcels from"
        addressesAPI -> addressFinder "Matches addresses information from"
        fmusAPI -> gis "Gets FMU boundaries from"

        # External Systems and sources used by the Plan Limits Viewer
        gis -> planLimitsSystem "Pulls Geospatial boundaries from"
        plan -> planLimitsSystem "Stores the digitized Plan limits"
        rec -> planLimitsSystem "Stores a copy of the REC model"
        basemaps -> planLimitsSystem "Pulls NZ Basemap imegry from"

        # External Systems and sources used by the CCCV components
        gis -> cccv "Pulls Geospatial boundaries from"
        plan -> cccv "Gets digitized catchment boundaries from"
        rec -> cccv "Gets a REC model from"
        basemaps -> cccv "Pulls NZ Basemap imagery from"

        # Relationships to Containers
        planLimitsUI -> planLimitsUser "Visits Plan limits viewer using"
        planLimitsUI -> planLimitsHydrologist "Visits Plan limits viewer using"
        ingestAPI -> kafka "Sends messages to"
        kafka -> backend "Reads messagess from"
        consents -> ingestAPI "Sends consent data to" "JSON/HTTPS"

        # Relationships to Components
        managerAPI -> planLimitsUI "Gets GeoJSON data from" "GeoJson/HTTPS"
        tileServer -> planLimitsUI "Gets rivers vector tiles from" "Protobuf/HTTPS"
        basemaps -> planLimitsUI "Loads basemaps from" "JSON and WEBP/HTTPS"

        fetcherGis -> database "Stores to" "JDBC"
        gis -> fetcherGis "Syncs spatial features from" "JSON/HTTPS"
        loaderPlanLimits -> database "Stores to" "JDBC"
        managerAPI -> database "Reads from" "JDBC"
        database -> tileServer "Reads from" "TCP"

        freshwaterManagementStaff -> gis "Uses to provide FMU text and other information"
    }

    views {
        systemContext planLimitsSystem "planLimitsSystemContext" {
            include *
            exclude cccv
            autoLayout lr 400 400
        }

        systemContext cccv "freshwaterManagementUnitsSystemContext" {
            include *
            exclude planLimitsSystem
            autoLayout lr 600 400
        }

        container planLimitsSystem "SystemContainersPLV" {
            include *           
            exclude datamodel
            exclude cccv
            autolayout lr 400 400            
        }

        container cccv "SystemContainersCCCV" {
            include *
            exclude datamodel
            exclude planLimitsSystem
            autolayout lr 1000 400
        }

        component backend "ServerComponents" {
            include *
            autolayout lr 400 400
        }
        
        component datamodel "DataModel" {
            include *
            autolayout lr 400 400
        }

        styles {
            element "Component" {
                background #85bbf0
                color #000000
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "Database" {
                shape Cylinder
            }
            element "Web Browser" {
                shape WebBrowser
            }
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }
            element "Existing System" {
                shape RoundedBox
                background #999999
                color #ffffff
            }
            element "Document" {
                shape Folder
                color #ffffff
                background #ffe9a2
            }
        }
    }
}
