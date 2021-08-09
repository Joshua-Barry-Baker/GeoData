<?php

$countryBordersGeoJSON = json_decode(file_get_contents("../bin/countryBorders.geo.json"));
echo json_encode($countryBordersGeoJSON);

?>