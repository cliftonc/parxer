'use strict';

import expect from 'expect.js';
import { parxer, render } from '../index.js';
import cheerio from 'cheerio';
import fs from 'fs';
import Plugins from '../Plugins.js';

describe("If logic plugin", function() {
  it('should parse if attributes and retain block if true', function(done) {
      var input = "<html><div id='if' cx-if='${server:name}' cx-if-value='http://www.google.com'><h1>Hello</h1><span id='stillhere'>Rah!</span></div></html>";
      parxer({
        plugins: [
          Plugins.If
        ],
      variables: {
        'environment:name':'test',
        'server:name':'http://www.google.com'
      }}, input, function(err, fragmentCount, data) {
        var $ = cheerio.load(data);
        expect($('#stillhere').text()).to.be('Rah!');
        done();
      });
  });

  it('should parse if attributes and remove block if false', function(done) {
      var input = "<html><div id='if' cx-if='${server:name}' cx-if-value='http://www.tes.com'><h1>Hello</h1><span id='stillhere'>Rah!</span></div></html>";
      parxer({
        plugins: [
          Plugins.If
        ],
      variables: {
        'environment:name':'test',
        'server:name':'http://www.google.com'
      }}, input, function(err, fragmentCount, data) {
        var $ = cheerio.load(data);
        expect($('div').text()).to.be('');
        done();
      });
  });


  it('should parse if attributes and allow block if false, removing block if cx-replace-outer', function(done) {
      var input = "<html><div id='if' cx-replace-outer='true' cx-if='${environment:name}' cx-if-value='test'><h1>Hello</h1><br/><!-- hello --><span id='stillhere'>Rah!</span></div></html>";
      parxer({
        plugins: [
          Plugins.If
        ],
      variables: {
        'environment:name':'test',
        'server:name':'http://www.google.com'
      }}, input, function(err, fragmentCount, data) {
        var $ = cheerio.load(data);
        expect($('div').text()).to.be('');
        done();
      });
  });

  it('should parse if attributes and allow block if false, removing block if cx-replace-outer (using custom tag)', function(done) {
      var input = "<html><compoxure id='if' cx-if='${environment:name}' cx-if-value='test'><h1>Hello</h1><br/><!-- hello --><span id='stillhere'>Rah!</span></compoxure></html>";
      parxer({
        plugins: [
          Plugins.If
        ],
      variables: {
        'environment:name':'test',
        'server:name':'http://www.google.com'
      }}, input, function(err, fragmentCount, data) {
        var $ = cheerio.load(data);
        expect($('div').text()).to.be('');
        done();
      });
  });

  it('should parse if attributes and retain block if true, including url declarations', function(done) {
      var input = "<html><div id='if' cx-if='${server:name}' cx-if-value='http://www.google.com'><div cx-url='${server:name}'></div></div></html>";
      parxer({
        plugins: [
          Plugins.If,
          Plugins.Url(function(fragment, next) { next(null, fragment.attribs['cx-url']) })
        ],
      variables: {
        'server:name':'http://www.google.com'
      }}, input, function(err, fragmentCount, data) {
        var $ = cheerio.load(data);
        expect($('#if').text()).to.be('http://www.google.com');
        done();
      });
  });

});
