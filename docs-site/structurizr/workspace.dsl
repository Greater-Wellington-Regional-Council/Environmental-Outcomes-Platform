workspace "EOP - Plan Limits Viewer" {

    model {
        user = person "User" "A person wanting to understand what NRPlan Limits apply to a area."

        enterprise "EOP" {
            planLimitsSystem = softwareSystem "Plan Limits" "The system for prodiving Plan Limits information." {

                frontend = container "Single-Page Application" "Provides ability for users to find which limits apply to what areas via a map interface." "Typescript / React" "Web Browser"
                backend = container "Server Application" "Exposes Limits and Geospatial data via API. Keeps data store in sync with GIS Systems." "Kotlin / Spring Boot" {
                    controllerGraph = component "Graph API Controller" "Allow access to data in the system." "Spring GraphQL Controller"
                    fetcherGis = component "Data Fetcher - GIS" "Keeps data store in sync latest version of data from the GIS system" "Spring Scheduled Http Sync"
                    loaderPlanLimits = component "Loader - Plan Limits" "Loads data store with the static plan limits data (SQL Scripts)" "Redgate Flyway"
                }
                database = container "Database" "Persistant storage for the Plan limits and Geospatial data, alloing for the Limits and Geospatial " "Postgis" "Database"
                datamodel = container "Data Model" "ERD describing the data model to support the plan limits system." {
                    sites = component "Sites" "A monitoring / management site"
                    rivers = component "Rivers" "A river on the network"
                    catchments = component "Catchments" "A hydrological catchment for water"
                    minimumFlows = component "Minimum Flow limits" "A minimum flow defined in the plan"
                    allocationAmounts = component "Allocation amounts" "Water that can be allocated"
                    groundWaterZones = component "Groundwater Zones" "Groundwater zones"
                    }
            }
        }

        group "GWRC" {
            gis = softwaresystem "GWRC GIS System" "The GWRC GIS system(s)" "Existing System"
            plan = element "GWRC NRPlan" "Documents" "The Natural Resources Plan" "Document"
        }

        group "Toitū Te Whenua LINZ" {
            basemaps = softwaresystem "LINZ Basemaps System" "The LINZ Basemaps" "Existing System"
        }

        # Relationships to Systems
        user -> planLimitsSystem "Uses"
        planLimitsSystem -> gis "Geospatial boundaries pulled from"
        planLimitsSystem -> plan "Plan limits pulled out of, manually digitized and stored"

        # Relationships to Containers
        user -> frontend "Visits Plan limits viewer using"

        # Relationships to Components
        frontend -> controllerGraph "Makes API calls to" "GraphQL/HTTPS"
        frontend -> basemaps "Loads basemaps from" "JSON and WEBP/HTTPS"
        fetcherGis -> database "Stores to" "JDBC"
        fetcherGis -> gis "Syncs spatial features from" "JSON/HTTPS"
        loaderPlanLimits -> database "Stores to" "JDBC"
        database -> controllerGraph "Reads from" "JDBC"

        # Data Model Relationships
        sites -> rivers "monitor"
        rivers -> catchments "are part of"
        minimumFLows -> sites "are measured at"
        minimumFLows -> catchments "Have an effect on water use in"
        allocationAmounts -> catchments "Belong to"
        allocationAmounts -> groundWaterZones "Belong to"
    }

    views {

        systemContext planLimitsSystem "SystemContext" {
            include *
            autoLayout lr 400 400
        }

        container planLimitsSystem "SystemContainers" {
            include *
            autolayout lr 400 400
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
