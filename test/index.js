'use strict';

var fs = require('fs');
var should = require('chai').should();
var Handlebars = require('handlebars');
var prettydiff = require('prettydiff');

require('mocha');

var jsProc = require('../index');

var ratio = 1;

Handlebars.registerHelper('baseDim', function (size) {
  return Math.round(size * ratio);
});

var fixture = [{
  name: 'default',
  classname: 'icon',
  layout: {
    width: 520,
    height: 656,
    items: [{
      height: 136,
      width: 136,
      x: 0,
      y: 0,
      meta: {
        type: 'png',
        fileName: 'png.png',
        name: 'png',
        height: 128,
        width: 128
      }
    }, {
      height: 520,
      width: 520,
      x: 0,
      y: 136,
      meta: {
        type: 'jpg',
        fileName: 'jpg.jpg',
        name: 'jpg',
        height: 512,
        width: 512
      }
    }]
  },
  sprites: [{
    name: 'sprite',
    url: '../images/sprite.png',
    type: 'png',
    dpi: null,
    ratio: null,
    width: 520,
    height: 656
  }]
}];







var fixture2 = [{
        "name": "testFolder1",
        "classname": "icon-testFolder1",
        "layout": {
            "height": 40,
            "width": 40,
            "items": [
                {
                    "height": 40,
                    "width": 40,
                    "meta": {
                        "base": "testFolder1",
                        "fileName": "testFolder1/test1.png",
                        "height": 32,
                        "name": "test1",
                        "path": "/Users/gregschechter/sprity-js/test/test-images/testFolder1/test1.png",
                        "type": "png",
                        "width": 32
                    },
                    "x": 0,
                    "y": 0
                }
            ]
        },
        "sprites": [
            {
                "name": "sprite-testFolder1",
                "url": "/static/sprites/styles/sprite-testFolder1.png",
                "type": "png",
                "dpi": null,
                "ratio": null,
                "width": 20,
                "height": 20,
                "baseWidth": 20,
                "baseHeight": 20
            }, {
                "name": "sprite-testFolder1@2x",
                "url": "/static/sprites/styles/sprite-testFolder1@2x.png",
                "type": "png",
                "dpi": 144,
                "ratio": 2,
                "width": 40,
                "height": 40,
                "baseWidth": 20,
                "baseHeight": 20
            }
        ]
    }
];

describe('sprity-js', function () {
  it('should not be beautifyable', function () {
    jsProc.isBeautifyable({}).should.not.be.true;
  });
  it('should return js as the extension', function () {
    jsProc.extension({}).should.equal('js');
  });
  it('should return js as expected', function () {
    jsProc.process(fixture, {}, Handlebars)
      .then(function (s) {
        var style = prettydiff.api({
          source: s,
          lang: 'js',
          mode: 'beautify'
        })[0];
        style.should.equal(fs.readFileSync('test/expected/style.js').toString());
      });
  });
  it('should return js as expected when folders are split', function (done) {
    jsProc.process(fixture2, {}, Handlebars)
      .then(function (s) {
        var style = prettydiff.api({
          source: s,
          lang: 'js',
          mode: 'beautify'
        })[0];
        style.should.equal(fs.readFileSync('test/expected/style2.js').toString());
        done();
      });
  });
});
