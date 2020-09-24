/**
 * Copyright 2017-2020 BigML
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

var assert = require('assert'),
  bigml = require('../index'),
  path = require('path');
var scriptName = path.basename(__filename);


describe(scriptName + ': Manage composite source objects', function () {
  var sourceId1, source1 = new bigml.Source(), path = './data/iris.csv',
    sourceId2, source2 = new bigml.Source(),
    sourceId3, source3 = new bigml.Source();

  before(function (done) {
    source1.create(path, undefined, function (error, data) {
      assert.equal(data.code, bigml.constants.HTTP_CREATED);
      sourceId1 = data.resource;
      source1.get(sourceId1, true, function(error, data) {
        source2.create(path, undefined, function (error, data) {
          assert.equal(data.code, bigml.constants.HTTP_CREATED);
          sourceId2 = data.resource;
          source2.get(sourceId2, true, function(error, data) {
            done();
          });
        });
      });
    });
  });

  describe('#create([source1, source2], args, callback)', function () {
    it('should create a source from a list of sources', function (done) {
      source3.create([sourceId1, sourceId2], undefined, function (error, data) {
        assert.equal(data.code, bigml.constants.HTTP_CREATED);
        sourceId3 = data.resource;
        source3.get(sourceId3, true, function(error, data) {
          assert.equal(JSON.stringify(data.object.sources), JSON.stringify([
            bigml.private.utils.getResource(sourceId1).id,
            bigml.private.utils.getResource(sourceId2).id]));
          done();
        });
      });
    });
  });

  describe('#cloning(source1, args, callback)', function () {
    it('should clone a source from another source', function (done) {
      source3.clone(sourceId1, undefined, function (error, data) {
        assert.equal(data.code, bigml.constants.HTTP_CREATED);
        sourceId3 = data.resource;
        source3.get(sourceId3, true, function(error, data) {
          assert.equal(data.object.origin, sourceId1);
          done();
        });
      });
    });
  });

  describe('#delete(source, args, callback)', function () {
    it('should delete the composite source and components', function (done) {
      source3.delete(sourceId3, "delete_all=true", function (error, data) {
        assert.equal(error, null);
        done();
      });
    });
  });
});
