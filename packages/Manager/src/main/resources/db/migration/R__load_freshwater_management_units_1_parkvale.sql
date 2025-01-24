UPDATE freshwater_management_units
SET implementation_ideas = jsonb_build_object(
        'value',
        '<ul><li>Consider wetlands for water quality treatment before discharges reach the stream</li>' ||
        '<li>Setbacks from depressions and waterways should be necessary for intensive land uses ' ||
        'including winter grazing and winter cropping</li>' ||
        '<li>Riparian planting should be undertaken in strategic spots, including to provide shade to help ' ||
        'improve periphyton and macrophyte problems</li>' ||
        '<li>Good management of stock access to streambanks and of winter grazing may prove important in ' ||
        'this catchment</li></ul>',
        'type', 'html'),
    cultural_overview    = jsonb_build_object(
            'value',
            '<p>Mana whenua are Ngāti Kahungunu ki Wairarapa, who have Hurunui marae and Pahikitea pa located ' ||
            'within the catchment, and Rangitāne o Wairarapa. Ngāti Kahungunu at marae level (Hurunui marae), note the following:' ||
            '<ul>' ||
            '<li>Mana Whenua view Parkvale stream and Taratahi water race as one</li>' ||
            '<li>The industrial zone needs further investigation regarding its potential contribution to nitrate levels</li>' ||
            '<li>Wetlands have had a key role to play in the past and now in terms of cleaning water, as ' ||
            'a growing and nurturing zone, a carbon sink, and a collection point for sediment.</li>' ||
            '</ul></p>',
            'type', 'html'),
    other_info    = jsonb_build_object(
            'value',
            '<p>Climate Change advice notes that Parkvale will increasingly be prone to drought with reduced rainfall and up to 70 days reaching 25 degrees or more annually by 2040. The change in the number of days of high and extreme forest fire danger will increase by up to 150%.</p>' ||
            '<p>Climate change will mean an increase in the volume of pests (and need for pest control) and tropical diseases.  Heat stressed cows will affect milk production so land owners may need to diversify their land use, and alter stocking rates.  Water quality will decrease due to increased evaporation and low water flows, particularly in summer (river mean annual flow discharge will decrease by up to 60% by 2040).  The lack of water will also lead to water security issues, which, combined with greater demand for water, will lead to a need for more water storage.</p>',
            'type', 'html'),
    vpo                  = jsonb_build_object(
            'value',
            '<p>The Parkvale Stream falls below the national bottom line for E. coli, which is a national driver for improvement in water quality for swimmability. Modelling shows high E. coli levels are driven through high rainfall. This indicates that mitigation efforts should focus on managing overland flow and critical source areas. The stream is used for supplying stock water, so the improvements in E. coli will have a positive effect on the economic value (stock health) as well as other values.</p>' ||
            '<p>Some parts of the Parkvale Stream have the highest nitrate levels of any monitored waterway in the Ruamāhanga catchment. Data gathered on the catchment has noted that levels of nitrate-nitrogen in ground water are generally elevated, which affects freshwater stream quality and ecology due to the inter-connected nature of the catchment’s hydrology.  Soil quality is also affected through elevated nutrients, particularly excessive phosphorus which can run off into waterways during storm events, and from intensified land use. A significant amount of flow is derived from groundwater (particularly during times of low flow) and these result in low dissolved oxygen.</p>' ||
            '<p>Soil type plays a bit part in how nutrients are held or lost within the catchment. In areas that have well drained soils, you will find a close connection to surface water and ground water. In poor drained soils, the surface water is less connected to ground water. In poorly drained soils, nutrients can stay within the soil profile for longer which gives plants more opportunity to use it, in a well-drained soil this opportunity is not the same. Nutrients are often leached into the ground water or into nearby streams before plants have a chance to use it.</p>',
            'type', 'html')
WHERE fmu_name1 = 'Parkvale Stream';