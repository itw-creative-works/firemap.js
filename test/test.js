const package = require('../package.json');
const assert = require('assert');
const jetpack = require('fs-jetpack');
const fs = require('fs');

beforeEach(() => {
});

before(() => {
});

after(() => {
});

/*
 * ============
 *  Test Cases
 * ============
 */
describe(`${package.name}`, () => {
  const Firemap = require('../dist/index.js');

  // Method
  describe('.initialize()', () => {

    // Method tests
    it('should export the buffer to a PNG without background image', async () => {
      // Initialize the Firemap instance with raw options
      const firemap = new Firemap({
        width: 200, height: 200, max: 1,
        data: [
          {
            x: 50, y: 50
          },
          {
            x: 100, y: 100
          }
        ]
      });

      // Add data points for the heatmap
      firemap.add({ x: 100, y: 100, intensity: 0.1 });
      firemap.add({ x: 100, y: 100, intensity: 0.1 });
      firemap.add({ x: 100, y: 100, intensity: 0.5 });

      // Get the buffer of the canvas
      const buffer = firemap.getBuffer('image/png');

      // Save the buffer as a PNG file
      jetpack.write(`heatmaps/${new Date().toISOString()}_no_bg.png`, buffer);

      // Assert that the buffer is not empty
      assert.ok(buffer);

      // Assert that the buffer is a valid PNG file
      assert.equal(buffer.slice(1, 4).toString('utf-8'), 'PNG');
    });

    it('should export the buffer to a PNG with background image', async () => {
      // Initialize the Firemap instance with raw options
      const firemap = new Firemap({
        width: 200, height: 200, max: 1,
        data: [
          {
            x: 50, y: 50
          },
          {
            x: 100, y: 100
          }
        ]
      });

      // Add data points for the heatmap
      firemap.add({ x: 100, y: 100, intensity: 0.1 });
      firemap.add({ x: 100, y: 100, intensity: 0.1 });
      firemap.add({ x: 100, y: 100, intensity: 0.5 });

      // Load the placeholder image
      const imagePath = 'test/placeholder.png';
      const imageBuffer = jetpack.read(imagePath, 'buffer');

      // Set the background image
      firemap.setBackgroundImage(imageBuffer);

      // Get the buffer of the canvas
      const buffer = firemap.getBuffer('image/png');

      // Save the buffer as a PNG file
      jetpack.write(`heatmaps/${new Date().toISOString()}_with_bg.png`, buffer);

      // Assert that the buffer is not empty
      assert.ok(buffer);

      // Assert that the buffer is a valid PNG file
      assert.equal(buffer.slice(1, 4).toString('utf-8'), 'PNG');
    });

  });

});
