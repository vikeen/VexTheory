'use strict';

var config = require('../config');

var VexTabRenderer = function() {
  /*
   * @param {object} options -- A list of options for VexTab rendering mechanism
   *    - key {string} {required}
   *    - notes {array} {required}
   *    - time {string} {optional}
   * @return {string} -- VexTab parsable notation
   */
  this.render = function(options) {
    options.time = options.time || '4/4';

    var result = 'tabstave\n' +
      '  notation=true\n' +
      '  key=' + options.key + ' time=' + options.time + '\n' +
      '  notes :8 0/6 2/6 3/6 0/5 2/5 3/5 0/4 2/4\n'
    ;

    result += '  text  :8, ' + options.notes.concat(options.notes[0]).join(', ');

    return result;
  };

  return this;
};

module.exports = new VexTabRenderer();
