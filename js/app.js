// The data input
var initList = [
  {title:"Oriental Pearl Tower", location: {lat:31.239689, lng:121.499755}, visibility: true},
  {title:"Shanghai Ocean Aquarium", location:{lat:31.240696, lng:121.501759}, visibility: true},
  {title:"Shanghai Disneyland", location:{lat:31.145279, lng:121.657289}, visibility: true},
  {title:"The Bund, Shanghai", location:{lat:31.240261, lng:121.490577}, visibility: true},
  {title:"Yu Garden", location:{lat:31.227236, lng:121.492094}, visibility: true},
  {title:"Shanghai Tower", location:{lat:31.233502, lng:121.505763}, visibility: true}
];

// The model
var Place = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
  this.visibility = ko.observable(data.visibility);
};

// The callback init function
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: {lat:31.239689, lng:121.499755},
    zoom: 15,
    //styles: styles,
    //mapTypeControl: false
  });

  // Make the infoWindow
  var infoWindow = new google.maps.InfoWindow();

  // Make the markers
  var markers = [];
  for (var i=0; i<initList.length; i++){
    var marker = new google.maps.Marker({
      position: initList[i].location,
      title: initList[i].title,
      animation: google.maps.Animation.DROP,
      map: map,
      id: i
    });
    markers.push(marker);
    marker.addListener("click", function(){
      populateInfoWindow(this, infoWindow);
      toggleBounce(this);
      zoomToArea(this);
    })
  }
  
  // Bounce the marker when clicked. Stop the bouncing when clicked again.
  function toggleBounce(marker){
    for (var i=0; i < markers.length; i++){
      markers[i].setAnimation(null);
    }
    if(marker.getAnimation()!==null){
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  // The view model
  var ViewModel = function() {
    var self = this;

    this.placeList = ko.observableArray([]);

    for (var i=0; i<initList.length; i++){
      self.placeList.push(new Place(initList[i]));
    }
    // Create a ko object for data-bind: filter
    this.filter = ko.observable("");
    // Computed observables are functions that are dependent on one or more other observables, and will automatically update whenever any of these dependencies change.
    this.filterPlaces = ko.computed(function(){
      for (var j=0; j<initList.length; j++){
        // javascript indexof() function is case sensitive
        var filterValue = self.filter().toLowerCase();
        var toBeMatched = self.placeList()[j].title().toLowerCase();
        // Filter for the list element
        self.placeList()[j].visibility(toBeMatched.indexOf(filterValue)>=0);
        //Filter for the marker
        if(toBeMatched.indexOf(filterValue)>=0){
          markers[j].setMap(map);
        } else {
          markers[j].setMap(null);
        }
      }
    }, this)
  };

  ko.applyBindings(new ViewModel());
}
