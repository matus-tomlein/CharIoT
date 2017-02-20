const React = require('react'),

      TreeMenu = require('react-tree-menu').TreeMenu;

class SensorTreeMenu extends React.Component {
  constructor(props, context) {
    super(props, context);

    let model = props.model;
    let data = model.locations.map((location) => {
      let devices = location.devices.map((device) => {
        let sensors = device.sensors.map((sensor) => {
          let checked = this.props.checkedIds &&
            this.props.checkedIds.includes(sensor.id);
          return {
            id: sensor.id,
            label: sensor.name,
            checkbox: this.props.checkable,
            checked: checked,
            selected: false
          };
        });

        return {
          label: device.name,
          children: sensors,
          collapsed: true
        };
      });

      return {
        label: location.name,
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
