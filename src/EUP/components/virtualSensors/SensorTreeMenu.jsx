const React = require('react'),
      _ = require('underscore'),

      TreeMenu = require('react-tree-menu').TreeMenu;

class SensorTreeMenu extends React.Component {
  constructor(props, context) {
    super(props, context);

    let model = props.model;
    let data = model.locations.map((location) => {
      let devices = location.devices.map((device) => {
        let deviceChecked = true;
        let sensors = _.sortBy(device.sensors, (s) => { return s.name; });
        sensors = sensors.map((sensor) => {
          let checked = this.props.checkedIds &&
            this.props.checkedIds.includes(sensor.id);
          if (!checked) { deviceChecked = false; }

          return {
            id: sensor.id,
            label: <span><i className="fa fa-thermometer-half" aria-hidden="true"></i> {sensor.name}</span>,
            checkbox: this.props.checkable,
            checked: checked,
            selected: false
          };
        });

        return {
          label: <span><i className="fa fa-lightbulb-o" aria-hidden="true"></i> {device.name}</span>,
          children: sensors,
          checkbox: this.props.checkable,
          checked: deviceChecked,
          collapsed: true
        };
      });

      return {
        label: <span><i className="fa fa-map-marker" aria-hidden="true"></i> {location.name}</span>,
        children: devices,
        collapsed: true
      };
    });

    this.state = {
      checked: [],
      opened: [],
      data: data
    };

    this._collapseChanged = this._collapseChanged.bind(this);
    this._checkChanged = this._checkChanged.bind(this);
    this._clicked = this._clicked.bind(this);
  }

  _collapseChanged(node) {
    let data = this.state.data;
    if (node.length == 1) {
      data[node[0]].collapsed = !data[node[0]].collapsed;
    } else if (node.length == 2) {
      data[node[0]].children[node[1]].collapsed = !data[node[0]].children[node[1]].collapsed;
    }

    this.setState({data: data});
  }

  _checkChanged(node) {
    if (this.props.checkable) {
      let data = this.state.data;
      if (node.length == 3) {
        let item = data[node[0]].children[node[1]].children[node[2]];

        item.checked = !item.checked;
        this.props.sensorChanged(item.id, item.checked);
      } else if (node.length == 2) {
        let item = data[node[0]].children[node[1]];

        item.checked = !item.checked;
        item.children.forEach((child) => {
          child.checked = item.checked;
          this.props.sensorChanged(child.id, child.checked);
        });
      }

      this.setState({data: data});
    }
  }

  _clicked(node) {
    let data = this.state.data;
    if (node.length == 1) {
      data[node[0]].collapsed = !data[node[0]].collapsed;
    }
    else if (node.length == 2) {
      data[node[0]].children[node[1]].collapsed = !data[node[0]].children[node[1]].collapsed;
    }
    else if (node.length == 3 && this.props.selectable) {
      let item = data[node[0]].children[node[1]].children[node[2]];

      item.selected = !item.selected;

      data.forEach((location) => {
        location.children.forEach((device) => {
          device.children.forEach((sensor) => {
            if (sensor.id != item.id) {
              sensor.selected = false;
            }
          });
        });
      });

      this.props.sensorChanged(item.id, item.selected);
    }

    this.setState({data: data});
  }

  render() {
    return <TreeMenu
          expandIconClass="fa fa-chevron-right"
          collapseIconClass="fa fa-chevron-down"
          onTreeNodeClick={this._clicked}
          onTreeNodeCollapseChange={this._collapseChanged}
          onTreeNodeCheckChange={this._checkChanged}
          data={this.state.data} />;
  }
}

module.exports = SensorTreeMenu;
