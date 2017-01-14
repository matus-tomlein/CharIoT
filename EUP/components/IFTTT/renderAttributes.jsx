var React = require('react'),

    ConditionOrAction = require('./ConditionOrAction'),
    manageSelectedItem = require('./manageSelectedItem'),
    NumericServiceAttributes = require('./NumericServiceAttributes.jsx'),
    SelectServiceAttributes = require('./SelectServiceAttributes.jsx');

function renderAttributes(page, model) {

  var handleAttributesChanged = (name, values) => {
    var item = manageSelectedItem.get(page);
    item.attributes = item.attributes || {};
    item.attributes[name] = values;
    manageSelectedItem.update(item, page);
  };

  var item = manageSelectedItem.get(page);
  var condition = new ConditionOrAction(item, model);

  var body = [];
  var attributes = item.attributes || {};

  condition.requiredAttributes().forEach((requiredAttribute) => {
    var value = attributes[requiredAttribute.name];

    switch (requiredAttribute.type) {
    case 'numericCondition':
      body.push(<NumericServiceAttributes
        {...requiredAttribute}
        value={value}
        attributesChanged={handleAttributesChanged} />);
      break;

    case 'select':
      body.push(<SelectServiceAttributes
        {...requiredAttribute}
        value={value}
        attributesChanged={handleAttributesChanged} />);
      break;
    }
  });

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
            {condition.serviceNameWithSource()}
          </p>

          {body}

          <p>
            <button className='btn' onClick={handleSubmit}>Done</button>
            <button className='btn btn-link' onClick={backCallback}>Cancel</button>
          </p>
        </div>
      </div>
    </div>
  </div>;
}

module.exports = renderAttributes;
