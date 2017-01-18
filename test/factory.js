const InstallationFactory = require('./InstallationFactory');

module.exports = (callback) => {
  let installationFactory = new InstallationFactory();
  if (callback) {
    callback(installationFactory);
  }
  return installationFactory.model;
};
