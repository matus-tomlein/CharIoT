var React = require('react'),
    $ = require('jquery'),
    browserHistory = require('react-router').browserHistory,
    Link = require('react-router').Link,

    Modal = require('./Modal.jsx');

var SensorCard = React.createClass({
  render: function () {
    var sensor = this.props.sensor;
    var services = sensor.sensors.map(function (type) {
      return <tr>
        <td>{type}</td>
        <td>{sensor.location}</td>
      </tr>;
    });
    var labels = sensor.labels.join(', ');

    return <Modal
      title={sensor.name}
      footer={this.props.children}
      cancel={this.props.closeCallback}>
      <p>
        Provides labels <span className='label'>{labels}</span>.
      </p>

      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th>Uses sensor</th>
            <th>In</th>
          </tr>
        </thead>
        <tbody>
          {services}
        </tbody>
      </table>
    </Modal>;
  }
});

var VirtualSensorModal = React.createClass({
  _handleRemove: function () {
    $.ajax({
      url: '/api/virtualSensors/' + this.props.sensor.id,
      type: 'DELETE',
      success: function () {
        browserHistory.push('/refresh');
      }
    });
  },

  render: function () {
    var path = '/train/' + this.props.sensor.id;
    return <SensorCard
        closeCallback={this.props.closeCallback}
        sensor={this.props.sensor}>
        <button className='btn btn-link' onClick={this._handleRemove}>Remove</button>
        <Link to={path} className='btn btn-primary'>Train sensor</Link>
      </SensorCard>;
  }
});

module.exports = {
  VirtualSensorModal: VirtualSensorModal
};
