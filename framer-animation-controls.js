(function() {
  var animationDefinitionsById = {},
      animationProperties = ['time', 'curve', 'curveOptions', 'delay', 'layer', 'debug', 'repeat'],
      oldAnimate = Layer.prototype.animate,
      gui = new dat.GUI(),
      EditableAnimationDefinition;

  EditableAnimationDefinition = (function() {
    function EditableAnimationDefinition(id, args) {
      this.id = id;
      this.loop = false;
      this.parseAnimationOptions(_.pick(args, animationProperties));
      this.createControls();
      animationDefinitionsById[id] = this;
    }

    EditableAnimationDefinition.prototype.parseAnimationOptions = function(options) {
      if (options.curve) {
        var match;
        if (match = options.curve.match(/spring\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/)) {
          this.curveType = 'spring';
          this.springTension = parseInt(match[1], 10);
          this.springFriction = parseInt(match[2], 10);
          this.springVelocity = parseInt(match[3], 10);
        } else if (match = options.curve.match(/bezier-curve\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/)) {
          this.curveType = 'bezier-curve';
          this.bezierA = parseFloat(match[1]);
          this.bezierB = parseFloat(match[2]);
          this.bezierC = parseFloat(match[3]);
          this.bezierD = parseFloat(match[4]);
        } else if (options.curve == 'spring' && options.curveOptions) {
          this.curveType = 'spring';
          this.springTension = options.curveOptions.tension;
          this.springFriction = options.curveOptions.friction;
          this.springVelocity = options.curveOptions.velocity;
        } else if (options.curve == 'bezier-curve' && options.curveOptions) {
          this.curveType = 'bezier-curve';

          if (_.isString(options.curveOptions)) {
            this.curveType = 'bezier-predefined';
            this.curve = options.curveOptions;
          } else {
            if (_.isArray(options.curveOptions)) {
              values = options.curveOptions;
            } else if (options.curveOptions.values && _.isArray(options.curveOptions.values)) {
              values = options.curveOptions.values;
            }

            this.bezierA = values[0];
            this.bezierB = values[1];
            this.bezierC = values[2];
            this.bezierD = values[3];
          }
        } else {
          this.curveType = 'bezier-predefined';
          this.curve = options.curve;
        }
      }

      if (options.time) {
        this.time = parseInt(options.time, 10);
      }

      if (options.delay) {
        this.delay = options.delay;
      }
    }

    EditableAnimationDefinition.prototype.toAnimationOptions = function() {
      var options = {};

      if (this.curveType) {
        switch(this.curveType) {
        case 'spring':
          options.curve = 'spring';
          options.curveOptions = { tension: this.springTension, friction: this.springFriction, velocity: this.springVelocity}
          break;
        case 'bezier-curve':
          options.curve = 'bezier-curve';
          options.curveOptions = [this.bezierA, this.bezierB, this.bezierC, this.bezierD];
          break;
        case 'bezier-predefined':
          options.curve = 'bezier-curve';
          options.curveOptions = this.curve;
          break;
        }
      }

      if (this.time) {
        options.time = this.time;
      }

      if (this.delay) {
        options.delay = this.delay;
      }

      return options;
    }

    EditableAnimationDefinition.prototype.createControls = function(options) {
      this.gui = gui.addFolder(this.id);

      if (this.curveType) {
        switch(this.curveType) {
        case 'spring':
          this.gui.add(this, 'springTension');
          this.gui.add(this, 'springFriction');
          this.gui.add(this, 'springVelocity');
          break;
        case 'bezier-curve':
          this.gui.add(this, 'bezierA');
          this.gui.add(this, 'bezierB');
          this.gui.add(this, 'bezierC');
          this.gui.add(this, 'bezierD');
          break;
        case 'bezier-predefined':
          this.gui.add(this, 'curve', { 'Linear': 'linear', 'Ease': 'ease', 'Ease In': 'ease-in', 'Ease Out': 'ease-out', 'Ease In Out': 'ease-in-out' });
          break;
        }
      }

      if (this.time) {
        this.gui.add(this, 'time');
      }

      if (this.delay) {
        this.gui.add(this, 'delay');
      }

      var loopControl = this.gui.add(this, 'loop');
      loopControl.onChange(this.loopIfNeeded.bind(this));
      this.gui.add(this, 'repeat');
      this.gui.add(this, 'reverse');
      this.gui.open();

      gui.remember(this);
    }

    EditableAnimationDefinition.prototype.loopIfNeeded = function() {
      if (this.loop) {
        this.repeat();
      }
    }

    EditableAnimationDefinition.prototype.resetLayer = function() {
      var originalProperties = this.animation._originalState;

      for (property in originalProperties) {
        if (this.animation.options.properties.hasOwnProperty(property)) {
          this.animation.options.layer[property] = originalProperties[property];
        }
      }
    }

    EditableAnimationDefinition.prototype.repeat = function() {
      this.resetLayer();

      var options = _.pick(this.animation.options, animationProperties);
      _.extend(options, this.toAnimationOptions());

      options.properties = this.animation.options.properties;
      this.animation = new Animation(options)
      this.animation.on('end', this.loopIfNeeded.bind(this));
      this.animation.start();
    }

    EditableAnimationDefinition.prototype.reverse = function() {
      this.animation.reverse().start();
    }

    return EditableAnimationDefinition;
  })();

  Layer.prototype.animate = function(args, callback) {
    if ('aid' in args) {
      var animationDefinition = animationDefinitionsById[args.aid] || new EditableAnimationDefinition(args.aid, args);
      _.extend(args, animationDefinition.toAnimationOptions());
      animationDefinition.animation = oldAnimate.apply(this, [args, callback]);
      return animationDefinition.animation;
    } else {
      return oldAnimate.apply(this, Array.prototype.slice.call(arguments));
    }
  };
})();
