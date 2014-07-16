# Mobify Bellows

A mobile-first accordion UI module for progressive disclosure on the web.

## Documentation

You can find full documentation and examples here: http://mobify.github.io/bellows.

## Requirements

* [Zepto](http://zeptojs.com/)
* [Velocity.js](http://velocityjs.org)
* jQuery Shim for Velocity.js (included in the `lib` folder)
* [Zappy](https://github.com/mobify/zappy)

## Installation

Bellows can be installed using bower:

```bower install bellows```

## Usage

At a bare minimum, your markup structure should follow the above structure. You should have at least one `bellows__item`. Content within `bellows__header` and `bellows__content` can be whatever you want. You may also style either of those however you need. Our default theme will give you some standard styling for those sections but, if you want to theme Bellows yourself, we recommend not including the theme file and starting from scratch.

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="bellows.min.css">

<!-- Optionally include the Theme file -->
<link rel="stylesheet" href="bellows-style.min.css">

<!-- Include the markup -->
<div class="bellows">
    <!-- The Accordion Items -->
    <div class="bellows__item">
        <div class="bellows__header">
            <!-- Item Header - Content can be whatever you want -->
        </div>
        <div class="bellows__content">
            <!-- Item Content - Content can be whatever you want -->
        </div>
    </div>
    <div class="bellows__item">
        <div class="bellows__header">
            <h3>Header</h3>
        </div>
        <div class="bellows__content">
            <p>Content</p>
        </div>
    </div>
    <div class="bellows__item">
        <div class="bellows__header">
            <h3>Header</h3>
        </div>
        <div class="bellows__content">
            <p>Content</p>
        </div>
    </div>
</div>

<!-- Include dependencies -->
<script src="zepto.min.js"></script>
<script src="jquery.velocity.min.js"></script>
<script src="velocity-shim.js"></script>
<script src="tappy.min.js"></script>

<!-- Include bellows.js -->
<script src="bellows.min.js"></script>

<!-- Construct Bellows -->
<script>$('.bellows').bellows()</script>
```

### Velocity Shim

We use a shim for Velocity to polyfill any missing jQuery items so we can continue to use Zepto. If Velocity.js ever stops requiring jQuery, we will be able to stop using this shim.

### jQuery Support

Bellows supports jQuery but is not actively developed for it. You should be able to use Bellows directly with jQuery 2.0 and simply drop the Velocity.js shim in those cases. While we don't actively support jQuery for Bellows, we welcome any and all issues and PRs to help us make it work.

## Initializing the plugin

### bellows()

Initializes the bellows.

```js
$('.bellows').bellows();
```

### bellows(options)

Initialize with options.

```js
$('.bellows').bellows({
    singleItemOpen: false,
    duration: 200,
    easing: 'swing',
    open: function(e, ui) {},
    opened: function(e, ui) {},
    close: function(e, ui) {},
    closed: function(e, ui) {}
});
```

#### Options

##### singleItemOpen

default: `false`

When set to `true` will force only one item open at a time.

```js
$('.bellows').bellows({
    singleItemOpen: true
});
```

##### duration

default: `200`

Sets the duration for the animation.

```js
$('.bellows').bellows({
    duration: 600
});
```

##### easing

default: `swing`

Sets the easing for the animation. Bellows takes all of the same easing properties that [Velocity.js](http://julian.com/research/velocity) accepts.

> * [jQuery UI's easings](http://easings.net/) and CSS3's easings ("ease", "ease-in", "ease-out", and "ease-in-out"), which are pre-packaged into Velocity. A bonus "spring" easing (sampled in the CSS Support pane) is also included. 
* CSS3's bezier curves: Pass in a four-item array of bezier points. (Refer to [Cubic-Bezier.com](http://cubic-bezier.com/) for crafing custom bezier curves.) 
* Spring physics: Pass a two-item array in the form of [ tension, friction ]. A higher tension (default: 600) increases total speed and bounciness. A lower friction (default: 20) increases ending vibration speed. 
* Step easing: Pass a one-item array in the form of [ steps ]. The animation will jump toward its end values using the specified number of steps. 

For more information, check out [Velocity's docs on easing](http://julian.com/research/velocity/#easing).

```js
$('.bellows').bellows({
    easing: 'ease-in-out'
});
```

##### open

default: `function(e, ui) {}`

Triggered every time the selected bellows item is starting to open.

**Parameters**

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback | 

```js
$('.bellows').bellows({
    open: function(e, ui) { 
        // ui.item contains the item opening
    }
});
```

##### opened

default: `function(e, ui) {}`

Triggered every time the selected bellows item has finished opening.

**Parameters**

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback | 

```js
$('.bellows').bellows({
    opened: function(e, ui) { 
        // ui.item contains the item that opened
    }
});
```

##### close

default: `function(e, ui) {}`

Triggered every time an bellows item is starting to close.

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback | 

```js
$('.bellows').bellows({
    close: function(e, ui) { 
        // ui.item contains the item closing
    }
});
```

##### closed

default: `function(e, ui) {}`

Triggered every time an bellows item is finished closing.

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback | 

```js
$('.bellows').bellows({
    closed: function(e, ui) { 
        // ui.item contains the item that closed
    }
});
```

### Storing bellows object for future use

```js
var $bellows = $('.bellows');
```

## Methods

### Open

Open the selected bellows item by element reference

```js
$bellows.bellows('open', $('.bellows__item'));
```

or by index

```js
$bellows.bellows('open', 1);
```

### Close
    
Close the selected bellows item by element reference

```js
$bellows.bellows('close', $('.bellows__item'));
```

or by index

```js
$bellows.bellows('close', 1);
```

## Browser Compatibility

| Browser           | Version | Support                    |
|-------------------|---------|----------------------------|
| Mobile Safari     | 4.0.x   | Degraded. No transitions.  |
| Mobile Safari     | 5.0+    | Supported.                 |
| Android Browser   | 4.0+    | Supported.                 |
| Android Browser   | 2.3.x   | Degraded. No transitions.  |
| Chrome (Android)  | 1.0+    | Supported.                 |


## Building a distribution

### Requirements
* [node.js 0.10.x/npm](http://nodejs.org/download/)
* [Grunt](http://gruntjs.com/)
    * Install with `npm install -g grunt-cli`
* [Bower](http://bower.io/)
    * Install with `npm install -g bower`

### Steps
1. `npm install`
1. `bower install`
1. `grunt`

The `dist` directory will be populated with minified versions of the css and javascript files for distribution and use with whatever build system you might use. The `src` directory has our raw unminified Sass and Javascript files if you prefer to work with those.

## License

_MIT License. Bellows is Copyright © 2014 Mobify. It is free software and may be redistributed under the terms specified in the LICENSE file._
