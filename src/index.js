(function (root, factory) {
  // https://github.com/umdjs/umd/blob/master/templates/returnExports.js
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Determine the environment (node or browser)
  var environment = (Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]') ? 'node' : 'browser';

  // Firemap Constructor
  var Firemap = function (options) {
    var self = this;

    // Set options
    options = options || {};

    // Initialize canvas
    if (options.canvas) {
      self._canvas = options.canvas;
    } else {
      if (environment === 'node') {
        var { createCanvas } = require('canvas');
        self._canvas = createCanvas(options.width || 300, options.height || 150);
      } else {
        self._canvas = document.createElement('canvas');
      }
    }

    // Handle canvas by ID
    if (typeof options.canvas === 'string') {
      self._canvas = document.getElementById(options.canvas);
    }

    // Set context and dimensions
    self._ctx = self._canvas.getContext('2d', { willReadFrequently: true });
    self._width = options.width || self._canvas.width;
    self._height = options.height || self._canvas.height;

    // Set max intensity
    self._maxIntensity = options.maxIntensity || 1;

    // Set data, radius, and gradient
    self._data = [];
    self._radius = options.radius || 25;
    self._gradient = options.gradient || {
      0.4: 'blue',
      0.6: 'cyan',
      0.7: 'lime',
      0.8: 'yellow',
      1.0: 'red'
    };

    // Set other properties
    self._drawn = false;
    self._circle = null;
    self._r = 0;
    self._grad = null;
    self._backgroundImage = null;

    // Load data if provided
    if (options.data) {
      options.data.forEach(function (point) {
        self.add(point);
      });
    }

    // Set background image if provided
    if (options.backgroundImage) {
      self.setBackgroundImage(options.backgroundImage);
    }

    // Return the Firemap instance
    return self;
  };

  // Get Default Point Prototype
  Firemap.prototype._getDefaultPoint = function (point) {
    var self = this;

    // Return the default point
    return {
      x: point.x !== undefined ? point.x : 0,
      y: point.y !== undefined ? point.y : 0,
      intensity: point.intensity !== undefined ? point.intensity : self._maxIntensity * 0.1
    };
  };

  // Set Data Prototype
  // Firemap.prototype.setData = function (data) {
  //   var self = this;

  //   // Set the data
  //   self._data = data.map(function (point) {
  //     return self._getDefaultPoint(point);
  //   });

  //   // Reset the drawn flag
  //   self._drawn = false;

  //   // Return the Firemap instance
  //   return self;
  // };

  // Set Max Intensity Prototype
  Firemap.prototype.setMaxIntensity = function (maxIntensity) {
    var self = this;

    // Set the max intensity
    if (maxIntensity === 'auto') {
      self._maxIntensity = self._getHighestIntensity();
    } else {
      self._maxIntensity = maxIntensity;
    }

    // Reset the drawn flag
    self._drawn = false;

    // Return the Firemap instance
    return self;
  };

  // Get Highest Intensity Prototype
  Firemap.prototype._getHighestIntensity = function () {
    var self = this;

    // Get the highest intensity
    return self._data.reduce(function (max, point) {
        return Math.max(max, point.intensity);
    }, 0);
  };

  // Add Point Prototype
  Firemap.prototype.add = function (point) {
    var self = this;

    // Get the default point
    var newPoint = self._getDefaultPoint(point);

    // Check if the point already exists
    var existingPoint = self._data.find(function (p) {
      return p.x === newPoint.x && p.y === newPoint.y;
    });

    // Update the intensity of the existing point
    if (existingPoint) {
      existingPoint.intensity += newPoint.intensity;
    } else {
      self._data.push(newPoint);
    }

    // Reset the drawn flag
    self._drawn = false;

    // Return the Firemap instance
    return self;
  };

  // Clear Data Prototype
  Firemap.prototype.clear = function () {
    var self = this;

    // Clear the data and reset the drawn flag
    self._data = [];
    self._drawn = false;

    // Return the Firemap instance
    return self;
  };

  // Set Radius Prototype
  Firemap.prototype.setRadius = function (r, blur) {
    var self = this;

    // Set radius and blur
    blur = blur === undefined ? 15 : blur;

    // Create circle canvas
    var circle = self._circle = self._createCanvas(),
        ctx = circle.getContext('2d'),
        r2 = self._r = r + blur;

    // Set circle dimensions
    circle.width = circle.height = r2 * 2;

    // Draw circle
    ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
    ctx.shadowBlur = blur;
    ctx.shadowColor = 'black';

    // Draw circle
    ctx.beginPath();
    ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // Reset drawn flag
    self._drawn = false;

    // Return the Firemap instance
    return self;
  };

  // Resize Canvas Prototype
  Firemap.prototype.resize = function () {
    var self = this;

    // Resize the canvas
    self._width = self._canvas.width;
    self._height = self._canvas.height;

    // Reset the drawn flag
    self._drawn = false;

    // Return the Firemap instance
    return self;
  };

  // Set Gradient Prototype
  Firemap.prototype.setGradient = function (grad) {
    var self = this;

    // Create gradient canvas
    var canvas = self._createCanvas(),
        ctx = canvas.getContext('2d', { willReadFrequently: true }),
        gradient = ctx.createLinearGradient(0, 0, 0, 256);

    // Set gradient dimensions
    canvas.width = 1;
    canvas.height = 256;

    // Add colors to gradient
    for (var i in grad) {
      gradient.addColorStop(+i, grad[i]);
    }

    // Fill gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);

    // Set gradient data
    self._grad = ctx.getImageData(0, 0, 1, 256).data;

    // Reset drawn flag
    self._drawn = false;

    // Return the Firemap instance
    return self;
  };

  // Draw Firemap Prototype
  Firemap.prototype.draw = function (minOpacity) {
    var self = this;

    // Get context
    var ctx = self._ctx;

    // Draw background image if available
    if (self._backgroundImage) {
      ctx.drawImage(self._backgroundImage, 0, 0, self._width, self._height);
    } else {
      ctx.clearRect(0, 0, self._width, self._height);
    }

    // Ensure circle and gradient are set
    if (!self._circle) self.setRadius(self._radius);
    if (!self._grad) self.setGradient(self._gradient);

    // Draw points
    for (var i = 0, len = self._data.length, p; i < len; i++) {
      p = self._data[i];
      ctx.globalAlpha = Math.min(Math.max(p.intensity / self._maxIntensity, minOpacity === undefined ? 0.05 : minOpacity), 1);
      ctx.drawImage(self._circle, p.x - self._r, p.y - self._r);
    }

    // Colorize pixels
    var colored = ctx.getImageData(0, 0, self._width, self._height);
    self._colorize(colored.data, self._grad);
    ctx.putImageData(colored, 0, 0);

    // Set drawn flag
    self._drawn = true;

    // Return the Firemap instance
    return self;
  };

  // Colorize Pixels Prototype
  Firemap.prototype._colorize = function (pixels, gradient) {
    // Colorize pixels
    for (var i = 0, len = pixels.length, j; i < len; i += 4) {
      j = pixels[i + 3] * 4;

      if (j) {
        pixels[i] = gradient[j];
        pixels[i + 1] = gradient[j + 1];
        pixels[i + 2] = gradient[j + 2];
      }
    }
  };

  // Create Canvas Prototype
  Firemap.prototype._createCanvas = function () {
    var self = this;

    // Create canvas
    if (typeof document !== 'undefined') {
      return document.createElement('canvas');
    } else {
      return new self._canvas.constructor();
    }
  };

  // Set Background Image Prototype
  Firemap.prototype.setBackgroundImage = function (imageBuffer) {
    var self = this;

    // Set background image
    if (environment === 'node') {
      var { Image } = require('canvas');
      var img = new Image();
      img.src = imageBuffer;
      self._backgroundImage = img;
    } else {
      var img = new Image();
      img.onload = function () {
        self._backgroundImage = img;
      };
      img.src = URL.createObjectURL(new Blob([imageBuffer]));
    }

    // Reset drawn flag
    self._drawn = false;

    // Return the Firemap instance
    return self;
  };

  // Get Buffer Prototype for both Node.js and browser environments
  Firemap.prototype.getBuffer = function (type) {
    var self = this;

    // Set the type
    type = type || 'image/png';

    // Draw the heatmap if not already drawn
    if (!self._drawn) {
      self.draw();
    }

    // Return the buffer
    if (environment === 'node') {
      return self._canvas.toBuffer(type);
    } else {
      return self._canvas.toDataURL(type);
    }
  };

  // Register in the browser environment
  if (environment === 'browser') {
    try {
      window.Firemap = Firemap;
    } catch (e) {
    }
  }

  // Return the Firemap class for module export
  return Firemap;
}));
