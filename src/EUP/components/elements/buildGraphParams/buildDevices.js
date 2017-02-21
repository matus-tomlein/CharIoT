module.exports = (model, filters, graphParams) => {
  model.devices.forEach((device) => {
    if (filters.showDevices) {
      graphParams.nodes.push({
        id: device.id,
        icon: 'fa-lightbulb-o',
        label: device.name,
        css_class: 'node-lightblue'
      });
    }
  });
};
