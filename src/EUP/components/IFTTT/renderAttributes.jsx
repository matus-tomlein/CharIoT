var React = require('react'),

    ConditionOrAction = require('./ConditionOrAction'),
    manageSelectedItem = require('./manageSelectedItem'),
    SelectServiceAttributes = require('./SelectServiceAttributes.jsx');

function renderAttributes(page, model) {

  var handleAttributesChanged = (value) => {
    var item = manageSelectedItem.get(page);
    item.value = value;
    manageSelectedItem.update(item, page);
  };

  var item = manageSelectedItem.get(page);
  var condition = new ConditionOrAction(item, model);

  var body = [];

  if (condition.options) {
    body.push(<SelectServiceAttributes
      options={condition.options}
      value={condition.value}
      attributesChanged={handleAttributesChanged} />);
  }

  var backCallback = () => {
    manageSelectedItem.remove(page);
  };

  var handleSubmit = () => {
    page.setState({
      selectedActionId: null,
      selectedConditionId: null
    });
  };

  return <div>
    <div className='columns'>
      <div className='column col-sm-12 col-4'></div>
      <div className='column col-sm-12 col-4'>
        <div className='rounded padded purple'>
          <p className='lead'>
            {condition.serviceNameWithSource}
          </p>

          {body}

          <p>
            <button className='btn' onClick={handleSubmit}>Done</button>
            <button className='btn btn-link' onClick={backCallback}>Remove</button>
          </p>
        </div>
      </div>
    </div>
  </div>;
}

module.exports = renderAttributes;
