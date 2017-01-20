/* global describe it */
const expect = require('chai').expect,
      Repository = require('../src/Hub/Repository'),
      RuleGenerator = require('../src/Hub/Recommendation/RuleGenerator'),
      factory = require('./factory');

function generateRules(repositoryInstallations, installation, callback) {
  let repository = new Repository();
  repositoryInstallations.forEach((i) => {
    repository.addInstallation(i);
  });

  let ruleGenerator = new RuleGenerator(repository, installation);
  ruleGenerator.generate((err, rules) => {
    expect(err).not.to.be.ok;
    callback(rules);
  });
}

describe('generating rules', () => {
  it('transfers a rule targeting a location', (done) => {
    generateRules([
      factory((inst) => {
        inst.sensortag('Living room');
        inst.rule((rule) => {
          rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Living room');
          rule.actionInLocation('Buzzer', 'Living room');
        });
      })
    ], factory((inst) => {
      inst.sensortag('Bedroom');
    }), (rules) => {
      expect(rules.length).to.equal(1);
      let rule = rules[0];

      let condition = rule.conditions[0];
      expect(condition.location.name).to.equal('Bedroom');

      let action = rule.actions[0];
      expect(action.actionType).to.equal('Buzzer');
      done();
    });
  });

  it('transfers a rule targeting a device', (done) => {
    generateRules([
      factory((inst) => {
        let tag = inst.sensortag('Kitchen');
        inst.rule((rule) => {
          rule.sensorConditionInLocation('Humidity', 'LT', 100, 'Kitchen');
          rule.sensorConditionOnDevice('Lux', 'GT', 0, tag);
          rule.actionOnDevice('Red LED', tag);
        });
      })
    ], factory((inst) => {
      inst.sensortag('Bedroom');
    }), (rules) => {
      expect(rules.length).to.equal(1);
      let rule = rules[0];

      expect(rule.conditions.length).to.equal(2);
      expect(rule.actions.length).to.equal(1);
      expect(rule.actions[0].device).to.be.ok;
      done();
    });
  });

  it('generates the rule for all locations', (done) => {
    generateRules([
      factory((inst) => {
        inst.sensortag('Living room');
        inst.rule((rule) => {
          rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Living room');
          rule.actionInLocation('Buzzer', 'Living room');
        });
      })
    ], factory((inst) => {
      inst.sensortag('Bedroom');
      inst.sensortag('Bathroom');
    }), (rules) => {
      expect(rules.length).to.equal(2);
      done();
    });
  });

  it('doesn\'t transfer a rule when there aren\'t any devices', (done) => {
    generateRules([
      factory((inst) => {
        inst.sensortag('Living room');
        inst.rule((rule) => {
          rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Living room');
          rule.actionInLocation('Buzzer', 'Living room');
        });
      })
    ],
    factory(), // blank installation
    (rules) => {
      expect(rules.length).to.equal(0);
      done();
    });
  });

  it('transfers rules from two installations', (done) => {
    generateRules([

      factory((inst) => {
        inst.sensortag('Living room');
        inst.rule((rule) => {
          rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Living room');
          rule.actionInLocation('Buzzer', 'Living room');
        });
      }),

      factory((inst) => {
        let tag = inst.sensortag('Kitchen');
        inst.rule((rule) => {
          rule.sensorConditionInLocation('Humidity', 'LT', 100, 'Kitchen');
          rule.sensorConditionInLocation('Lux', 'GT', 0, 'Kitchen');
          rule.actionOnDevice('Red LED', tag);
        });
      })

    ], factory((inst) => {
      inst.sensortag('Bedroom');
    }), (rules) => {
      expect(rules.length).to.equal(2);
      done();
    });
  });

  it('doesn\'t generate already installed rules', (done) => {
    generateRules([

      factory((inst) => {
        let tag = inst.sensortag('Kitchen');
        inst.rule((rule) => {
          rule.sensorConditionInLocation('Humidity', 'LT', 100, 'Kitchen');
          rule.actionOnDevice('Red LED', tag);
        });
      })

    ], factory((inst) => {
      let tag = inst.sensortag('Bedroom');
      inst.rule((rule) => {
        rule.sensorConditionInLocation('Humidity', 'LT', 100, 'Bedroom');
        rule.actionOnDevice('Red LED', tag);
      });
    }), (rules) => {
      expect(rules.length).to.equal(0);
      done();
    });
  });

  describe('with virtual sensors', () => {
    it('transfers a rule with a new virtual sensor', (done) => {
      generateRules([

        factory((inst) => {
          inst.sensortag('Living room');
          let vs = inst.virtualSensor('Day or night', ['Day', 'Night'], (vs) => {
            vs.location = 'Living room';
            vs.sensors = [ 'Temperature', 'Lux' ];
          });

          inst.rule((rule) => {
            rule.virtualSensorCondition(vs, 'Night');
            rule.actionInLocation('Buzzer', 'Living room');
          });
        })

      ], factory((inst) => {
        inst.sensortag('Bedroom');
      }), (rules) => {
        expect(rules.length).to.equal(1);

        let virtualSensor = rules[0].conditions[0].recommendedVirtualSensor;
        expect(virtualSensor).to.be.ok;
        expect(virtualSensor.name).to.eq('Day or night');
        expect(virtualSensor.locationName).to.eq('Bedroom');

        done();
      });
    });

    it('uses an existing virtual sensors when available', (done) => {
      generateRules([

        factory((inst) => {
          inst.sensortag('Living room');
          let vs = inst.virtualSensor('Day or night', ['Day', 'Night'], (vs) => {
            vs.location = 'Living room';
            vs.sensors = [ 'Temperature', 'Lux' ];
          });

          inst.rule((rule) => {
            rule.virtualSensorCondition(vs, 'Night');
            rule.actionInLocation('Buzzer', 'Living room');
          });
        })

      ], factory((inst) => {
        inst.sensortag('Bedroom');

        inst.virtualSensor('Day or night', ['Night', 'Day'], (vs) => {
          vs.location = 'Bedroom';
          vs.sensors = [ 'Temperature', 'Lux' ];
        });
      }), (rules) => {
        expect(rules.length).to.equal(1);

        let recommendedVirtualSensor = rules[0].conditions[0].recommendedVirtualSensor;
        expect(recommendedVirtualSensor).not.to.be.ok;
        let virtualSensor = rules[0].conditions[0].virtualSensor;
        expect(virtualSensor).to.be.ok;

        done();
      });
    });

    it('doesn\'t use an existing virtual sensors if the labels are different', (done) => {
      generateRules([

        factory((inst) => {
          inst.sensortag('Living room');
          let vs = inst.virtualSensor('Day or night', ['Day', 'Night'], (vs) => {
            vs.location = 'Living room';
            vs.sensors = [ 'Temperature', 'Lux' ];
          });

          inst.rule((rule) => {
            rule.virtualSensorCondition(vs, 'Night');
            rule.actionInLocation('Buzzer', 'Living room');
          });
        })

      ], factory((inst) => {
        inst.sensortag('Bedroom');

        inst.virtualSensor('Day or night', ['Morning', 'Evening'], (vs) => {
          vs.location = 'Bedroom';
          vs.sensors = [ 'Temperature', 'Lux' ];
        });
      }), (rules) => {
        expect(rules.length).to.equal(1);

        let virtualSensor = rules[0].conditions[0].referencedVirtualSensor;
        expect(virtualSensor).not.to.be.ok;
        let recommendedVirtualSensor = rules[0].conditions[0].recommendedVirtualSensor;
        expect(recommendedVirtualSensor).to.be.ok;

        done();
      });
    });
  });
});
