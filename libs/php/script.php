<?php

require('../../keys/keys.php');

$eta=-hrtime(true);

    $nodes = array(
        'https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['lat'] . '%2C+' . $_REQUEST['lng'] . '&key=' . $apiKey['openCage'],
        'https://api.openweathermap.org/data/2.5/onecall?lat=' . $_REQUEST['lat'] . '&lon=' . $_REQUEST['lng'] . '&units=metric&appid=' . $apiKey['openWeatherMap'],
        'http://api.geonames.org/findNearbyWikipediaJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=' . $apiKey['geonames']
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

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "mission saved";
    $eta1 = $eta + hrtime(true);
    $output['status']['returnedIn']['reverse']=$eta1/1e+6 . 'ms';
    $output['data'] = $results;

$eta+=hrtime(true);
$output['status']['returnedIn']['full']=$eta/1e+6 . 'ms';

$countryBordersGeoJSON = file_get_contents("../bin/countryBorders.geo.json");

$output["borders"] = json_decode($countryBordersGeoJSON, true);

echo json_encode($output);

?>