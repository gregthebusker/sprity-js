# sprity-js

[![Build Status](https://travis-ci.org/gregthebusker/sprity-js.svg)](https://travis-ci.org/gregthebusker/sprity-js)
[![Dependency Status](https://david-dm.org/gregthebusker/sprity-js.svg)](https://david-dm.org/gregthebusker/sprity-js)
[![devDependency Status](https://david-dm.org/gregthebusker/sprity-js/dev-status.svg)](https://david-dm.org/gregthebusker/sprity-js#info=devDependencies)

> A JS style processor for [sprity](https://npmjs.org/package/sprity)

## Advantages over traditional css class based sprites

Check out [React: css in js](https://speakerdeck.com/vjeux/react-css-in-js) for a good talk on the basic advantages.

Here's a couple advantages. You'll see the details in the code examples below.

- [Programmatic checking](#programmatic-checking)
- [Overwriting styles](#overwriting-styles) and images without worrying about specificity or order


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
module.exports = {
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

## How to use it in your code

Imagine we had two images in our `app` folder. `rocketship.png` and `rocketship_hover.png`.  In our js these would be represented by `Sprites.App.Rocketship` and `Sprites.App.RocketshipHover`.  Here's an example using [React](http://facebook.github.io/react/) and [Radium](http://projects.formidablelabs.com/radium/) of what it might look like.

```sh
var Radium = require('radium');
var React = require('react');

@Radium
class Icon extends React.Component {
    static propTypes = {
        sprite: React.PropTypes.object.isRequired,
        hoverSprite: React.PropTypes.object,
    };

    render() {
        return (
            <span
                style={[
                    this.props.sprite,  // Radium automatically handles the @media rules in your sprite object
                    {':hover': this.props.hoverSprite},
                ]}
            />
        );
    }
}

// Where we want to use the component
var Sprites = require('Sprites.js'); // Wherever you put your sprity output.

<Icon sprite={Sprites.App.Rocketship} hoverSprite={Sprites.App.RocketshipHover} />
```

## Overwriting styles

One of the issues I ran into using sprity with css outputs was with not being able to control the order of the output.  This became an annoyance with try to overwriting styles.  With javascript that issue is gone completely.  In this example the `:hover` state will always take precedence over the styles of base sprite.
```sh
style={[
    this.props.sprite,
    {':hover': this.props.hoverSprite}
]}
```

## Programmatic checking

We could also easily write a component that automatically renders the hover state if one exists.  Something like this would work great.

```sh
var Radium = require('radium');
var React = require('react');
var Sprites = require('Sprites.js');  // Wherever you put your sprity output.

@Radium
class Icon extends React.Component {
    static propTypes = {
        sprite: React.PropTypes.object.isRequired,
    };

    render() {
        return (
            <span
                style={[
                    // You may want to pass `App` as a prop as well.
                    Sprties.App[this.props.sprite],
                    // If the sprite does not have a hover state this will be undefined and still work great.
                    {':hover': Sprties.App[this.props.sprite + 'Hover']},
                ]}
            />
        );
    }
}

// Where we want to use the component

<Icon sprite="Rocketship" />
```

---
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sprity/sprity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
