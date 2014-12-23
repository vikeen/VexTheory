// Uses AMD or browser globals to create a module.

// If you want something that will also work in Node, see returnExports.js
// If you want to support other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrict.js

// Defines a module "amdWeb" that depends another module called "b".
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing `this` as the first arg to
// the top function.

/* jshint ignore:start */
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['VexTheory'], factory);
    } else {
        // Browser globals
        root.VexTheory = factory(root.VexTheory);
    }
}(this, function (VexTheory) {

/* jshint ignore:end */

/* jshint ignore:start */
var VexTheory = {};

/* jshint ignore:end */

(function() {
  'use strict';

  VexTheory.Config = {
    'scales': {
      'major': ['P0', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7', 'P8'],
      'minor': ['P0', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7', 'P8']
    },
    'notes': ['B#/C', 'C#/Db', 'D', 'D#/Eb', 'E', 'E#/F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'],
    'intervals': {
      'P0': 0,
      'm2': 1,
      'M2': 2,
      'm3': 3,
      'M3': 4,
      'P4': 5,
      'A4/D5': 6,
      'P5': 7,
      'm6': 8,
      'M6': 9,
      'm7': 10,
      'M7': 11,
      'P8': 12
    },
    'strings': ['E', 'B', 'G', 'D', 'A', 'E']
  };
})();

(function(config) {
  'use strict';

  var currentNoteIndex;

  var Scale = function(key, name, options) {
    this.options = options || {};
    this.key = key;
    this.name = name;
    this.notes = [key];
    buildNotes(this);
  };

  /*
   * Build an interal array to hold the notes of the scale
   * @return {void}
   */
  var buildNotes = function(scale) {
    for (var i = 1; i < config.scales[scale.name].length - 1; i++) {
      currentNoteIndex = i;
      scale.notes.push(getNextNote(scale));
    }
  };

  /*
   * Get the array index of the root note of the scale
   * @return {integer} - the index of the next note in the scale
   */
  var getRootNoteIndex = function(scale) {
    for (var i = 0; i < config.notes.length; i++) {
      var possibleRootNotes = config.notes[i].split('/');
      if (possibleRootNotes[0] === scale.key ||
        possibleRootNotes[1] === scale.key) {
        return i;
      }
    }
  };

  /*
   * Get the array index of the next note of the scale
   * @return {integer} - the index of the next note in the scale
   */
  var getNextNoteIndex = function(scale) {
    var interval = config.scales[scale.name][currentNoteIndex],
      result = getRootNoteIndex(scale) + config.intervals[interval];

    if (result >= config.notes.length) {
      result -= config.notes.length;
    }

    return result;
  };

  /*
   * Initialization
   * @return {void}
   */
  var getPreviousNote = function(scale) {
    return scale.notes[scale.notes.length - 1];
  };

  /*
   * Get the possible next notes of the scale. This will not distinquish between which accidental or scale degree is needed
   * @return {string} - "C" or "C#/Db"
   */
  var getPossibleNextNotes = function(scale) {
    return config.notes[getNextNoteIndex(scale)].split('/');
  };

  /*
   * Get the exact note of the scale.
   * @return {string} - "C" or "C#"
   */
  var getNextNote = function(scale) {
    if (getPossibleNextNotes(scale).length > 1) {
      var noteRegexPattern = new RegExp(getPossibleNextNotes(scale)[0].charAt(0));

      if (noteRegexPattern.test(getPreviousNote(scale))) {
        return getPossibleNextNotes(scale)[1];
      }

    }
    return getPossibleNextNotes(scale)[0];
  };

  /*
   * Exposed functions
   */
  Scale.prototype = {

    /*
     * Standard out debugging for the scale
     * @return {void}
     */
    print: function() {
      console.log(this.key, this.name, this.notes);
      return this;
    }
  };

  VexTheory.Scale = {};
  VexTheory.Scale.create = function(key, name, options) {
    return new Scale(key, name, options);
  };
})(VexTheory.Config);

/* jshint ignore:start */

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return VexTheory;
}));
/* jshint ignore:end */
