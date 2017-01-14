var React = require('react'),

    elements = require('./elements'),
    InstallationGraph = elements.InstallationGraph;

var InstallationOverviewSection = React.createClass({
  render: function() {
    var model = this.props.model;

    return (
      <div>
        <InstallationGraph model={model} />
      </div>
    );
  }
});

module.exports = InstallationOverviewSection;
