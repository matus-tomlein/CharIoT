module.exports = (model, filters, graphParams) => {
  if (filters.showSensors) {
    model.virtualSensors.forEach((vs) => {
      let className = vs.programmingType == 'Demonstrated' ?
        'node-green' : 'node-yellow';
      graphParams.nodes.push({
        id: vs.id,
        icon: 'fa-thermometer-full',
        label: vs.name,
        css_class: className,
        arrowheadClass: 'greyArrowhead',
        color: '#C0C0C0',
        dashed: true,
        width: '2px'
      });

      vs.sensors.forEach((sensor) => {
        graphParams.edges.push({
          from: vs.id,
          to: sensor.id,
          label: '',
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
