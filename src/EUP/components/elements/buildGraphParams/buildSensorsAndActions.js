module.exports = (model, filters, graphParams) => {
  model.locations.forEach((l) => {
    if (filters.showSensors) {
      l.sensors().forEach((s) => {
        graphParams.nodes.push({
          id: s.id,
          icon: 'fa-thermometer-empty',
          label: s.name,
          css_class: 'node-lightblue',
          removeIfNoEdges: true
        });

        graphParams.placements.push({
          of: s.id,
          in: l.id
        });

        s.devices.forEach((d) => {
          graphParams.edges.push({
            from: s.id,
            to: d.id,
            label: '',
            lineInterpolateBasis: false,
            color: '#C0C0C0',
            dashed: false,
            arrowhead: 'undirected'
          });
        });
      });
    }

    if (filters.showActions) {
      l.actions().forEach((a) => {
        graphParams.nodes.push({
          id: a.id,
          icon: 'fa-cog',
          label: a.name,
          css_class: 'node-purple',
          removeIfNoEdges: true
        });

        graphParams.placements.push({
          of: a.id,
          in: l.id
        });

        a.devices.forEach((d) => {
          graphParams.edges.push({
            from: a.id,
            to: d.id,
            label: '',
            lineInterpolateBasis: false,
            color: '#C0C0C0',
            dashed: false,
            arrowhead: 'undirected'
          });
        });
      });
    }
  });
};
