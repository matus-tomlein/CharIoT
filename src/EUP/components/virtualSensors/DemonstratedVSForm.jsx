const React = require('react'),

      SensorTreeMenu = require('./SensorTreeMenu.jsx');


class VSForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { newLabel: '' };

    this._newLabelChanged = this._newLabelChanged.bind(this);
    this._addNewLabel = this._addNewLabel.bind(this);
    this._nameChanged = this._nameChanged.bind(this);
    this._onSensorChanged = this._onSensorChanged.bind(this);
  }

  _nameChanged(event) {
    let sensor = this.props.sensor;
    sensor.name = event.target.value;
    this.props.updateSensor(sensor);
  }

  _newLabelChanged(event) {
    this.setState({ newLabel: event.target.value });
  }

  _addNewLabel() {
    let sensor = this.props.sensor;
    if (this.state.newLabel) {
      sensor.addLabel(this.state.newLabel);
      this.props.updateSensor(sensor);
      this.setState({newLabel: ''});
    }
  }

  _onSensorChanged(id, checked) {
    let sensor = this.props.sensor;
    if (checked) { sensor.addSensorUuid(id); }
    else { sensor.removeSensorUuid(id); }
    this.props.updateSensor(sensor);
  }

  render() {
    let sensor = this.props.sensor;
    var labels = sensor.labels.map((label) => {
      var remove = () => {
        var labels = sensor.labels;
        var index = labels.indexOf(label);
        if (index > -1) {
          labels.splice(index, 1);
          this.setState({ labels: labels });
        }
      };

      return <span> <div className='chip-sm'>
        <span className='chip-name'>
          <i className="fa fa-tag" aria-hidden="true"></i> {label}
        </span>
        <button className='btn btn-clear' onClick={remove}></button>
      </div> </span>;
    });

    let selectedInputs = sensor.sensors.map((s) => {
      return s.device.name + ' – ' + s.name;
    }).join(', ');

    return <div>
      <div className="form-group">
        <label className='form-label' for='input-name'><b>Name</b></label>
        <input className='form-input' type='text' value={sensor.name}
          onChange={this._nameChanged} id='input-name' placeholder='Name' />
      </div>

      <div className='form-group'>
        <label className='form-label'><b>Labels</b></label>

        <div className='columns'>
          <div className='column col-9'>
            <input className='form-input' type='text' value={this.state.newLabel}
              onChange={this._newLabelChanged} placeholder='New label' />
          </div>
          <div className='column col-3'>
            <button className='btn' onClick={this._addNewLabel}>Add</button>
          </div>
        </div>

        {labels}
      </div>

      <div className='form-group'>
        <label className='form-label'>
          <b>Sensors</b><br />
          <i>{selectedInputs}</i>
        </label>
        <SensorTreeMenu
          checkable={true}
          checkedIds={sensor.inputs}
          sensorChanged={this._onSensorChanged}
          model={this.props.model} />
      </div>
    </div>;
  }
}

module.exports = VSForm;
