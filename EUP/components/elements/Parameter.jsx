var React = require('react'),

    Columns = require('./Columns.jsx');

var Parameter = React.createClass({
  render: function () {
    var parameter = this.props.parameter;
    var items = [
      <div className='padded text-bold text-right'>{parameter.name}</div>,
      <div className='bg-grey'>{parameter.value}</div>
    ];
    return <Columns numColumns='2' xs='6' sm='6'>{items}</Columns>;
  }
});

module.exports = Parameter;
