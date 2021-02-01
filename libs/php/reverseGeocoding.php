<?php

require('../../keys/keys.php');

$countryBordersGeoJSON = file_get_contents("../bin/countryBorders.geo.json");


$eta=-hrtime(true); //start time
//API's using LngLat
$nodes = array(
    //OpenCage
    'https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['lat'] . '%2C+' . $_REQUEST['lng'] . '&key=' . $apiKey['openCage'],
    //OpenWeather
    'https://api.openweathermap.org/data/2.5/onecall?lat=' . $_REQUEST['lat'] . '&lon=' . $_REQUEST['lng'] . '&units=metric&appid=' . $apiKey['openWeatherMap'],
    //Geonames
    'http://api.geonames.org/findNearbyWikipediaJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=' . $apiKey['geonames'],
);

$node_count = count($nodes);

$curl_arr = array();
$master = curl_multi_init();

for($i = 0; $i < $node_count; $i++)
{
    $url = $nodes[$i];
    $curl_arr[$i] = curl_init($url);
    curl_setopt($curl_arr[$i], CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl_arr[$i], CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl_arr[$i], CURLOPT_URL, $url);
    
    curl_multi_add_handle($master, $curl_arr[$i]);
};

do {
    curl_multi_exec($master, $running);
} while($running > 0);

$results = array();
for($i = 0; $i < $node_count; $i++)
{
    $results[$i] = json_decode(curl_multi_getcontent($curl_arr[$i]));
};

$eta1 = $eta + hrtime(true); //How long it took to reverse geocode
$output['status']['returnedIn']['reverse']=$eta1/1e+6 . 'ms';
$output['dataReverse'] = $results; //All LngLat API data done
//*
//All borders
$output["borders"] = json_decode($countryBordersGeoJSON, true);

//Find ISO A2 from features in geoJSON

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";

echo json_encode($output);

?>