module.exports = (model, filters, graphParams) => {
  if (filters.showSensors) {
    model.virtualSensors.forEach((vs) => {
      graphParams.nodes.push({
        id: vs.id,
        icon: 'fa-thermometer-full',
        label: vs.name,
        css_class: 'node-green',
        arrowheadClass: 'greyArrowhead',
        color: '#C0C0C0',
        dashed: true,
        width: '2px'
      });

      if (vs.locationName) {
        var location = vs.location;

        graphParams.placements.push({
          of: vs.id,
          in: location.id
        });

        location.sensors.forEach((sensor) => {
          if (!vs.sensors.includes(sensor.name)) return;

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
      }
    });
  }
};
