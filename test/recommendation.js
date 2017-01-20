/* global describe it */
const expect = require('chai').expect,
      Repository = require('../src/Hub/Repository'),
      RecommendationService = require('../src/Hub/RecommendationService'),
      InstallationFactory = require('./InstallationFactory');

describe('recommendation', () => {
  it('doesn\'t recommend rules from installations with too different sensor measurements (outside and living room)', (done) => {
    let outside = new InstallationFactory();
    outside.sensortag('Garden', (tag) => { tag.outsideInWinter(); });
    outside.rule((rule) => {
      rule.sensorConditionInLocation('Lux', 'GT', 0, 'Garden');
      rule.actionOnDevice('Red LED', 'Garden');
    }).typeId;

    let livingRoom = new InstallationFactory();
    livingRoom.sensortag('Living room', (tag) => { tag.livingRoom(); });

    recommendRules([ outside ], livingRoom, (rules) => {
      expect(rules.length).to.equal(0);

      done();
    });
  });

  it('doesn\'t recommend rules from installations with too different devices and rules installed', () => {
    expect(false).to.eq(true);
  });
});

function recommendRules(repositoryInstallations, installation, callback) {
  let repository = new Repository();
  repositoryInstallations.forEach((i) => {
    repository.addInstallation(i.model);
    repository.addInstallationDataModel(i.dataModel);
  });
  repository.addInstallation(installation.model);
  repository.addInstallationDataModel(installation.dataModel);

  let recommendationService = new RecommendationService(installation.model, repository);
  recommendationService.recommendRules((err, rules) => {
    expect(err).not.to.be.ok;
    callback(rules);
  });
}
