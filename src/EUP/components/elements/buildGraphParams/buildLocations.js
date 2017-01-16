module.exports = (model, filters, graphParams) => {
  if (filters.showLayouts) {
    model.locations.forEach((l) => {
      graphParams.nodes.push({
        id: l.id + '_node',
        icon: 'fa-building-o',
        label: l.name,
        css_class: 'node-textonly'
      });

      graphParams.locations.push({
        id: l.id,
        label: '',
        fill: '#eff1fa'
      });

      graphParams.placements.push({
        of: l.id + '_node',
        in: l.id
      });

      l.devices().forEach((p) => {
        graphParams.placements.push({
          of: p.id,
          in: l.id
        });

        p.sensors.forEach((s) => {
          graphParams.placements.push({
            of: s.id,
            in: l.id
          });
        });

        p.actions.forEach((a) => {
          graphParams.placements.push({
            of: a.id,
            in: l.id
          });
        });
      });
    });
  }
};
