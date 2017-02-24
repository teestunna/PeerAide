var slider;
var images = [
"../img/balloon.png",
"../img/stars.png",
"../img/grass.png",
"../img/owl.png",
"../img/moon.png"
];

var index = 0;
var transitionSpeed = 500;
var imageIntervals = 5000;

var startIntervals;
var intervalSetTime;
var contentOpen = false;

$(document).ready(function() {
    
  
    function balloon(){
        var el=$('.balloon');
        if(el.hasClass('show')){
            el.removeClass('show').addClass('hide').removeClass('fadeInUp');
            el.addClass('animated fadeOutUp');
        }else{
            el.removeClass('hide').addClass('show').removeClass('fadeOutUp');
            el.addClass('animated fadeInUp');
        }
   
        setTimeout(balloon,4000);
    };            
    balloon();
           
                                         
	
    $(function() {
		
        $.preload(images, {
            init: function(loaded, total) {
                $("#indicator").html("<img src='../img/load.gif' />");			
            },
			
            loaded_all: function(loaded, total) { 
                $('body').height($(window).height());
                            
                $('#indicator').fadeOut('slow', function() {
                    $('body').addClass('gradient');
                                  
                    $('.stars').pan({
                        fps: 30, 
                        speed: 1, 
                        dir: 'left', 
                        depth: 70
                    });
                                
                    $('.init').fadeIn(function(){
                        $(this).removeClass('init');
                        $('.moon').addClass('animated bounceInDown');
                                      
                                       
                              setTimeout(function(){
                                       $('.owl').plaxify({"xRange":100,"yRange":0}) 
                                $('.grass').plaxify({"xRange":10})   
                            $.plax.enable(); 
                                  },1000)    
                                                   
                                   
                                        
                                      
                                       
                    })
                                         
                                        
                                        
					
                });
            }
        });
    });
 

})

$(window).resize(function() {
    $('body').height($(window).height());
});
