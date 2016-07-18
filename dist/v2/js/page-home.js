'use strict';

var pageHomeHot = new Component('.page-home-section[section="hot"]', 'page-home-section-init', function (el) {
    var $el = $(el);
    $el.data('slider', new Slider(el, {
        'callbackSlideInit': function callbackSlideInit(i, slide) {
            var $slide = $(slide).attr('data-order', i + 1),
                imgLoading = 0,
                $imgs = $slide.find('img');

            var loader = $('<div class="loading vmiddle"><span class="loader-circle vmiddle-body"></span></div>').prependTo($slide);

            function imgReady() {
                loader.remove();
            }
            if ($imgs.length) {
                imgLoading = $imgs.length;
                $imgs.each(function (j, img) {
                    imgOk(img, function (evt) {
                        imgLoading--;
                        if (!imgLoading) imgReady();
                    });
                });
            } else {
                imgReady();
            }
        }
    }));
});

var pageHomeHot = new Component('.page-home-section[section="recommended"]', 'page-home-section-init', function (el) {
    var $cover = $(el).find('.cover');
    if (!$cover || !$cover.length) return !1;

    var $img = $cover.find('img');
    if (!$img || !$img.length) return !1;

    $cover.css('background-image', 'url(' + $img.attr('src') + ')');
});