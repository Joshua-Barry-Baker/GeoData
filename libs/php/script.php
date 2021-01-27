<?php 
require('../../keys/keys.php');

$countryBordersGeoJSON = file_get_contents("../bin/countryBorders.geo.json");
$data["borders"] = json_decode($countryBordersGeoJSON, true);

echo json_encode($data);

?>