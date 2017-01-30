/* global describe it */
const expect = require('chai').expect,
      RecommendationService = require('../src/Hub/RecommendationService'),
      Repository = require('../src/Hub/Repository'),
      InstallationFactory = require('./InstallationFactory');

describe('collaborative filtering', () => {
  describe('recommending rules based on a rule', () => {
    it('recommends a rule which has been previously installed with it', () => {
      let meetingRoom = new InstallationFactory();
      meetingRoom.sensortag('Meeting room', (tag) => { tag.meetingRoom(); });
      meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionInLocation('Buzzer', 'Meeting room');
      });

      meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Humidity', 'LT', 20, 'Meeting room');
        rule.actionInLocation('Red LED', 'Meeting room');
      });

      let garage = new InstallationFactory();
      garage.sensortag('Garage', (tag) => { tag.garageInWinter(); });
      let rule = garage.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionInLocation('Buzzer', 'Meeting room');
      });

      recommendForRule([ meetingRoom ], garage, rule, (rules) => {
        expect(rules.length).to.equal(1);
      });
    });

    it('doesn\'t recommend a rule that has not been installed with it', () => {
      let meetingRoom = new InstallationFactory();
      meetingRoom.sensortag('Meeting room', (tag) => { tag.meetingRoom(); });
      meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Humidity', 'LT', 20, 'Meeting room');
        rule.actionInLocation('Red LED', 'Meeting room');
      });

      let garage = new InstallationFactory();
      garage.sensortag('Garage', (tag) => { tag.garageInWinter(); });
      let rule = garage.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionInLocation('Buzzer', 'Meeting room');
      });

      recommendForRule([ meetingRoom ], garage, rule, (rules) => {
        expect(rules.length).to.equal(0);
      });
    });

    it('gives a higher importance to a rule that was installed more often with it', () => {
      let meetingRoom = new InstallationFactory();
      meetingRoom.sensortag('Meeting room', (tag) => { tag.meetingRoom(); });
      meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionInLocation('Buzzer', 'Meeting room');
      });
      meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Humidity', 'LT', 20, 'Meeting room');
        rule.actionInLocation('Red LED', 'Meeting room');
      });
      meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Lux', 'EQ', 100, 'Meeting room');
        rule.actionInLocation('Green LED', 'Meeting room');
      });

      let garage = new InstallationFactory();
      garage.sensortag('Garage', (tag) => { tag.garageInWinter(); });
      garage.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionInLocation('Buzzer', 'Meeting room');
      });
      garage.rule((rule) => {
        rule.sensorConditionInLocation('Humidity', 'LT', 20, 'Meeting room');
        rule.actionInLocation('Red LED', 'Meeting room');
      });

      let livingRoom = new InstallationFactory();
      livingRoom.sensortag('Living room', (tag) => { tag.livingRoom(); });
      let rule = livingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionInLocation('Buzzer', 'Meeting room');
      });

      recommendForRule([ meetingRoom, garage ], livingRoom, rule, (rules) => {
        expect(rules.length).to.equal(2);
        let firstCondition = rules[0].conditions[0];
        expect(firstCondition.sensorType).to.equal('Humidity');
      });
    });
  });

  describe('recommending rules based on a device', () => {
    it('recommends a rule which has been previously installed with it', () => {
      let meetingRoom = new InstallationFactory();
      meetingRoom.sensortag('Meeting room', (tag) => { tag.meetingRoom(); });
      let smartPlugMR = meetingRoom.smartPlug('Meeting room');
      let smartLightsMR = meetingRoom.smartLights('Meeting room');
      meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionOnDevice('Trigger', smartPlugMR);
      });
      meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Humidity', 'LT', 20, 'Meeting room');
        rule.actionOnDevice('Trigger', smartPlugMR);
      });
      meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Lux', 'LT', 20, 'Meeting room');
        rule.actionOnDevice('Trigger', smartLightsMR);
      });

      let garage = new InstallationFactory();
      garage.sensortag('Garage', (tag) => { tag.garageInWinter(); });
      let smartPlugGR = garage.smartPlug('Garage');
      garage.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionOnDevice('Trigger', smartPlugGR);
      });

      recommendForDevice([ meetingRoom ], garage, smartPlugGR, (rules) => {
        expect(rules.length).to.equal(1);
        let firstCondition = rules[0].conditions[0];
        expect(firstCondition.sensorType).to.equal('Humidity');
      });
    });
  });
});

function recommendForRule(repositoryInstallations, installation, rule, callback) {
  let repository = new Repository();
  repositoryInstallations.forEach((i) => {
    repository.addInstallation(i.model);
    repository.addInstallationDataModel(i.dataModel);
  });
  repository.addInstallation(installation.model);
  repository.addInstallationDataModel(installation.dataModel);

  let recommendationService = new RecommendationService(installation.model, repository);
  recommendationService.recommendRules((err, recommendations) => {
    expect(err).not.to.be.ok;
    callback(recommendations.rulesRelatedToRule(rule));
  });
}

function recommendForDevice(repositoryInstallations, installation, device, callback) {
  let repository = new Repository();
  repositoryInstallations.forEach((i) => {
    repository.addInstallation(i.model);
    repository.addInstallationDataModel(i.dataModel);
  });
  repository.addInstallation(installation.model);
  repository.addInstallationDataModel(installation.dataModel);

  let recommendationService = new RecommendationService(installation.model, repository);
  recommendationService.recommendRules((err, recommendations) => {
    expect(err).not.to.be.ok;
    callback(recommendations.rulesRelatedToDevice(device));
  });
}
