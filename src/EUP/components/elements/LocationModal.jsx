var React = require('react'),

    Modal = require('./Modal.jsx');

var LocationModal = React.createClass({
  render: function () {
    var placedObjects = [];
    var location = this.props.location;
    placedObjects = location.devices.map(function (object) {
      return <tr>
        <td>{object.name}</td>
      </tr>;
    });

    return <Modal title={location.name}
      cancel={this.props.closeCallback}>
      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th>{location.name} contains:</th>
          </tr>
        </thead>
        <tbody>
          {placedObjects}
        </tbody>
      </table>
    </Modal>;
  }
});

module.exports = LocationModal;
