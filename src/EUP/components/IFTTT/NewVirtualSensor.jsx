const React = require('react'),

      VirtualSensor = require('../../../chariotModel').VirtualSensor,

      ProgrammedVSModal = require('../virtualSensors/ProgrammedVSModal.jsx'),
      DemonstratedVSModal = require('../virtualSensors/DemonstratedVSModal.jsx');


class NewVirtualSensor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showModal: false };

    this._showDemoModal = this._showDemoModal.bind(this);
    this._showProgramModal = this._showProgramModal.bind(this);
    this._hideModal = this._hideModal.bind(this);
  }

  _showProgramModal() {
    this.setState({
      showModal: true,
      type: 'Programmed'
    });
  }

  _showDemoModal() {
    this.setState({
      showModal: true,
      type: 'Demonstrated'
    });
  }

  _hideModal() {
    this.setState({ showModal: false });
  }

  render() {
    if (!this.state.showModal) {
      return <p className='lead'>
        None of the above? <a className='link' onClick={this._showDemoModal}>
          Demonstrate a new phenomenon
        </a> or <a className='link' onClick={this._showProgramModal}>
          program a new event.
        </a>
      </p>;
    }

    let model = this.props.model;
    let sensor = new VirtualSensor({}, model);

    if (this.state.type == 'Demonstrated') {
      sensor.programmingType = 'Demonstrated';
      return <DemonstratedVSModal
        sensor={sensor}
        close={this._hideModal}
        model={this.props.model} />;
    } else {
      sensor.programmingType = 'Programmed';
      return <ProgrammedVSModal
        sensor={sensor}
        close={this._hideModal}
        model={this.props.model} />;
    }
  }
}

module.exports = NewVirtualSensor;
