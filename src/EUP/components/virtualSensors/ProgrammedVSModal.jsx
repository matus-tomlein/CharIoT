const React = require('react'),
      $ = require('jquery'),
      _ = require('underscore'),
      browserHistory = require('react-router').browserHistory,

      VirtualSensorCondition = require('../../../chariotModel').VirtualSensorCondition,

      SensorTreeMenu = require('./SensorTreeMenu.jsx'),
      Modal = require('../elements/Modal.jsx');

class Condition extends React.Component {
  constructor(props, context) {
    super(props, context);

    this._labelChanged = this._labelChanged.bind(this);
    this._subjectChanged = this._subjectChanged.bind(this);
    this._operatorChanged = this._operatorChanged.bind(this);
    this._valueChanged = this._valueChanged.bind(this);
    this._remove = this._remove.bind(this);
  }

  _labelChanged(event) {
    let condition = this.props.condition;
    condition.label = event.target.value;
    this.props.conditionChanged();
  }

  _operatorChanged(event) {
    let condition = this.props.condition;
    condition.operator = event.target.value;
    this.props.conditionChanged();
  }

  _subjectChanged(event) {
    let condition = this.props.condition;
    condition.subject = event.target.value;
    this.props.conditionChanged();
  }

  _valueChanged(event) {
    let condition = this.props.condition;
    condition.value = event.target.value;
    this.props.conditionChanged();
  }

  _remove() {
    this.props.removeCondition();
  }

  render() {
    let condition = this.props.condition;
    return <tr>
      <td>
        <input className='form-input'
          type='text' value={condition.label}
          onChange={this._labelChanged} placeholder='Label' />
      </td>

      <td>
        <select className='form-select' value={condition.subject}
          onChange={this._subjectChanged}>
          <option value='LV'>Last value</option>
          <option value='AVG'>Average</option>
          <option value='MIN'>Minimum</option>
          <option value='MAX'>Maximum</option>
        </select>
      </td>

      <td>
        <select className='form-select' value={condition.operator}
          onChange={this._operatorChanged}>
          <option value='EQ'>&#61;</option>
          <option value='NEQ'>&#8800;</option>
          <option value='LT'>&lt;</option>
          <option value='LTE'>&#8804;</option>
          <option value='GT'>&gt;</option>
          <option value='GTE'>&#8805;</option>
        </select>
      </td>

      <td>
        <input className='form-input'
          type='text' value={condition.value}
          onChange={this._valueChanged} placeholder='Value' />
      </td>

      <td>
        <button className='btn btn-link' onClick={this._remove}>
          Remove
        </button>
      </td>
    </tr>;
  }
}

class ProgrammedVSForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { newLabel: '' };

    this._addNewCondition = this._addNewCondition.bind(this);
    this._nameChanged = this._nameChanged.bind(this);
    this._onSensorChanged = this._onSensorChanged.bind(this);
    this._onConditionChanged = this._onConditionChanged.bind(this);
  }

  _nameChanged(event) {
    let sensor = this.props.sensor;
    sensor.name = event.target.value;
    this.props.updateSensor(sensor);
  }

  _addNewCondition() {
    let sensor = this.props.sensor;
    let condition = new VirtualSensorCondition({});
    sensor.addCondition(condition);
    this.props.updateSensor(sensor);
  }

  _onConditionChanged() {
    let sensor = this.props.sensor;
    this.props.updateSensor(sensor);
  }

  _onSensorChanged(id, checked) {
    if (checked) {
      let sensor = this.props.sensor;
      sensor.inputs = [id];
      this.props.updateSensor(sensor);
    }
  }

  render() {
    let sensor = this.props.sensor;

    let conditions = sensor.conditions.map((c, i) => {
      let remove = () => {
        sensor.data.conditions.splice(i, 1);
        this.props.updateSensor(sensor);
      };
      return <Condition
        removeCondition={remove}
        conditionChanged={this._onConditionChanged}
        condition={c} i={i} />;
    });
    let chosenSensor = '';
    if (sensor.sensors.length) {
      let s = sensor.sensors[0];
      chosenSensor = '(' + s.device.name + ' – ' + s.name + ')';
    }

    return <div>
      <div className="form-group">
        <label className='form-label' for='input-name'><b>Name</b></label>
        <input className='form-input' type='text' value={sensor.name}
          onChange={this._nameChanged} id='input-name' placeholder='Name' />
      </div>

      <div className='form-group'>
        <label className='form-label'>
          <b>Sensor</b><br />
          <i>{chosenSensor}</i>
        </label>
        <SensorTreeMenu
          selectable={true}
          sensorChanged={this._onSensorChanged}
          model={this.props.model} />
      </div>

      <div className='form-group'>
        <label className='form-label'><b>Conditions</b></label>

        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>Label</th>
              <th>Subject</th>
              <th>Operator</th>
              <th>Value</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

          <tbody>
            {conditions}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan='5'>
                <button className='btn' onClick={this._addNewCondition}>
                  Add condition
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>;
  }
}

class ConfiguredVSModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sensor: props.sensor,
      submitting: false
    };

    this._updateSensor = this._updateSensor.bind(this);
    this._submit = this._submit.bind(this);
    this._edit = this._edit.bind(this);
  }

  _edit() { this.setState({training: false}); }
  _updateSensor(sensor) { this.setState({sensor: sensor}); }

  _submit() {
    let sensor = this.state.sensor;
    sensor.labels = _.uniq(sensor.conditions.map((c) => { return c.label; }));
    if (sensor.labels.length) {
      this.setState({submitting: true});
    }
  }

  render() {
    let sensor = this.state.sensor;
    let actions = [
      <button className='btn btn-link' onClick={this.props.close}>Cancel</button>
    ];

    let body;
    if (this.state.submitting) {
      $.post('/api/virtualSensors', sensor.data, () => {
        browserHistory.push('/refresh');
      });

      body = <div className='text-center'>
        <Loading text='Training...' />
      </div>;
    } else {
      body = <ProgrammedVSForm sensor={sensor}
        model={this.props.model}
        updateSensor={this._updateSensor} />;
      actions.push(
        <button className='btn btn-primary' onClick={this._submit}>Submit</button>
      );
    }

    return <Modal title='Programmed event'
        footer={actions}
        cancel={this.props.close}>
        {body}
      </Modal>;
  }
}

module.exports = ConfiguredVSModal;
