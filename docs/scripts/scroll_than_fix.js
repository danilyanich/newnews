var grab = $('#grab');
var pass = $('#pass');

$(window).scroll(function () {
    if ($(window).scrollTop() >= pass.offset().top + pass.outerHeight(true)) {
        grab.addClass('fixed');
        $('#left-button').css('margin-left', '0px');
        $('#right-button').css('margin-right', '0px');
    } else {
        grab.removeClass('fixed');
        $('#left-button').css('margin-left', '-50px');
        $('#right-button').css('margin-right', '-50px');
    }
});
