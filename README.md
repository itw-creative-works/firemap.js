<p align="center">
  <a href="https://itwcreativeworks.com">
    <img src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg" width="100px">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/itw-creative-works/firemap.js.svg">
  <br>
  <img src="https://img.shields.io/librariesio/release/npm/firemap.js.svg">
  <img src="https://img.shields.io/bundlephobia/min/firemap.js.svg">
  <img src="https://img.shields.io/codeclimate/maintainability-percentage/itw-creative-works/firemap.js.svg">
  <img src="https://img.shields.io/npm/dm/firemap.js.svg">
  <img src="https://img.shields.io/node/v/firemap.js.svg">
  <img src="https://img.shields.io/website/https/itwcreativeworks.com.svg">
  <img src="https://img.shields.io/github/license/itw-creative-works/firemap.js.svg">
  <img src="https://img.shields.io/github/contributors/itw-creative-works/firemap.js.svg">
  <img src="https://img.shields.io/github/last-commit/itw-creative-works/firemap.js.svg">
  <br>
  <br>
  <a href="https://itwcreativeworks.com">Site</a> | <a href="https://www.npmjs.com/package/firemap.js">NPM Module</a> | <a href="https://github.com/itw-creative-works/firemap.js">GitHub Repo</a>
  <br>
  <br>
  <strong>firemap.js</strong> is the official npm module of <a href="https://itwcreativeworks.com">Firemap.js</a>, a free app for easily creating heatmaps in Node.js and the Browser.
  <br>
  <br>
  <img src="https://media.giphy.com/media/KX5wlmzJ10uCLIOk4j/giphy.gif">
  <br>
  <br>
</p>

## 🌐 Firemap.js Works in Node AND browser environments
Yes, this module works in both Node and browser environments, including compatibility with [Webpack](https://www.npmjs.com/package/webpack) and [Browserify](https://www.npmjs.com/package/browserify)!

## 🦄 Features
* Easily create heatmaps in Node.js and the Browser

<!-- ## 🔑 Getting an API key
You can use so much of `firemap.js` for free, but if you want to do some advanced stuff, you'll need an API key. You can get one by [signing up for a Firemap.js account](https://itwcreativeworks.com/signup). -->

## 📦 Install Firemap.js
### Option 1: Install via npm
Install with npm if you plan to use `firemap.js` in a Node project or in the browser.
```shell
# Install the package
npm install firemap.js

# Rebuild native modules (this module uses 'canvas', which is a native module)
npm rebuild
```
If you plan to use `firemap.js` in a browser environment, you will probably need to use [Webpack](https://www.npmjs.com/package/webpack), [Browserify](https://www.npmjs.com/package/browserify), or a similar service to compile it.

```js
const Firemap = require('firemap.js');
const firemap = new Firemap({
  width: 1000,
  height: 1000,
});
```

### Option 2: Install via CDN
Install with CDN if you plan to use `firemap.js` only in a browser environment.
```html
<script src="https://cdn.jsdelivr.net/npm/firemap.js@latest/dist/index.min.js"></script>
<script type="text/javascript">
  var firemap = new Firemap({
    width: 1000,
    height: 1000,
  });
</script>
```

## ⚡️ Usage
### Creating an Instance
See a simple example of creating a new instance of Firemap.js with the required options `width` and `height`.
```js
const Firemap = require('firemap.js');
const firemap = new Firemap({
  // Set the size of the heatmap
  width: 1000, height: 1000,
});
```

### Creating an Instance (full options)
See a full example of creating a new instance of Firemap.js with all available options.
```js
const Firemap = require('firemap.js');
const firemap = new Firemap({
  // Set the size of the heatmap
  width: 1000, height: 1000,

  // Set the maximum intensity of each data point
  maxIntensity: 1.0,

  // Set the radius and blur of the data points
  radius: 10, blur: 5,

  // Set the gradient of the heatmap (from cold to hot)
  gradient: {
    0.4: 'blue',
    0.6: 'cyan',
    0.7: 'lime',
    0.8: 'yellow',
    1.0: 'red',
  },

  // Set the background image of the heatmap (as a buffer)
  backgroundImage: null,

  // Data to be added to the heatmap
  data: [
    { x: 100, y: 150, intensity: 0.5 },
    { x: 200, y: 250, intensity: 0.8 },
    { x: 250, y: 50, intensity: 1.0 },
  ],
});
```

### Adding Data Points
Adding data points to the heatmap is easy. Just add them one by one. The `intensity` value should be between 0 and 1 and represents the intensity of the data point.

Intensity values closer to `1` are hotter, while intensity values closer to `0` are colder.

The `intensity` values are **cumulative**. This means that if you add two data points with the same `x` and `y` values, the intensity of the data point will be the sum of the two `intensity` values.
```js
firemap.add({ x: 100, y: 100, intensity: 0.5 });
firemap.add({ x: 200, y: 200, intensity: 0.5 });
firemap.add({ x: 100, y: 100, intensity: 0.5 }); // This will add to the intensity of the first data point
```

### Setting Maximum Intensity
You can adjust the maximum intensity of the heatmap. This sets the relative intensity of the hottest data point.
```js
firemap.setMaxIntensity(1.0);
// Or automatically determine the maximum intensity
firemap.setMaxIntensity('auto');
```

### Setting Radius and Blur
You can adjust the radius and blur of the data points.
```js
firemap.setRadius(20, 10);
```

### Setting Gradient
You can adjust the gradient of the heatmap. The gradient is an object with keys as intensity values and values as colors.

The intensity values should be between 0 and 1 and represent the intensity of the data point.

Intensity values closer to `1` are hotter, while intensity values closer to `0` are colder.
```js
firemap.setGradient({
  0.4: 'blue',
  0.6: 'cyan',
  0.7: 'lime',
  0.8: 'yellow',
  1.0: 'red'
});
```

### Drawing the Heatmap
Render the heatmap to the canvas.
```js
firemap.draw();
```

### Clearing Data
You can clear all data points from the heatmap.
```js
firemap.clear();
```

### Resizing the Canvas
You can resize the canvas of the heatmap.
```js
firemap.resize({
  // Set the new size of the heatmap
  width: 2000, height: 2000,
});
```

### Setting Background Image
You can set the background image of the heatmap. The image should be a buffer.
```js
const fs = require('fs');
const imageBuffer = fs.readFileSync('path/to/background.jpg');
firemap.setBackgroundImage(imageBuffer);
```

### Getting the Buffer
You can get the buffer of the heatmap. This is useful for saving the heatmap as an image.
```js
const buffer = firemap.getBuffer('image/png');

// In Node.js, you can save the buffer to a file
const fs = require('fs');
fs.writeFileSync('heatmap.png', buffer);
```

## 📘 Using Firemap.js
After you have followed the install step, you can start using `firemap.js` to enhance your project.

For a more in-depth documentation of this library and the Firemap.js service, please visit the official Firemap.js website.

## 📝 What Can Firemap.js do?
The best way to create Heatmaps for any data

## 🗨️ Final Words
If you are still having difficulty, we would love for you to post
a question to [the Firemap.js issues page](https://github.com/itw-creative-works/firemap.js/issues). It is much easier to answer questions that include your code and relevant files! So if you can provide them, we'd be extremely grateful (and more likely to help you find the answer!)

## 📚 Projects Using this Library
* [ITW Creative Works](https://itwcreativeworks.com)
* [Somiibo](https://somiibo.com)
* [Slapform](https://slapform.com)
* [StudyMonkey](https://studymonkey.ai)
* [DashQR](https://dashqr.com)
* [Replyify](https://replyify.app)
* [SoundGrail](https://soundgrail.com)
* [Trusteroo](https://trusteroo.com)

Ask us to have your project listed! :)
