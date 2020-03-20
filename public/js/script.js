$(document).ready(function() {

  var div = $(".menu-wrap");

  var pos = div.position();

  $(window).scroll(function() {
    var windowpos = $(window).scrollTop();
    if (window.innerWidth > 930) {
    
      if ( pos.top+100 < windowpos  ) {
        div.addClass("AfterScroll");
        div.removeClass("BeforeScroll");
      
      } else {
        div.addClass("BeforeScroll");
        div.removeClass("AfterScroll");
      
      }
    }
    });
});

$(document).ready(function(){
  
  if(window.innerWidth < 930){
    $('.menu-wrap').addClass('AfterScroll').removeClass('BeforeScroll');
  }
});

$(window).resize(function(){
  if(window.innerWidth < 930){
    $('.menu-wrap').addClass('AfterScroll').removeClass('BeforeScroll');
  }else{
    $('.menu-wrap').addClass('BeforeScroll').removeClass('AfterScroll');
  }
});

// $('.message a').click(function(){
//   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
// });

// var map = new ol.Map({
//     target: 'map',
//     layers: [
//       new ol.layer.Tile({
//         source: new ol.source.OSM()
//       })
//     ],
//     view: new ol.View({
//       center: ol.proj.fromLonLat([11.2897, 49.2986]),
//       zoom: 11
//     })
//   });
  
//   var marker = new ol.Feature({
//     geometry: new ol.geom.Point(
//       ol.proj.fromLonLat([11.2897, 49.2986])
//     ), 
//   });
//   var vectorSource = new ol.source.Vector({
//     features: [marker]
//   });
//   var markerVectorLayer = new ol.layer.Vector({
//     source: vectorSource,
//   });
//   map.addLayer(markerVectorLayer);

  