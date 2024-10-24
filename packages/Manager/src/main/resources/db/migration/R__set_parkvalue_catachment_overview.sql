UPDATE boundary_info
SET description = '<p>The Parkvale sub-catchment is located between Carterton and Masterton townships on the lowland plains of the Ruamāhanga Catchment. The Parkvale catchment is located on the lowland plains of the Valley floor streams Freshwater Management Unit group (FMU) in the Ruamāhanga Whaitua. The sub-catchment has 200 kilometres of waterways which are hydrologically complex. The streams within the parkvale catchment are fed by groundwater springs and from the Taratahi water race network which is diverted from the neighbouring Waingawa River. The catchment contains a mix of generally intense land uses; dairy & dairy support, sheep and beef, lifestyle blocks, and an industrial park located in the north-eastern area of the catchment. The Parkvale catchment is a priority catchment in the Greater Wellington Natural Resources Plan and within the Ruamahanga Whaitua Implementation Programme due to degraded water quality and ecology of the Parkvale stream.</p>'
WHERE
    council_id = '9' AND
    context = 'cccv_catchments' AND
    name = 'Parkvale Stream and Tributaries';

