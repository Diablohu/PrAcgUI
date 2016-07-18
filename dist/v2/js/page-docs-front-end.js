"use strict";

function trimmedHtml(element) {
    var html = $(element).html();

    var shortestIndent;
    html = html.split('\n');
    for (var i = 0; i < html.length; i++) {
        var line = html[i];

        if ($.trim(line).substring(0, 4) != "<!--") {
            var spaces = line.search(/\S/);
            if ((shortestIndent > spaces || shortestIndent == undefined) && spaces >= 0) {
                shortestIndent = spaces;
            }
        }
    }

    for (var i = 0; i < html.length; i++) {
        var line = html[i];
        if ($.trim(line).substring(0, 4) != "<!--") {
            html[i] = line.substring(shortestIndent, line.length);
        } else {
            html[i] = $.trim(line);

            for (space = 0; space < 2; space++) {
                html[i] = " " + html[i];
            }
        }
    }

    html = html.join("\n");
    return html;
}

$document.ready(function () {
    changeTheme(themes[getRandomIntInclusive(0, themes.length - 1)]);

    var $toc = $('#doc-front-end-toc-list');
    $('#doc-front-end-main > h2').each(function (index, el) {
        var $el = $(el);
        var text = $el.text();
        el.setAttribute('id', 'doc-' + text);
        $toc.append($('<li/>').append($('<a/>', {
            'html': text,
            'href': '#doc-' + text
        })));
    });

    var classnames = [];
    $('#doc-front-end-frame-header button[type="button"]').each(function (index, el) {
        var m = el.getAttribute('header-mod');
        if (m) {
            classnames.push(m);
            $(el).on('click', function () {
                $header.removeClass(classnames.join(' ')).addClass(m);
                $document.trigger('resized');
            });
        } else {
            $(el).on('click', function () {
                $header.removeClass(classnames.join(' '));
                $document.trigger('resized');
            });
        }
    });
});

$('.doc-sample').each(function (index, el) {
    var $el = $(el),
        siblings = $el.children();
    if (!siblings.length || siblings.length == 1 && siblings[0].tagName == 'FIGURE') {
        $el.addClass('mod-only-code');
        return;
    }
    var html = trimmedHtml(el).trim();
    $el.append($('<figure/>').append($('<pre/>').append($('<code/>').text(html))));
});