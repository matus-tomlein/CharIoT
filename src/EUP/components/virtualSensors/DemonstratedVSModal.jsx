const React = require('react'),
      $ = require('jquery'),
      browserHistory = require('react-router').browserHistory,

      VSForm = require('./DemonstratedVSForm.jsx'),
      VSTrain = require('./DemonstratedVSTrain.jsx'),
      Modal = require('../elements/Modal.jsx');

class DemonstratedVSModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sensor: props.sensor,
      training: false,
      submitting: false
    };

    this._updateSensor = this._updateSensor.bind(this);
    this._submit = this._submit.bind(this);
    this._train = this._train.bind(this);
    this._edit = this._edit.bind(this);
  }

  _train() { this.setState({training: true}); }
  _edit() { this.setState({training: false}); }
  _updateSensor(sensor) { this.setState({sensor: sensor}); }

  _submit() {
    this.setState({submitting: true});
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
    } else if (this.state.training) {
      body = <VSTrain sensor={sensor}
        updateSensor={this._updateSensor} />;
      actions.push(
        <button className='btn btn-link' onClick={this._edit}>Edit</button>
      );
      actions.push(
        <button className='btn btn-primary' onClick={this._submit}>Submit</button>
      );
    } else {
      body = <VSForm sensor={sensor}
        model={this.props.model}
        updateSensor={this._updateSensor} />;
      actions.push(
        <button className='btn btn-primary' onClick={this._train}>Train sensor</button>
      );
    }

    return <Modal title='Demonstrated phenomenon'
        footer={actions}
        cancel={this.props.close}>
        {body}
      </Modal>;
  }
}

module.exports = DemonstratedVSModal;
