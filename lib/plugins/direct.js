'use strict';

import Core from '../core.js';
import attr from '../attr.js';

function match(tagname, attribs, config) {
  var directAttr = attr.getAttr(config.prefix + 'direct', attribs);
  if(directAttr) {
    return Core.render(attribs[directAttr], config.variables);
  }
}

export default {
  name:'direct',
  match: match
};
