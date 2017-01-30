/* global describe it */
const expect = require('chai').expect,
      Repository = require('../src/Hub/Repository'),
      RuleGenerator = require('../src/Hub/Recommendation/RuleGenerator'),
      SensorSimilarityRanking = require('../src/Hub/Recommendation/SensorSimilarityRanking'),
      InstallationFactory = require('./InstallationFactory');

describe('ranking rules by sensor similarity', () => {
  describe('living room', () => {
    it('ranks rules from meeting room higher than from garage', (done) => {
      let meetingRoom = new InstallationFactory();
      meetingRoom.sensortag('Meeting room', (tag) => { tag.meetingRoom(); });
      meetingRoom.sensortag('Meeting room', (tag) => { tag.meetingRoom(); });
      let meetingRoomRuleType = meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionInLocation('Buzzer', 'Meeting room');
      }).typeId;

      let garage = new InstallationFactory();
      garage.sensortag('Garage', (tag) => { tag.garageInWinter(); });
      garage.sensortag('Garage', (tag) => { tag.garageInWinter(); });
      let garageRuleType = garage.rule((rule) => {
        rule.sensorConditionInLocation('Lux', 'GT', 0, 'Garage');
        rule.actionOnDevice('Red LED', 'Garage');
      }).typeId;

      let livingRoom = new InstallationFactory();
      livingRoom.sensortag('Living room', (tag) => { tag.livingRoom(); });

      rankRules([ meetingRoom, garage ], livingRoom, (rules, ranks) => {
        expect(rules.length).to.equal(2);

        let meetingRuleRank = ranks[meetingRoomRuleType].rank;
        let garageRuleRank = ranks[garageRuleType].rank;

        expect(meetingRuleRank).to.be.above(garageRuleRank);

        done();
      });
    });

    it('ranks rules from a sensor in meeting room higher than from a sensor in garage', (done) => {
      let meetingRoom = new InstallationFactory();
      let meetingRoomTag = meetingRoom.sensortag('Meeting room', (tag) => { tag.meetingRoom(); });
      let meetingRoomRuleType = meetingRoom.rule((rule) => {
        rule.sensorConditionOnDevice('Temperature', 'GT', 20, meetingRoomTag);
        rule.actionInLocation('Buzzer', 'Meeting room');
      }).typeId;

      let garage = new InstallationFactory();
      let garageTag = garage.sensortag('Garage', (tag) => { tag.garageInWinter(); });
      let garageRuleType = garage.rule((rule) => {
        rule.sensorConditionOnDevice('Lux', 'GT', 0, garageTag);
        rule.actionOnDevice('Red LED', 'Garage');
      }).typeId;

      let livingRoom = new InstallationFactory();
      livingRoom.sensortag('Living room', (tag) => {
        tag.livingRoom();
      });

      rankRules([ meetingRoom, garage ], livingRoom, (rules, ranks) => {
        expect(rules.length).to.equal(2);

        let meetingRuleRank = ranks[meetingRoomRuleType].rank;
        let garageRuleRank = ranks[garageRuleType].rank;

        expect(meetingRuleRank).to.be.above(garageRuleRank);

        done();
      });
    });

    it('ranks rules with virtual sensors from meeting room higher than from garage', (done) => {
      let meetingRoom = new InstallationFactory();
      meetingRoom.sensortag('Meeting room', (tag) => { tag.meetingRoom(); });
      let meetingRoomVS = meetingRoom.virtualSensor('Day or night', ['Day', 'Night'], (vs) => {
        vs.location = 'Meeting room';
        vs.sensors = [ 'Temperature', 'Lux' ];
      });
      let meetingRoomRule = meetingRoom.rule((rule) => {
        rule.virtualSensorCondition(meetingRoomVS, 'Night');
        rule.actionInLocation('Buzzer', 'Meeting room');
      });
      let meetingRoomRuleType = meetingRoomRule.typeId;

      let garage = new InstallationFactory();
      garage.sensortag('Garage', (tag) => { tag.garageInWinter(); });
      let garageVS = garage.virtualSensor('Morning or evening', ['Morning', 'Evening'], (vs) => {
        vs.location = 'Garage';
        vs.sensors = [ 'Temperature', 'Lux' ];
      });
      let garageRule = garage.rule((rule) => {
        rule.virtualSensorCondition(garageVS, 'Evening');
        rule.actionInLocation('Red LED', 'Garage');
      });
      let garageRuleType = garageRule.typeId;

      let livingRoom = new InstallationFactory();
      livingRoom.sensortag('Living room', (tag) => { tag.livingRoom(); });

      rankRules([ meetingRoom, garage ], livingRoom, (rules, ranks) => {
        expect(rules.length).to.equal(2);

        let meetingRuleRank = ranks[meetingRoomRuleType].rank;
        let garageRuleRank = ranks[garageRuleType].rank;

        expect(meetingRuleRank).to.be.above(garageRuleRank);

        done();
      });
    });

    it('if a rule is in both, gives rank based on meeting room, not outside', (done) => {
      let meetingRoom = new InstallationFactory();
      meetingRoom.sensortag('Meeting room', (tag) => { tag.meetingRoom(); });
      let meetingRoomRuleType = meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionInLocation('Buzzer', 'Meeting room');
      }).typeId;

      let garage = new InstallationFactory();
      garage.sensortag('Garage', (tag) => { tag.garageInWinter(); });
      let garageRuleType = garage.rule((rule) => {
        rule.sensorConditionInLocation('Lux', 'GT', 0, 'Garage');
        rule.actionOnDevice('Red LED', 'Garage');
      }).typeId;

      let outside = new InstallationFactory();
      outside.sensortag('Outside', (tag) => { tag.outsideInWinter(); });
      let outsideRuleType = outside.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Outside');
        rule.actionInLocation('Buzzer', 'Outside');
      }).typeId;

      let livingRoom = new InstallationFactory();
      livingRoom.sensortag('Living room', (tag) => { tag.livingRoom(); });

      rankRules([ meetingRoom, garage, outside ], livingRoom, (rules, ranks) => {
        expect(meetingRoomRuleType).to.equal(outsideRuleType);

        let meetingRuleRank = ranks[meetingRoomRuleType].rank;
        let garageRuleRank = ranks[garageRuleType].rank;

        expect(meetingRuleRank).to.be.above(garageRuleRank);

        done();
      });
    });

    it('if there are rules with the same type, but slightly different adaptations, recommends the one from the most similar location', (done) => {
      let meetingRoom = new InstallationFactory();
      meetingRoom.sensortag('Meeting room', (tag) => { tag.meetingRoom(); });
      meetingRoom.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Meeting room');
        rule.actionInLocation('Buzzer', 'Meeting room');
      });

      let outside = new InstallationFactory();
      outside.sensortag('Outside', (tag) => { tag.outsideInWinter(); });
      outside.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', -1, 'Outside');
        rule.actionInLocation('Buzzer', 'Outside');
      }).typeId;

      let garage = new InstallationFactory();
      garage.sensortag('Garage', (tag) => { tag.garageInWinter(); });
      garage.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 0, 'Garage');
        rule.actionInLocation('Buzzer', 'Garage');
      });

      let livingRoom = new InstallationFactory();
      livingRoom.sensortag('Living room', (tag) => { tag.livingRoom(); });

      rankRules([ outside, meetingRoom, garage ], livingRoom, (rules, ranks) => {
        let rankTypes = Object.keys(ranks);
        expect(rankTypes.length).to.equal(1);

        let rule = rules.find((rule) => { return rule.id == ranks[rankTypes[0]].ruleId; });

        let condition = rule.conditions[0];
        let conditionValue = condition.attributes.condition.value;
        expect(conditionValue).to.be.equal(20);

        done();
      });
    });
  });
});

function rankRules(repositoryInstallations, installation, callback) {
  let repository = new Repository();
  repositoryInstallations.forEach((i) => {
    repository.addInstallation(i.model);
    repository.addInstallationDataModel(i.dataModel);
  });
  repository.addInstallation(installation.model);
  repository.addInstallationDataModel(installation.dataModel);

  let ruleGenerator = new RuleGenerator(repository, installation.model);
  ruleGenerator.generate((err, rules) => {
    expect(err).not.to.be.ok;

    let ranker = new SensorSimilarityRanking(rules, repository);
    ranker.rank((err, ranks) => {
      expect(err).not.to.be.ok;
      callback(rules, ranks);
    });
  });
}
