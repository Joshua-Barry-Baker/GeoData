function getMap(lat, lng) {
    var map = L.map('mapid').setView([lat, lng], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function onMapClick(e) {

        console.log(e.latlng);
        getCountryData(e.latlng['lat'], e.latlng['lng']);
    };
    //adds the onclick lisserner
    map.on('click', onMapClick);
}

function getCountryData(lat, lng){
    $.ajax({
        
        url: "libs/php/reverseGeocoding.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            lat: lat,
            lng: lng
        },

        success: function(result) {
            console.log('success');
            console.log(result);
            //n^2 brute search
            for(let i=0; i < result.borders.features.length; i++){
                if(result.borders.features[i].properties.iso_a2 == result.dataReverse[0].results[0].components["ISO_3166-1_alpha-2"]){
                    console.log(`found border, key${i}`);
                    if(result.dataReverse[0].results[0].bounds) { //some countries such as france doesnt have
                        $.ajax({

                            url: "libs/php/Geocoding.php",
                            type: 'POST',
                            dataType: 'JSON',
                            data: {
                                isoA2: result.borders.features[i].properties.iso_a2,
                                borders: result.borders.features[i],
                                northEastLat: result.dataReverse[0].results[0].bounds.northeast.lat,
                                northEastLng: result.dataReverse[0].results[0].bounds.northeast.lng,
                                southWestLat: result.dataReverse[0].results[0].bounds.southwest.lat,
                                southWestLng: result.dataReverse[0].results[0].bounds.southwest.lng
                            },
            
                            success: function(result1) {
                                console.log(result1);
                            },
                            error: function(jqXHR, textStatus, errorThrown){
                                console.log('error');
                                console.log(jqXHR, textStatus, errorThrown)
                            }
                        })
                    } else {
                        console.log('no border bounds given');
                    }
                    break;
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('error');
            console.log(jqXHR, textStatus, errorThrown)
        }
    });
}