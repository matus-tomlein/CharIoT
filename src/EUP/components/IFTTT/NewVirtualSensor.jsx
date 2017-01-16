const React = require('react'),
      $ = require('jquery'),
      browserHistory = require('react-router').browserHistory,

      Modal = require('../elements/Modal.jsx');


class NewVirtualSensorForm extends React.Component {
  constructor(props) {
    super(props);

    this.props.callbacks.submit = () => { this.submit(); };

    this.state = {
      location: this.props.model.locations()[0].name,
      sensors: [],
      labels: [],
      name: ''
    };

    this._sensorClicked = this._sensorClicked.bind(this);
    this._newLabelChanged = this._newLabelChanged.bind(this);
    this._addNewLabel = this._addNewLabel.bind(this);
    this._nameChanged = this._nameChanged.bind(this);
  }

  submit() {
    var id = Math.random().toString(36).substring(7);

    $.post('/api/virtualSensors', {
      id: id,
      location: this.state.location,
      sensors: this.state.sensors,
      labels: this.state.labels,
      samples: [],
      name: this.state.name
    }, () => {
      browserHistory.push('/train/' + id);
    });
  }

  _sensorClicked(event) {
    var sensors = this.state.sensors;

    if (event.target.checked) {
      if (!sensors.includes(event.target.value)) {
        sensors.push(event.target.value);
      }
    } else {
      var index = sensors.indexOf(event.target.value);
      if (index > -1) {
        sensors.splice(index, 1);
      }
    }

    this.setState({ sensors: sensors });
  }

  _nameChanged(event) {
    this.setState({ name: event.target.value });
  }

  _newLabelChanged(event) {
    this.setState({ newLabel: event.target.value });
  }

  _addNewLabel() {
    if (this.state.newLabel) {
      var labels = this.state.labels;
      labels.push(this.state.newLabel);
      this.setState({ labels: labels, newLabel: '' });
    }
  }

  sensorTypesInLocation() {
    if (this.state.location) {
      var location = this.props.model.locations().find((l) => {
        return l.name == this.state.location;
      });
      return location.sensors().map((sensor) => { return sensor.name; });
    }
    return [];
  }

  render() {
    var locationOptions = this.props.model.locations().map((location) => {
      return <option value={location.id}>{location.name}</option>;
    });
    var sensorTypes = this.sensorTypesInLocation().map((sensor) => {
      var checked = this.state.sensors.includes(sensor);

      return <label className='form-switch'>
          <input type='checkbox' value={sensor} checked={checked} onChange={this._sensorClicked} />
          <i className='form-icon'></i> {sensor}
        </label>;
    });

    var labels = this.state.labels.map((label) => {
      var remove = () => {
        var labels = this.state.labels;
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

    return <div>
      <div className="form-group">
        <label className='form-label' for='input-name'>Name</label>
        <input className='form-input' type='text' value={this.state.name}
          onChange={this._nameChanged} id='input-name' placeholder='Name' />
      </div>

      <div className='form-group'>
        <label className='form-label'>Labels</label>

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
        <label className='form-label'>Use sensors in</label>
        <select className='form-select' value={this.state.location}>
          {locationOptions}
        </select>
      </div>

      <div className='form-group'>
        <label className='form-label'>Use sensors for</label>
        {sensorTypes}
      </div>
    </div>;
  }
}

class NewVirtualSensor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showModal: false };

    this._showModal = this._showModal.bind(this);
    this._hideModal = this._hideModal.bind(this);
  }

  _showModal() {
    this.setState({ showModal: true });
  }

  _hideModal() {
    this.setState({ showModal: false });
  }

  render() {
    if (!this.state.showModal) {
      return <p className='lead'>
        None of the above? <a className='link' onClick={this._showModal}>
          Demonstrate a new phenomenon.</a>
      </p>;
    }

    var callbacks = {};
    var submit = () => {
      callbacks.submit();
    };

    var actions = <div>
      <button className='btn btn-link' onClick={this._hideModal}>Cancel</button>
      <button className='btn btn-primary' onClick={submit}>Train sensor</button>
    </div>;

    return <Modal title='Demonstrate a new phenomenon'
        footer={actions}
        cancel={this._hideModal}>
        <NewVirtualSensorForm model={this.props.model}
          callbacks={callbacks} />
      </Modal>;
  }
}

module.exports = NewVirtualSensor;
