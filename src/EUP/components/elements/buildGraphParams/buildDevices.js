module.exports = (model, filters, graphParams) => {
  model.devices.forEach((device) => {
    if (filters.showDevices) {
      graphParams.nodes.push({
        id: device.id,
        icon: 'fa-lightbulb-o',
        label: device.name,
        css_class: 'node-lightgreen'
      });
    }

    if (filters.showSensors) {
      device.sensors.forEach((s) => {
        graphParams.nodes.push({
          id: s.id,
          icon: 'fa-thermometer-half',
          label: s.name + ' on ' + device.name,
          css_class: 'node-blue',
          removeIfNoEdges: true
        });

        graphParams.edges.push({
          from: s.id,
          to: device.id,
          label: '',
          lineInterpolateBasis: false,
          color: '#C0C0C0',
          dashed: false,
          arrowhead: 'undirected'
        });
      });

    }

    if (filters.showActions) {
      device.actions.forEach((a) => {
        graphParams.nodes.push({
          id: a.id,
          icon: 'fa-cog',
          label: a.name + ' on ' + device.name,
          css_class: 'node-lightred',
          removeIfNoEdges: true
        });

        graphParams.edges.push({
          from: a.id,
          to: device.id,
          label: '',
          lineInterpolateBasis: false,
          color: '#C0C0C0',
          dashed: false,
          arrowhead: 'undirected'
        });
      });
    }
  });
};
