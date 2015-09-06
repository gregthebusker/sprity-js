'use strict';

var Promise = require('bluebird');
var humps = require('humps');
var prettydiff = require('prettydiff');

module.exports = {
    process: function (layouts, opt, Handlebars) {
        var result = {};
        var ratio;
        var sortByDim = function (a, b) {
          return a.ratio - b.ratio;
        };

        if (opt.dimension) {
            opt.dimension.sort(sortByDim).reverse();
            opt.dimension[opt.dimension.length - 1].default = true;
            ratio = opt.dimension[opt.dimension.length - 1].ratio / opt.dimension[0].ratio;
        } else {
            ratio = 1;
        }
        var baseDim = function(size) {
            return ratio * size;
        };

        layouts.forEach(function(layout) {
            var items = {};
            layout.layout.items.forEach(function(item) {
                var rules = {
                    backgroundPosition: '-' + baseDim(item.x) + 'px -' + baseDim(item.y) + 'px',
                    width: baseDim(item.width) + 'px',
                    height: baseDim(item.height) + 'px'
                };

                layout.sprites.forEach(function(sprite) {
                    if (sprite.dpi) {
                        rules['@media (-webkit-min-device-pixel-ratio: ' + sprite.ratio + '), (min-resolution: ' + sprite.dpi + 'dpi)'] = {
                            backgroundImage: "url('" + sprite.url + "')",
                            backgroundSize: baseDim(sprite.width) + 'px ' + baseDim(sprite.height) + 'px',
                        };
                    } else {
                        rules.backgroundImage = "url('" + sprite.url + "')";
                        rules.backgroundSize = baseDim(sprite.width) + 'px ' + baseDim(sprite.height) + 'px';
                    }
                });

                items[humps.pascalize(item.meta.name)] = rules;
            });

            result[humps.pascalize(layout.name)] = items;
        });
        return Promise.method(function (layouts, opt, Handlebars) {
            var source = 'module.exports = ' + JSON.stringify(result);
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
