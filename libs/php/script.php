<?php 

$countryBordersGeoJSON = file_get_contents("../bin/countryBorders.geo.json");
$Borders = json_decode($countryBordersGeoJSON, true);

echo json_encode($Borders);

?>