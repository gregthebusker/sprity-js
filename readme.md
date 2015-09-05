# sprity-js

[![Build Status](https://travis-ci.org/gregthebusker/sprity-js.svg)](https://travis-ci.org/gregthebusker/sprity-js)
[![Dependency Status](https://david-dm.org/gregthebusker/sprity-js.svg)](https://david-dm.org/gregthebusker/sprity-js)
[![devDependency Status](https://david-dm.org/gregthebusker/sprity-js/dev-status.svg)](https://david-dm.org/gregthebusker/sprity-js#info=devDependencies)

> A JS style processor for [sprity](https://npmjs.org/package/sprity)

## Requirements

- [sprity](https://npmjs.org/package/sprity) version >= 1.0

## Install

```sh
npm install sprity sprity-js --save-dev
```


## Usage

Here's a example using gulp, but see [sprity](https://npmjs.org/package/sprity) for full documentation.


```sh
var gulp = require('gulp')
var sprity = require('sprity');
var sprityJS = require('sprity-js');

gulp.task('sprites', function () {
  return sprity.src({
    src: './images/**/*.png',
    style: 'Sprite.js',
    dimension: [{
      ratio: 1, dpi: 72
    }, {
      ratio: 2, dpi: 144
    }],
    split: true,
    processor: sprityJS // The important part for sprity JS
  })
  .pipe(gulp.dest('sprites/'));
});
```

## Output

Here's an example of what the output might look like.  This example assumes you're using `split: true` in your sprity config.

```sh
images
|- testFolder1
    |- test1.png
```

```sh
export default {
    "TestFolder1": {
        "Test1": {
            "backgroundPosition": "-0px -0px",
            "width": "40px",
            "height": "40px",
            "backgroundImage": "url('../images/sprite-testFolder1.png')",
            "backgroundSize": "20px 20px",
            "@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 144dpi)": {
                "backgroundImage": "url('../images/sprite-testFolder1@2x.png')",
                "backgroundSize": "40px 40px"
            }
        }
    }
}
```

---
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sprity/sprity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
