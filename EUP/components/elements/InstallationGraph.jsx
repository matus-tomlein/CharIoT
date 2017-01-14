var React = require('react'),

    buildGraphParams = require('./buildGraphParams'),

    InstalledApplication = require('./InstalledApplication.jsx'),
    virtualSensorModals = require('./virtualSensorModals.jsx'),
    VirtualSensorModal = virtualSensorModals.VirtualSensorModal,
    DeviceModal = require('./DeviceModal.jsx'),
    LocationModal = require('./LocationModal.jsx'),
    RuleModal = require('./RuleModal.jsx'),
    Tag = require('./Tag.jsx'),
    DagreD3Graph = require('./DagreD3Graph.jsx');

class InstallationGraph extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showLayouts: true,
      showRules: true,
      showDevices: false,
      showSensors: true,
      showActions: true
    };
  }

  render() {
    var closeCallback = () => { this._closeCallback(); };

    if (this.state.device) {
      return <DeviceModal
        {...this.state.device}
        closeCallback={closeCallback} />;
    }

    else if (this.state.application) {
      return <InstalledApplication
        application={this.state.application}
        closeCallback={closeCallback} />;
    }

    else if (this.state.location) {
      return <LocationModal
        location={this.state.location}
        closeCallback={closeCallback} />;
    }

    else if (this.state.virtualSensor) {
      return <VirtualSensorModal
        sensor={this.state.virtualSensor}
        closeCallback={closeCallback} />;
    }

    else if (this.state.rule) {
      return <RuleModal
        rule={this.state.rule}
        closeCallback={closeCallback} />;
    }

    else {
      var nodeClicked = (id) => { this._handleNodeClicked(id); };
      var graphParams = buildGraphParams(this.props.model, {
        showLayouts: this.state.showLayouts,
        showRules: this.state.showRules,
        showDevices: this.state.showDevices,
        showSensors: this.state.showSensors,
        showActions: this.state.showActions
      });

      return <div>
        <span className="text-bold">Show:</span>
        <ul className="pagination">
          <Tag tag='Devices' active={this.state.showDevices} page={this} />
          <Tag tag='Sensors' active={this.state.showSensors} page={this} />
          <Tag tag='Actions' active={this.state.showActions} page={this} />
          <Tag tag='Layout' active={this.state.showLayouts} page={this} />
          <Tag tag='Rules' active={this.state.showRules} page={this} />
        </ul>

        <DagreD3Graph {...graphParams}
          nodeClicked={nodeClicked} />
      </div>;
    }
  }

  _handleNodeClicked(id) {
    var model = this.props.model;

    var device = model.devices.find((d) => { return d.id == id; });
    if (device) {
      this.setState({ device: device });
      return;
    }

    var location = model.locations().find((l) => { return l.id + '_node' == id; });
    if (location) {
      this.setState({ location: location });
      return;
    }

    var vs = model.virtualSensors.find((v) => { return v.id == id; });
    if (vs) {
      this.setState({ virtualSensor: vs });
      return;
    }

    var rule = model.rules.find((r) => { return r.id == id; });
    if (rule) {
      this.setState({ rule: rule });
      return;
    }
  }

  _closeCallback() {
    this.setState({
      device: undefined,
      rule: undefined,
      location: undefined,
      virtualSensor: undefined
    });
  }

  tagClicked (tag, enable) {
    if (tag == 'Devices') {
      this.setState({ showDevices: enable });
    } if (tag == 'Layout') {
      this.setState({ showLayouts: enable });
    } else if (tag == 'Rules') {
      this.setState({ showRules: enable });
    } else if (tag == 'Sensors') {
      this.setState({ showSensors: enable });
    } else if (tag == 'Actions') {
      this.setState({ showActions: enable });
    }
  }
}

module.exports = InstallationGraph;
