let $animation_elements = $(".animation-element");
let $window = $(window);
$(document).ready(function() {
    //$(".welcome .body").animate()

    $window.on("scroll resize", check_if_in_view);
    $window.trigger("scroll");
})

function check_if_in_view() {
    let window_height = $window.height();
    let window_top_position = $window.scrollTop();
    let window_bottom_position = (window_top_position + window_height);
    
    $.each($animation_elements, function() {
        let $element = $(this);
        let element_height = $element.outerHeight();
        let element_top_position = $element.offset().top;
        let element_bottom_position = (element_top_position + element_height);

        if($element.hasClass("console")) {
            console.log("Element bottom: " + element_bottom_position + " Element top: " + element_top_position);
            console.log("Window bottom: " + window_bottom_position + " Window top:" + window_top_position);
        }
        
        if($element.hasClass("js-fade-out")) {
            let maxDist = window_height/5;
            let distFromCenter = Math.abs((element_top_position + element_height/2) - (window_top_position + window_height/2));
                    
            if(distFromCenter < maxDist) {
                $element.css("opacity", "1");
            } else {
                $element.css("opacity", map(distFromCenter, maxDist, window_height * 0.9, 1, 0));
            }
        }

        if((element_bottom_position >= window_top_position) &&
           (element_top_position <= window_bottom_position)) {
            let elementAlreadyInView = $element.hasClass("in-view");
            
            $element.addClass("in-view");
            
            if(!elementAlreadyInView) {
                if(element_top_position >= window_top_position + window_height/2) {
                    $element.addClass("above");
                    $element.removeClass("below");
                } else {
                    $element.addClass("below");
                    $element.removeClass("above");
                }
            }
        } else {
            if(!$element.hasClass("title")) {
                $element.removeClass("in-view");
            }
        }
    });
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}