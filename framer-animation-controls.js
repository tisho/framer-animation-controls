(function() {
  var animationDefinitionsById = {},
      animationProperties = ['time', 'curve', 'origin', 'delay'],
      animatableProperties = Animation.prototype.AnimatableMatrixProperties.concat(Object.keys(Animation.prototype.AnimatableFilterProperties)).concat(Object.keys(Animation.prototype.AnimatableCSSProperties)),
      oldAnimate = View.prototype.animate,
      gui = new dat.GUI(),
      EditableAnimationDefinition;

  EditableAnimationDefinition = (function() {
    function EditableAnimationDefinition(id, args) {
      this.id = id;
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
        } else {
          this.curveType = 'bezier-predefined';
          this.curve = options.curve;
        }
      }

      if (options.time) {
        this.time = parseInt(options.time, 10);
      }

      if (options.origin) {
        this.origin = options.origin;
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
          options.curve = 'spring(' + [this.springTension, this.springFriction, this.springVelocity].join(',') + ')';
          break;
        case 'bezier-curve':
          options.curve = 'bezier-curve(' + [this.bezierA, this.bezierB, this.bezierC, this.bezierD].join(',') + ')';
          break;
        case 'bezier-predefined':
          options.curve = this.curve;
          break;
        }
      }

      if (this.time) {
        options.time = this.time;
      }

      if (this.origin) {
        options.origin = this.origin;
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

      if (this.origin) {
        this.gui.add(this, 'origin');
      }

      if (this.origin) {
        this.gui.add(this, 'delay');
      }

      this.gui.add(this, 'repeat');
      this.gui.add(this, 'reverse');
      this.gui.open();

      gui.remember(this);
    }

    EditableAnimationDefinition.prototype.resetView = function() {
      var originalProperties = _.pick(this.animation._originalProperties, animatableProperties);

      for (property in originalProperties) {
        if (this.animation.properties.hasOwnProperty(property)) {
          this.animation.view[property] = originalProperties[property];
        }
      }
    }

    EditableAnimationDefinition.prototype.repeat = function() {
      this.resetView();

      var options = _.pick(this.animation, Animation.prototype.AnimationProperties);
      _.extend(options, this.toAnimationOptions());

      options.properties = this.animation.properties;
      this.animation = new Animation(options)
      this.animation.start();
    }

    EditableAnimationDefinition.prototype.reverse = function() {
      this.animation.reverse().start();
    }

    return EditableAnimationDefinition;
  })();

  View.prototype.animate = function(args, callback) {
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
