let map;
let service;
let infowindow;

function initMap() {
  const YCM = new google.maps.LatLng(18.62210032281268, 73.82146351144915);
  map = new google.maps.Map(document.getElementById('map'), {
    center: YCM,
    zoom: 17,
	mapId: 'e3bf7ae26650ba00',
  });


  const input = document.getElementById('searchTextField');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  const marker = new google.maps.Marker({
    map: map,
  });

 
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
	console.log(place)
	console.log(place.photos[0].getUrl())
    if (!place.geometry) {
      window.alert('No place selected');
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    const request = {
      location: place.geometry.location,
      radius: 500, 
      type: ['hospital','Hospital'],
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  });
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, 'click', () => {
    const infowindow = new google.maps.InfoWindow();
	infowindow.setContent(`<strong>${place.name}</strong>`);
    window.open(place.photos[0].getUrl(), "_blank");
	infowindow.open(map, marker);
  });
}

google.maps.event.addDomListener(window, 'load', initMap);
