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
