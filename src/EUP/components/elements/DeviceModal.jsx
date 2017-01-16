var React = require('react'),
    $ = require('jquery'),

    cards = require('./cards.jsx'),
    CardBody = cards.CardBody,
    CollapsibleCard = cards.CollapsibleCard,
    Modal = require('./Modal.jsx'),
    Parameter = require('./Parameter.jsx');

var Service = React.createClass({
  render: function () {
    var service = this.props.service;
    var characteristics = service.characteristics.map(function (characteristic) {
      return <Parameter parameter={characteristic} />;
    });
    return <CardBody>
      <h4 className="card-meta text-center">
        {service.name}
      </h4>
      {characteristics}
    </CardBody>;
  }
});

var DeviceModal = React.createClass({
  render: function () {
    var characteristics = this.props.characteristics.map(function (parameter) {
      return <Parameter parameter={parameter} />;
    });

    var providerServices = <div />;
    var consumerServices = <div />;

    var elements;
    if (this.props.providerServices.length) {
      elements = this.props.providerServices.map(function (service) {
        return <Service service={service} />;
      });
      providerServices = <CollapsibleCard title='Sensors'>
        {elements}
      </CollapsibleCard>;
    }

    if (this.props.consumerServices.length) {
      elements = this.props.consumerServices.map(function (service) {
        return <Service service={service} />;
      });
      consumerServices = <CollapsibleCard title='Actions'>
        {elements}
      </CollapsibleCard>;
    }

    var actionButtons;
    if (this.props.consumerServices.length) {
      var buttons = this.props.consumerServices.map(function (service) {
        var onClick = function () {
          $.get('/api/services/' + service.uriHash + '/trigger');
        };
        return <button onClick={onClick} className='btn'>
          {service.name}
        </button>;
      });

      actionButtons = <div className='btn-group'>
        {buttons}
      </div>;
    }

    return <Modal
      title={this.props.name}
      footer={actionButtons}
      cancel={this.props.closeCallback}>
        <h5 className='text-center'>Characteristics</h5>
        {characteristics}
        {providerServices}
        {consumerServices}
    </Modal>;
  }
});

module.exports = DeviceModal;
