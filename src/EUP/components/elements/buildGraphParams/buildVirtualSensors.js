module.exports = (model, filters, graphParams) => {
  if (filters.showSensors) {
    model.virtualSensors.forEach((vs) => {
      let className = vs.programmingType == 'Demonstrated' ?
        'node-green' : 'node-yellow';
      let label = vs.name;
      if (vs.value) {
        label += ' (' + vs.value + ')';
      }

      graphParams.nodes.push({
        id: vs.id,
        icon: 'fa-thermometer-full',
        label: label,
        css_class: className,
        arrowheadClass: 'greyArrowhead',
        color: '#C0C0C0',
        dashed: true,
        width: '2px'
      });

      vs.sensors.forEach((sensor) => {
        graphParams.edges.push({
          from: vs.id,
          to: sensor.device.id,
          label: sensor.name,
          lineInterpolateBasis: false,
          color: '#C0C0C0',
          dashed: false,
          arrowhead: 'undirected'
        });
      });

      vs.locations.forEach((location) => {
        graphParams.placements.push({
          of: vs.id,
          in: location.id
        });
      });
    });
  }
};
