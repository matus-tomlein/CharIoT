const buildLocations = require('./buildLocations'),
      buildDevices = require('./buildDevices'),
      buildVirtualSensors = require('./buildVirtualSensors'),
      buildRules = require('./buildRules'),
      // buildSensorsAndActions = require('./buildSensorsAndActions'),
      removeEdgesAndPlacementsWithoutNodes = require('./removeEdgesAndPlacementsWithoutNodes');

function buildGraphParams(model, filters = {}) {
  var graphParams = {
    nodes: [],
    locations: [],
    placements: [],
    edges: []
  };

  buildDevices(model, filters, graphParams);
  buildVirtualSensors(model, filters, graphParams);
  buildLocations(model, filters, graphParams);
  buildRules(model, filters, graphParams);
  removeEdgesAndPlacementsWithoutNodes(graphParams);

  return graphParams;
}

module.exports = buildGraphParams;
