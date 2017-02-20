var React = require('react');

class SelectServiceAttributes extends React.Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange(event) {
    this.props.attributesChanged(event.target.value);
  }

  render() {
    var options = [];
    for (var key in this.props.options) {
      options.push(<option value={key}>{this.props.options[key]}</option>);
    }

    return <div className='form-group'>
        <select className='form-select' value={this.props.value}
          onChange={this._handleChange}>
          {options}
        </select>
      </div>;
  }
}

module.exports = SelectServiceAttributes;
