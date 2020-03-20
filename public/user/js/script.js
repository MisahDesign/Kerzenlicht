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



  