class Repository {
  constructor() {
    this.installations = {};
  }

  addInstallation(installation) {
    this.installations[installation.id] = installation;
  }
}

module.exports = Repository;
