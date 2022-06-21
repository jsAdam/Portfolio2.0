let $animationElements = $(".animation-element");
let $window = $(window);
$(document).ready(function() {

    $window.on("scroll resize", checkIfInView);
    $window.trigger("scroll");
})

function checkIfInView() {
    
    animateAllAnimationElements();
}

function animateAllAnimationElements() {
    let windowHeight = $window.height();
    let windowTopPosition = $window.scrollTop();
    let windowBottomPosition = (windowTopPosition + windowHeight);

    $.each($animationElements, function() {
        let $element = $(this);
        let elementHeight = $element.outerHeight();
        let elementTopPosition = $element.offset().top;
        let elementBottomPosition = (elementTopPosition + elementHeight);

        if($element.hasClass("console")) {
            console.log("Element bottom: " + elementBottomPosition + " Element top: " + elementTopPosition);
            console.log("Window bottom: " + windowBottomPosition + " Window top:" + windowTopPosition);
        }
        if($element.hasClass("js-fade-out")) {
            animateFadeByDistanceElement($element, windowTopPosition, windowHeight);
        }

        if($element.hasClass("slide-animation") || $element.hasClass("slide-animation-cell")) {
            animateSlideOnViewElements($element, windowTopPosition, windowBottomPosition, windowHeight);
        }
    });
}

function animateSlideOnViewElements($element, windowTopPosition, windowBottomPosition, windowHeight) {
    let elementHeight = $element.outerHeight();
    let elementTopPosition = $element.offset().top;
    let elementBottomPosition = (elementTopPosition + elementHeight);

    if((elementBottomPosition >= windowTopPosition) &&
    (elementTopPosition <= windowBottomPosition)) {
        let elementAlreadyInView = $element.hasClass("in-view");
        
        $element.addClass("in-view");
        
        if(!elementAlreadyInView) {
            if(elementTopPosition >= windowTopPosition + windowHeight/2) {
                $element.addClass("above");
                $element.removeClass("below");
            } else {
                $element.addClass("below");
                $element.removeClass("above");
            }
        }
    } else if(!$element.hasClass("title")) {
        $element.removeClass("in-view");
    }
}

function animateFadeByDistanceElement($element, windowTopPosition, windowHeight) {
    let elementHeight = $element.outerHeight();
    let elementTopPosition = $element.offset().top;

    let maxDist = windowHeight/5;
    let distFromCenter = Math.abs((elementTopPosition + elementHeight/2) - (windowTopPosition + windowHeight/2));
            
    if(distFromCenter < maxDist) {
        $element.css("opacity", "1");
    } else {
        $element.css("opacity", scale(distFromCenter, maxDist, windowHeight * 0.9, 1, 0));
    }
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}