const hstnCords = [29.749907, -95.358421];
const hstnBtn = document.getElementsByClassName('btn-primary');
const atlBtn = document.getElementsByClassName('btn-secondary'); 
const locationSearch = document.getElementsByClassName('d-flex');
const locationSearchTxt = document.getElementsByClassName('form-control');
const searchBtn = document.getElementsByClassName('btn-outline-success');
const placePhotoDiv = document.getElementById('placePhotoDiv');
const apiKey = 'AIzaSyDpPhRRGd5kjFCKAuAzDFX3MOeM9DXFqZE';

// window.addEventListener('DOMContentLoaded', (e) => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition
//     }
// })

// async function getPhoto() {
//     let response = await fetch(`https://maps.googleapis.com/maps/api/place/photo
//     ?maxwidth=200
//     &photo_reference=${placePhoto}
//     &key=${apiKey}`)
//     let photoData = await response.json();
//     console.log(photo_reference)
//     const placeImg = document.createElement('img'); 
//     // placeImg.src = 
// }

function initMap() {
    var houston = new google.maps.LatLng(29.749907, -95.358421);

    var request = {
        query: `${locationSearchTxt}`,
        fields: ['name', 'geometry', 'photos']
    };

    service = new google.maps.places.PlacesService(locationSearch[0]);

    service.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            var placePhoto = results.photos.photo_reference
            console.log(placePhoto)
        }
    })
}
 initMap();
// searchBtn.addEventListener('click', (e) => {
//     textSearch();
// })