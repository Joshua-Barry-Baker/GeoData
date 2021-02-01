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
    console.log();
    $.ajax({
        
        url: "libs/php/script.php",
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