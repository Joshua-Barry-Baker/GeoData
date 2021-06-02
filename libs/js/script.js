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
    return map;
}

function getCountryData(lat, lng){
    let data = {};
    $.ajax({ //gets reverseGeocoding APIs
        
        url: "libs/php/reverseGeocoding.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            lat: lat,
            lng: lng
        },

        success: function(result) {
            data.reverseGeocoding = result;
            //console.log(data);
            //n^2 brute search
            for(let i=0; i < result.borders.features.length; i++){
                if(result.borders.features[i].properties.iso_a2 == result.dataReverse[0].results[0].components["ISO_3166-1_alpha-2"]){
                    console.log(`found border, key${i}`);
                    let tempBounds = {};
                    if(!result.dataReverse[0].results[0].bounds) { //some countries such dont have
                        console.log('creating bounds');
                        for(let z = 0; z < result.borders.features[i].geometry.coordinates.length; z++) {
                            for(let y = 0; y < result.borders.features[i].geometry.coordinates[z].length; y++) {
                                for(let x = 0; x < result.borders.features[i].geometry.coordinates[z][x].length; x++) {
                                    if(result.borders.features[i].geometry.coordinates[z][x][0] > tempBounds.northeast.lng) { //check lng
                                        tempBounds.northeast.lng = result.borders.features[i].geometry.coordinates[z][x][0];
                                    } else if(result.borders.features[i].geometry.coordinates[z][x][0] < tempBounds.southwest.lng){
                                        tempBounds.southwest.lng = result.borders.features[i].geometry.coordinates[z][x][0];
                                    }
                                    if(result.borders.features[i].geometry.coordinates[z][x][1] > tempBounds.northeast.lat) {//check lat
                                        tempBounds.northeast.lat = result.borders.features[i].geometry.coordinates[z][x][1];
                                    } else if(result.borders.features[i].geometry.coordinates[z][x][1] < tempBounds.southwest.lat) {
                                        tempBounds.southwest.lat = result.borders.features[i].geometry.coordinates[z][x][1];
                                    }
                                }
                            }
                        }
                        result.dataReverse[0].results[0].bounds = tempBounds;
                        console.log('made bounds');
                        console.log(result.dataReverse[0].results[0].bounds);
                    }
                    $.ajax({ //gets the restCountries API

                        url: "libs/php/restCountries.php",
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                            isoA2: result.borders.features[i].properties.iso_a2,
                        },
        
                        success: function(restCountries) {
                            data.restCountries = restCountries;
                            //console.log(data);
                            $.ajax({ //gets geocoding APIs

                                url: "libs/php/Geocoding.php",
                                type: 'POST',
                                dataType: 'JSON',
                                data: {
                                    isoA2: result.borders.features[i].properties.iso_a2,
                                    borders: result.borders.features[i],
                                    currency: data.restCountries.restCountries[0].currencies[0].code,
                                    northEastLat: result.dataReverse[0].results[0].bounds.northeast.lat,
                                    northEastLng: result.dataReverse[0].results[0].bounds.northeast.lng,
                                    southWestLat: result.dataReverse[0].results[0].bounds.southwest.lat,
                                    southWestLng: result.dataReverse[0].results[0].bounds.southwest.lng
                                },
                
                                success: function(geocoding) {
                                    data.geocoding = geocoding;
                                    //console.log(data);
                                },
                                error: function(jqXHR, textStatus, errorThrown){
                                    console.log('error');
                                    console.log(jqXHR, textStatus, errorThrown)
                                }
                            })
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            console.log('error');
                            console.log(jqXHR, textStatus, errorThrown)
                        }
                    })
                    break;
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('error');
            console.log(jqXHR, textStatus, errorThrown)
        }
    });
    console.log(data);
    return data;
}