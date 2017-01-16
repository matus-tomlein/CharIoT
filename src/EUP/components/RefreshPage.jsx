var React = require('react'),
    $ = require('jquery'),
    browserHistory = require('react-router').browserHistory,

    elements = require('./elements'),
    Container = elements.Container;

var RefreshPage = React.createClass({
  componentDidMount: function () {
    $.get('/api/refresh', function () {
      browserHistory.push('/');
    });
  },

  render: function() {
    var centerStyle = { 'text-align': 'center' };
    return (
      <Container location={this.props.location}>

        <div className="spinner">
          <div className="cube1"></div>
          <div className="cube2"></div>
        </div>

        <h1 style={centerStyle}>Loading, please wait...</h1>
      </Container>
      );
  }
});

module.exports = RefreshPage;
