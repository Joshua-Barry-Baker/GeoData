<?php

$eta=-hrtime(true); //start time
//API's using ISO A2
$nodes = array(
    //RestCountries
    'https://restcountries.eu/rest/v2/alpha/'. $_REQUEST['isoA2']
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

$eta1 = $eta + hrtime(true); //How long it took to geocode
$output['status']['returnedIn']['restCountries']=$eta1/1e+6 . 'ms';
$output['restCountries'] = $results; //All geocoding API data done

//Find ISO A2 from features in geoJSON

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";

echo json_encode($output);

?>