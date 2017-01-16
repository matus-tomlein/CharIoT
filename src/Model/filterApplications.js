const _ = require('underscore');

function filterApplications(apps, filter) {
  if (filter.selectedTags && filter.selectedTags.length) {
    apps = _.filter(apps, function (app) {
      return _.intersection(app.tags, filter.selectedTags).length == filter.selectedTags.length;
    });
  }

  if (filter.selectedDeviceTags && filter.selectedDeviceTags.length) {
    apps = _.filter(apps, function (app) {
      return _.intersection(app.usedDeviceUris, filter.selectedDeviceTags).length == filter.selectedDeviceTags.length;
    });
  }

  return apps;
}

module.exports = filterApplications;
