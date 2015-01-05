'use strict';

var config = require('../config');
var renderers = require('../renderers/index');

var Scale = function(key, name, options) {
  this.options = options || {};
  this.key = key;
  this.name = name.toLowerCase();
  this.notes = [key];

  this.renderer = renderers[options.renderer] || renderers.vextab;

  if (!config.scales.hasOwnProperty(this.name)) {
    throw 'Invalid scale name provided. Valid values are ' + Object.keys(VexTheory.config.scales).toString();
  }

  /*
   * Build an interal array to hold the notes of the scale
   * @return {void}
   */
  this.buildNotes = function() {
    for (var i = 1; i < config.scales[this.name].length - 1; i++) {
      this.currentNoteIndex = i;
      this.notes.push(this.getNextNote());
    }
  };

  /*
   * Get the array index of the root note of the scale
   * @return {integer} - the index of the next note in the scale
   */
  this.getRootNoteIndex = function() {
    for (var i = 0; i < config.notes.length; i++) {
      var possibleRootNotes = config.notes[i].split('/');
      if (possibleRootNotes[0] === this.key ||
        possibleRootNotes[1] === this.key) {
        return i;
      }
    }
  };

  /*
   * Get the array index of the next note of the scale
   * @return {integer} - the index of the next note in the scale
   */
  this.getNextNoteIndex = function() {
    var interval = config.scales[this.name][this.currentNoteIndex],
      result = this.getRootNoteIndex() + config.intervals[interval];

    if (result >= config.notes.length) {
      result -= config.notes.length;
    }

    return result;
  };

  /*
   * Initialization
   * @return {void}
   */
  this.getPreviousNote = function() {
    return this.notes[this.notes.length - 1];
  };

  /*
   * Get the possible next notes of the scale. This will not distinquish between which accidental or scale degree is needed
   * @return {string} - "C" or "C#/Db"
   */
  this.getPossibleNextNotes = function() {
    return config.notes[this.getNextNoteIndex()].split('/');
  };

  /*
   * Get the exact note of the scale.
   * @return {string} - "C" or "C#"
   */
  this.getNextNote = function() {
    if (this.getPossibleNextNotes().length > 1) {
      var noteRegexPattern = new RegExp(this.getPossibleNextNotes()[0].charAt(0));

      if (noteRegexPattern.test(this.getPreviousNote())) {
        return this.getPossibleNextNotes()[1];
      }

    }
    return this.getPossibleNextNotes()[0];
  };

  /*
   * Get scale name abbreviation
   * @return {string} - 'M' or 'm'
   */
  this.getScaleNameAbbreviation = function() {
    switch(this.name) {
      case 'major':
        return '';
      case 'minor':
        return 'm';
      default:
        throw 'Invalid scale name abbreviation mapping';
    }
  };

  /*
   * Standard out debugging for the scale
   * @return {void}
   */
  this.render = function() {
    return this.renderer.render({
      'key': this.notes[0] + this.getScaleNameAbbreviation(),
      'notes': this.notes
    });
  };

  this.buildNotes();

  return this;
};

module.exports = function(key, name, options) {
  return new Scale(key, name, options);
};
