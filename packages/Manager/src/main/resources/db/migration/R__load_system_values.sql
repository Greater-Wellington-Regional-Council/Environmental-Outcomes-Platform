INSERT INTO system_values (council_id, value_name, value_as_json, created_at, updated_at)
VALUES
    (
        9,
        'cccv.culturalOverview.parkvale',
        jsonb_build_object(
                'value', $$<p className="mt-2">Mana whenua are Ngāti Kahugnunu ki Wairarapa, who have Hurunui marae and Pahikitea pa located
             within the catchment, and Rangitāne o Wairarapa.
             Ngāti Kahugnunu at marae level (Hurunui marae), note the following:
             <ul>
                 <li>Mana Whenua view Parkvale stream and Taratahi water race as one</li>
                 <li>The industrial zone needs further investigation from the idea that this area is
                     contributing to nitrate levels
                 </li>
                 <li>Wetlands have had a key role to play in the past and now in terms of cleaning water, as
                     a growing and nurturing zone, a carbon sink and as a collection point for sediment.
                 </li>
             </ul>
         </p>$$
        ),
        NOW(),
        NOW()
    )
ON CONFLICT (council_id, value_name)
    DO UPDATE
    SET value_as_json = excluded.value_as_json,
        updated_at = NOW();

-- R__insert_system_value_cccv_cultural_overview_with_html.sql

INSERT INTO system_values (council_id, value_name, value_as_json, created_at, updated_at)
VALUES
    (
        9,
        'cccv.whaituaOverview.ruamahanga',
        jsonb_build_object(
                'value', $$<p>The Ruamāhanga is the largest flowing body of water in the Wellington region. It extends from Pukematawai, a peak in the north-western Tararua Range, to Wairarapa Moana in south-eastern Wairarapa. This is a journey of more than 130 kilometres, taking in many thousands of hectares of land and a myriad of water bodies, large and small. Along the way the flow of Ruamāhanga is at times strengthened, as it receives water from many tributaries, and at others diminished, as water is given to the land, forming springs and streams that ultimately return to the main stem.</p><p>The mana of Wairarapa Moana is the mana of Wairarapa, the second largest freshwater body in the North Island and an internationally significant wetland. Wairarapa takes its name from Wairarapa Moana, “the glistening waters” named by Haunui a Nanaia some 800 years ago. The Wairarapa Moana persona, culture and history are fundamental to iwi identity and the story of Wairarapa settlement and development since that time.&nbsp;The Ruamahanga Whaitua is split into various freshwater management units, addressing specific issues within individual tributaries.</p>$$
        ),
        NOW(),
        NOW()
    )
ON CONFLICT (council_id, value_name)
    DO UPDATE
    SET value_as_json = excluded.value_as_json,
        updated_at = NOW();


