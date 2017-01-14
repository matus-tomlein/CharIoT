var React = require('react');

var Tag = React.createClass({
  _handleClick: function () {
    this.props.page.tagClicked(this.props.tag, !this.props.active, this.props.type);
  },

  render: function () {
    var cursorStyle = { 'cursor': 'pointer' };
    var className = 'page-item';
    if (this.props.active) className += ' active';

    return <li className={className}>
      <a onClick={this._handleClick} style={cursorStyle}>{this.props.tag}</a>
    </li>;
  }
});

module.exports = Tag;
