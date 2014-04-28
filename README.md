# Animation Controls for Framer (Demo)

[Live Demo: http://tisho.co/framer-animation-controls/index.html](http://tisho.co/framer-animation-controls/index.html)

This is an example of using [dat.GUI](https://github.com/dataarts/dat.gui) to provide some simple controls for animations built with Framer.

I'd often set up an animation that wouldn't look right, so I wanted a way to experiment with the animation parameters without actually going through a full reload of the page.

![](https://dl.dropboxusercontent.com/u/3320134/framer/animation-controls-demo.gif)

## How It Works

Whenever an animation with a defined `aid` (animation ID) property runs, a new control panel is created for it. The next time an animation with the same `aid` runs, it will use the values from the control panel and not the original values from your code. Of course, when you're done experimenting, **you still need to copy the final values back to your code**, but when it comes to designing animations, that's the easy part.

## Use It In Your Own Project

1. Download [dat.gui.js](https://github.com/tisho/framer-animation-controls/blob/master/dat.gui.js) and [https://github.com/tisho/framer-animation-controls/blob/master/framer-animation-controls.js](framer-animation-controls.js) from this repo.
2. Include the two files in your `index.html`, after the `<script>` tag for `framer.js` and before your `app.js`

  ```html
  <script src="dat.gui.js"></script>
  <script src="framer-animation-controls.js"></script>
  ```

3. If you'd like controls for a particular animation, give it a name with the new `aid` property. E.g.:

  ```js
  view.animate({
    aid: 'My Animation',
    properties: {
      x: 100
    },
    curve: 'spring(200,20,200)'
  });
  ```

The moment this animation runs, you'll see the controls pop up on the right side of the screen. You're now free to change some of its properties. If this animation runs again, it will run with the new values, instead of the old ones.

You also get the option to **repeat** or **reverse** an animation. **Reverse** runs the same animation, but in reverse, while repeat will reset the view to its original properties before the animation and then run it again with the new parameters you've set.
