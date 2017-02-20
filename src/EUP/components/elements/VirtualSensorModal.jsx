var React = require('react'),

    VirtualSensor = require('../../../chariotModel').VirtualSensor,

    ProgrammedVSModal = require('../virtualSensors/ProgrammedVSModal.jsx'),
    DemonstratedVSModal = require('../virtualSensors/DemonstratedVSModal.jsx');

class VirtualSensorModal extends React.Component {
  render() {
    let sensor = this.props.sensor;
    sensor = new VirtualSensor(JSON.parse(JSON.stringify(sensor.data)),
      this.props.model.building);
    if (this.props.sensor.programmingType == 'Demonstrated') {
      return <DemonstratedVSModal
        sensor={sensor}
        close={this.props.closeCallback}
        model={this.props.model} />;
    } else {
      return <ProgrammedVSModal
        sensor={sensor}
        close={this.props.closeCallback}
        model={this.props.model} />;
    }
  }
}

module.exports = VirtualSensorModal;
