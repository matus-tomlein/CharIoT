var React = require('react'),
    $ = require('jquery'),
    browserHistory = require('react-router').browserHistory,

    model = require('../../../chariotModel'),
    Location = model.Location,

    Modal = require('./Modal.jsx');

class LocationTag extends React.Component {
  constructor(props, context) {
    super(props, context);

    this._remove = this._remove.bind(this);
  }

  _remove() {
    let device = this.props.device;
    let data = device.data;
    let location  = this.props.location;
    data.locations = data.locations.filter((l) => {
      return l.name != location.name;
    });

    $.post('/api/devices/' + device.id, data, function () {
      browserHistory.push('/refresh');
    });
  }

  render() {
    let location = this.props.location;
    return <span> <div className='chip-sm'>
      <span className='chip-name'>
        <i className="fa fa-tag" aria-hidden="true"></i> {location.name}
      </span>
      <button className='btn btn-clear' onClick={this._remove}></button>
    </div> </span>;
  }
}

class AddLocation extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { name: '' };

    this._nameChanged = this._nameChanged.bind(this);
    this._submit = this._submit.bind(this);
  }

  _nameChanged(event) { this.setState({ name: event.target.value }); }
  _submit() {
    let device = this.props.device;
    let location = new Location({}, device.building);
    location.name = this.state.name;
    device.addLocation(location);

    $.post('/api/devices/' + device.id, device.data, function () {
      browserHistory.push('/refresh');
    });
  }

  render() {
    return <div className="columns">
      <div className="column col-8">
        <input className="form-input"
          value={this.state.name}
          onChange={this._nameChanged}
          type="text" placeholder="Location name" />
      </div>
      <div className="column col-4">
        <button onClick={this._submit} className='btn'>Add location</button>
      </div>
    </div>;
  }
}

class EditName extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { name: this.props.device.name };

    this._nameChanged = this._nameChanged.bind(this);
    this._submit = this._submit.bind(this);
  }

  _nameChanged(event) { this.setState({ name: event.target.value }); }
  _submit() {
    let device = this.props.device;
    device.name = this.state.name;

    $.post('/api/devices/' + device.id, device.data, function () {
      browserHistory.push('/refresh');
    });
  }

  render() {
    return <div className="columns">
      <div className="column col-8">
        <input className="form-input"
          onChange={this._nameChanged}
          value={this.state.name}
          type="text" placeholder="Name" />
      </div>
      <div className="column col-4">
        <button onClick={this._submit} className='btn'>Change name</button>
      </div>
    </div>;
  }
}


class DeviceModal extends React.Component {
  render() {
    let device = this.props.device;

    let sensors = device.sensors.map((sensor) => {
      return <span> <div className='chip-sm'>
        <span className='chip-name'>
          <i className="fa fa-tag" aria-hidden="true"></i> {sensor.name}
        </span>
      </div> </span>;
    });

    let actions = device.actions.map((action) => {
      return <span> <div className='chip-sm'>
        <span className='chip-name'>
          <i className="fa fa-tag" aria-hidden="true"></i> {action.name}
        </span>
      </div> </span>;
    });

    let locations = device.locations.map((l) => {
      return <LocationTag device={device} location={l} />;
    });

    let buttons = device.actions.map((action) => {
      var onClick = () => {
        $.get('/api/actions/' + action.id + '/trigger');
      };
      return <button onClick={onClick} className='btn'>
        {action.name}
      </button>;
    });

    let actionButtons = <div className='btn-group'> {buttons} </div>;

    return <Modal
      title={device.name}
      footer={actionButtons}
      cancel={this.props.closeCallback}>
      <EditName device={device} />
      <AddLocation device={device} />

      <h5>Locations:</h5>
      <p> {locations} </p>
      <h5>Sensors:</h5>
      <p> {sensors} </p>
      <h5>Actions:</h5>
      <p> {actions} </p>

    </Modal>;
  }
}

module.exports = DeviceModal;
