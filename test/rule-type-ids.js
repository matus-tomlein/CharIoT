/* global describe it */
const expect = require('chai').expect,
      factory = require('./factory');

describe('rule type identifiers', () => {
  it('are the same for rules with the same location features', () => {
    let id1, id2;

    factory((inst) => {
      inst.sensortag('Living room');
      let rule = inst.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Living room');
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id1 = rule.typeId;
    });

    factory((inst) => {
      inst.sensortag('Bedroom');
      let rule = inst.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Living room');
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id2 = rule.typeId;
    });

    expect(id1).to.eq(id2);
  });

  it('are the same for rules with the same device features', () => {
    let id1, id2;

    factory((inst) => {
      let tag = inst.sensortag('Living room');
      let rule = inst.rule((rule) => {
        rule.sensorConditionOnDevice('Temperature', 'GT', 20, tag);
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id1 = rule.typeId;
    });

    factory((inst) => {
      let tag = inst.sensortag('Bedroom');
      let rule = inst.rule((rule) => {
        rule.sensorConditionOnDevice('Temperature', 'GT', 20, tag);
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id2 = rule.typeId;
    });

    expect(id1).to.eq(id2);
  });

  it('are different for rules targeting locations and devices', () => {
    let id1, id2;

    factory((inst) => {
      inst.sensortag('Living room');
      let rule = inst.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Living room');
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id1 = rule.typeId;
    });

    factory((inst) => {
      let tag = inst.sensortag('Bedroom');
      let rule = inst.rule((rule) => {
        rule.sensorConditionOnDevice('Temperature', 'GT', 20, tag);
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id2 = rule.typeId;
    });

    expect(id1).not.to.eq(id2);
  });

  it('are the same for rules with similar virtual sensors', () => {
    let id1, id2;

    factory((inst) => {
      inst.sensortag('Living room');
      let vs = inst.virtualSensor('Day or night', ['Day', 'Night'], (vs) => {
        vs.location = 'Living room';
        vs.sensors = [ 'Temperature', 'Lux' ];
      });

      let rule = inst.rule((rule) => {
        rule.virtualSensorCondition(vs, 'Night');
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id1 = rule.typeId;
    });

    factory((inst) => {
      inst.sensortag('Bedroom');
      let vs = inst.virtualSensor('Day or night', ['Day', 'Night'], (vs) => {
        vs.location = 'Bedroom';
        vs.sensors = [ 'Temperature', 'Lux' ];
      });

      let rule = inst.rule((rule) => {
        rule.virtualSensorCondition(vs, 'Night');
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id2 = rule.typeId;
    });

    expect(id1).to.eq(id2);
  });

  it('are different for rules with different virtual sensors', () => {
    let id1, id2;

    factory((inst) => {
      inst.sensortag('Living room');
      let vs = inst.virtualSensor('Day or night', ['Day', 'Night'], (vs) => {
        vs.location = 'Living room';
        vs.sensors = [ 'Temperature', 'Lux' ];
      });

      let rule = inst.rule((rule) => {
        rule.virtualSensorCondition(vs, 'Night');
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id1 = rule.typeId;
    });

    factory((inst) => {
      inst.sensortag('Bedroom');
      let vs = inst.virtualSensor('Day or night', ['Morning', 'Night'], (vs) => {
        vs.location = 'Bedroom';
        vs.sensors = [ 'Temperature', 'Lux' ];
      });

      let rule = inst.rule((rule) => {
        rule.virtualSensorCondition(vs, 'Night');
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id2 = rule.typeId;
    });

    expect(id1).not.to.eq(id2);
  });

  it('doesn\'t care about the order of conditions and actions', () => {
    let id1, id2;

    factory((inst) => {
      inst.sensortag('Living room');
      let vs = inst.virtualSensor('Day or night', ['Day', 'Night'], (vs) => {
        vs.location = 'Living room';
        vs.sensors = [ 'Temperature', 'Lux' ];
      });

      let rule = inst.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'LT', 1, 'Living room');
        rule.virtualSensorCondition(vs, 'Night');
        rule.actionInLocation('Red LED', 'Living room');
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id1 = rule.typeId;
    });

    factory((inst) => {
      inst.sensortag('Bedroom');
      let vs = inst.virtualSensor('Day or night', ['Day', 'Night'], (vs) => {
        vs.location = 'Bedroom';
        vs.sensors = [ 'Temperature', 'Lux' ];
      });

      let rule = inst.rule((rule) => {
        rule.virtualSensorCondition(vs, 'Night');
        rule.sensorConditionInLocation('Temperature', 'LT', 1, 'Bedroom');
        rule.actionInLocation('Buzzer', 'Bedroom');
        rule.actionInLocation('Red LED', 'Bedroom');
      });
      id2 = rule.typeId;
    });

    expect(id1).to.eq(id2);
  });

  it('doesn\'t care about the specific attributes of rules (e.g., "> 1" or "< 10")', () => {
    let id1, id2;

    factory((inst) => {
      inst.sensortag('Bedroom');

      let rule1 = inst.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 1, 'Bedroom');
        rule.actionInLocation('Red LED', 'Bedroom');
      });
      id1 = rule1.typeId;

      let rule2 = inst.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'LT', 10, 'Bedroom');
        rule.actionInLocation('Red LED', 'Bedroom');
      });
      id2 = rule2.typeId;
    });

    expect(id1).to.eq(id2);
  });

  it('can also generate a type identifier that cares about the attributes ', () => {
    let id1, id2;

    factory((inst) => {
      inst.sensortag('Living room');
      let rule = inst.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'GT', 20, 'Living room');
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id1 = rule.typeIdWithAttributes;
    });

    factory((inst) => {
      inst.sensortag('Bedroom');
      let rule = inst.rule((rule) => {
        rule.sensorConditionInLocation('Temperature', 'LT', 1, 'Bedroom');
        rule.actionInLocation('Buzzer', 'Living room');
      });
      id2 = rule.typeIdWithAttributes;
    });

    expect(id1).not.to.eq(id2);
  });

});
