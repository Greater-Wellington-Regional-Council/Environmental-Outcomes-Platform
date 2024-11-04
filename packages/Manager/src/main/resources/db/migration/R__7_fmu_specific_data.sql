UPDATE freshwater_management_units
SET
    implementation_ideas = jsonb_build_object(
            'value',
            '<ul><li>Consider wetlands for water quality treatment before discharges reach the stream</li>' ||
            '<li>Setbacks from depressions and waterways should be necessary for intensive land uses ' ||
            'including winter grazing and winter cropping</li>' ||
            '<li>Riparian planting should be undertaken in strategic spots, including to provide shade to help ' ||
            'improve periphyton and macrophyte problems</li>' ||
            '<li>Good management of stock access to streambanks and of winter grazing may prove important in ' ||
            'this catchment</li></ul>',
            'type', 'html'
                           ),
    cultural_overview = jsonb_build_object(
            'value',
            '<p class="mt-2">Mana whenua are Ngāti Kahungunu ki Wairarapa, who have Hurunui marae and Pahikitea pa located ' ||
            'within the catchment, and Rangitāne o Wairarapa. Ngāti Kahungunu at marae level (Hurunui marae), note the following:' ||
            '<ul>' ||
            '<li>Mana Whenua view Parkvale stream and Taratahi water race as one</li>' ||
            '<li>The industrial zone needs further investigation regarding its potential contribution to nitrate levels</li>' ||
            '<li>Wetlands have had a key role to play in the past and now in terms of cleaning water, as ' ||
            'a growing and nurturing zone, a carbon sink, and a collection point for sediment.</li>' ||
            '</ul></p>',
            'type', 'html'
                        )
WHERE fmu_name1 = 'Parkvale Stream';