var React = require('react');

class NumericServiceAttributes extends React.Component {
  constructor(props) {
    super(props);
    this._handleValueChange = this._handleValueChange.bind(this);
    this._handleOperatorChange = this._handleOperatorChange.bind(this);
  }

  _handleOperatorChange(event) {
    this.props.attributesChanged(this.props.name, {
      operator: event.target.value,
      value: this.props.value.value
    });
  }

  _handleValueChange(event) {
    this.props.attributesChanged(this.props.name, {
      operator: this.props.value.operator,
      value: event.target.value
    });
  }

  render() {
    var operator, value;
    var attributes = this.props.value;
    if (attributes) {
      operator = attributes.operator;
      value = attributes.value;
    }
    return <div>
        <div className='form-group columns'>
          <div className='col-3 padded'>
            <select className='form-select' value={operator}
              onChange={this._handleOperatorChange}>
              <option value='EQ'>&#61;</option>
              <option value='NEQ'>&#8800;</option>
              <option value='LT'>&lt;</option>
              <option value='LTE'>&#8804;</option>
              <option value='GT'>&gt;</option>
              <option value='GTE'>&#8805;</option>
            </select>
          </div>

          <div className='col-9 padded'>
            <input className='form-input' type='text'
              value={value} onChange={this._handleValueChange} />
          </div>
        </div>
      </div>;
  }
}

module.exports = NumericServiceAttributes;
