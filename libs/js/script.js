function getMap() {
    var map = L.map('mapid').setView([51, -0.09], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

}
function getCountryBorders(){
    console.log();
    $.ajax({
        
        url: "libs/php/script.php",
        type: 'POST',
        dataType: 'JSON',

    success: function(result) {
        console.log('success');
        
        console.log(result);
    },
    error: function(jqXHR, textStatus, errorThrown){
        console.log('error');
        console.log(jqXHR, textStatus, errorThrown)
    }
    });
}