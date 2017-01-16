var React = require('react'),
    MenuBar = require('./MenuBar.jsx');

var ContainerWithoutGrid = React.createClass({
  render: function() {
    var style = {
      padding: '0px',
      margin: '0px'
    };
    return (
      <div>
        <div className="container grid-960">
          <MenuBar application={this} location={this.props.location} />
        </div>
        <div style={style}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = ContainerWithoutGrid;
