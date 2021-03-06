
var x = document.getElementById("demo");

$('#getLocation').click(function(){
getLocation();
});

$('#search').click(function(){
var addr=$("#address").val();
getLocation_addr(addr);
});

$(document).on('click','.btn',function(e){
        var id=$(this).attr('id');
        query(id);
});  

function getLocation_addr( addr){
    $("#address").val('');
  $.ajax({
                type: 'Post',
                url:'/googleAPI',
                data: JSON.stringify({"address":addr}), 
                contentType:"application/json",
               success: function(data) {
                $('#address').html('');
                showPosition_addr(data.latitude, data.longitude);
               }
           });
}

function showPosition_addr(latitude,longitude) {
    x.innerHTML = "Latitude: " + latitude + 
    "<br>Longitude: " + longitude;
    locationID(latitude,longitude);
    //query(position.coords.latitude,position.coords.longitude);
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
    locationID(position.coords.latitude,position.coords.longitude);
    //query(position.coords.latitude,position.coords.longitude);
}




function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}
 function query( locID ){
     $.ajax({
                type: 'Post',
                url:'/query',
                data: JSON.stringify({"locationID":locID}), 
                contentType:"application/json",
               success: function(data) {
                $('.query').html('');
                $('.query').append('<table id="tb1" class="table table-condensed" ></table>');
                $('#tb1').append("<tr><th>Date</th><th>prcp</th><th>Temperature max</th><th>Temperature min</th></tr>");
                if (data.length ==0){  $('.query').append("Query returned zero record");}
                for(var i = data.length - 1; i >= 0; i--) {
                     $('#tb1').append('<tr><td>'+data[i].date+'</td><td>'+data[i].prcp+'</td><td>'+data[i].tmax+'</td><td>'+data[i].tmin+'</td></tr>');
                }
               }
           });

 }

 function locationID(lat, long){
  $.ajax({
                type: 'Post',
                url:'/location',
                data: JSON.stringify({"latitude":lat,"longitude":long}), 
                contentType:"application/json",
               success: function(data) {
                $('.city').html('');
                $('.city').append('<table id="tb2" class="table table-condensed"></table>');
                $('#tb2').append("<tr><th>name</th><th>state</th><th>latitude</th><th>longitude </th><th>Option </th></tr>");
                for(var i = data.length - 1; i >= 0; i--) {
                     $('#tb2').append('<tr><td>'+data[i].name+'</td><td>'+data[i].state+'</td><td>'+data[i].latitude+'</td><td>'+data[i].longitude+'</td><td><button type="button" class="btn" id="'+data[i].id+'">check it</button></td> </tr>');
                }

               }
           });


}

