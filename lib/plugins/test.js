'use strict';

import Core from '../core.js';
import attr from '../attr.js';

function match(tagname, attribs, config, state) {
  var testAttr = attr.getAttr(config.prefix + 'test', attribs);
  var testAttrDone = attr.getAttr(config.prefix + 'test-done', attribs);

  if (testAttr && !testAttrDone) {
    attribs[config.prefix + 'test-done'] = true;
    state.setOutput(Core.createTag(tagname, attribs));
    state.setOutput(Core.render(attribs[testAttr], config.variables));
    return true;
  }
}

export default {
  name:'test',
  match: match
};
