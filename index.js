'use strict';

var Promise = require('bluebird');
var humps = require('humps');
var prettydiff = require('prettydiff');

module.exports = {
    process: function (layouts, opt, Handlebars) {
        var result = {};
        layouts.forEach(function(layout) {
            var items = {};
            layout.layout.items.forEach(function(item) {
                var rules = {
                    backgroundPosition: '-' + item.x + 'px -' + item.y + 'px',
                    width: item.width + 'px',
                    height: item.height + 'px'
                };

                layout.sprites.forEach(function(sprite) {
                    if (sprite.dpi) {
                        rules['@media (-webkit-min-device-pixel-ratio: ' + sprite.ratio + '), (min-resolution: ' + sprite.dpi + 'dpi)'] = {
                            backgroundImage: "url('" + sprite.url + "')",
                            backgroundSize: sprite.width + 'px ' + sprite.height + 'px',
                        };
                    } else {
                        rules.backgroundImage = "url('" + sprite.url + "')";
                        rules.backgroundSize = sprite.width + 'px ' + sprite.height + 'px';
                    }
                });

                items[humps.pascalize(item.meta.name)] = rules;
            });

            result[humps.pascalize(layout.name)] = items;
        });
        return Promise.method(function (layouts, opt, Handlebars) {
            var source = 'export default ' + JSON.stringify(result);
            var style = prettydiff.api({
              source: source,
              lang: 'js',
              mode: 'beautify'
            })[0];

            return style;
        })();
    },
    isBeautifyable: function () {
        return false;
    },
    extension: function () {
        return 'js';
    }
};
