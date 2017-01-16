var React = require('react'),
    $ = require('jquery'),
    browserHistory = require('react-router').browserHistory,

    Parameter = require('./Parameter.jsx'),
    Modal = require('./Modal.jsx'),
    cards = require('./cards.jsx'),
    CollapsibleCard = cards.CollapsibleCard,
    CardBody = cards.CardBody;

var IfNumericRuleItem = React.createClass({
  render: function () {
    return <div className='green rounded mt-5 padded'>
      <b> IF </b>
      {this.props.service.name}
      <b> FROM </b>
      {this.props.service.device.name}
      <b> IS </b>
      {this.props.operator} {this.props.value}
    </div>;
  }
});

var IfVirtualSensorRuleItem = React.createClass({
  render: function () {
    return <div className='green rounded mt-5 padded'>
      <b> WHEN </b>
      {this.props.virtualSensor.name}
      <b> BECOMES </b>
      {this.props.value}
    </div>;
  }
});

var ThenNumericRuleItem = React.createClass({
  render: function () {
    return <div className='blue rounded mt-5 padded'>
      <b> THEN </b>
      {this.props.service.name}
    </div>;
  }
});

var ThenBooleanRuleItem = React.createClass({
  render: function () {
    var onOrOff = this.props.value == 'true' ? 'ON' : 'OFF';
    return <div className='blue rounded mt-5 padded'>
      <b> THEN TURN </b>
      {this.props.service.name}
      <b> ON </b>
      {this.props.service.device.name}
      <b> {onOrOff} </b>
    </div>;
  }
});

var ThenTriggerRuleItem = React.createClass({
  render: function () {
    return <div className='blue rounded mt-5 padded'>
      <b> THEN TRIGGER </b>
      {this.props.service.name}
      <b> ON </b>
      {this.props.service.device.name})
    </div>;
  }
});

var Rule = React.createClass({
  render: function () {
    var items = this.props.items.map(function (item) {
      var itemEl = null;
      if (item.virtualSensor) {
        itemEl = <IfVirtualSensorRuleItem {...item} />;
      } else if (item.service.serviceType == 'provider') {
        if (item.operator) {
          itemEl = <IfNumericRuleItem {...item} />;
        }
      } else {
        if (item.value == undefined) {
          itemEl = <ThenTriggerRuleItem {...item} />;
        } else if (item.value == 'true' || item.value == 'false') {
          itemEl = <ThenBooleanRuleItem {...item} />;
        } else {
          itemEl = <ThenNumericRuleItem {...item} />;
        }
      }

      return <div className='column col-md-6 col-sm-12'>
        {itemEl}
      </div>;
    });

    return <div>
      <h4 className="card-meta text-center">{this.props.label}</h4>
      <div className='columns pt-10'>
        {items}
      </div>
    </div>;
  }
});

var InstalledApplication = React.createClass({
  _handleUninstall: function () {
    var property = this.props.application.property;

    $.ajax({
      url: '/api/properties/' + property.id,
      type: 'DELETE',
      success: function () {
        browserHistory.push('/refresh');
      }
    });
  },

  render: function () {
    var application = this.props.application;
    var title = [ application.name ];
    if (application.tags)
      application.tags.forEach(function (tag) {
        title.push(' ');
        title.push(<div className="chip-sm">
          <span className="chip-name">{tag}</span>
        </div>);
      });

    var parameters = [];
    if (application.parameters)
      parameters = application.parameters.map(function (parameter) {
        return <Parameter parameter={parameter} />;
      });

    var rules = [];
    if (application.rules)
      rules = application.rules.map(function (rule) {
        return <Rule {...rule} />;
      });

    var ruleCard = null;
    if (rules.length) {
      ruleCard = <CollapsibleCard title='Rules' open={true}>
        <CardBody>
          {rules}
        </CardBody>
      </CollapsibleCard>;
    }

    var footer = <button className="btn" onClick={this._handleUninstall}>
      Uninstall {application.name}
    </button>;

    return <Modal title={title}
      footer={footer}
      cancel={this.props.closeCallback}>
      <h6 className="card-meta text-center">Parameters</h6>
      {parameters}
      {ruleCard}
    </Modal>;
  }
});

module.exports = InstalledApplication;
