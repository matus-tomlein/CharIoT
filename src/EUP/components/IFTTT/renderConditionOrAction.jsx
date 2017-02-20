var React = require('react'),

    ServiceSearch = require('./ServiceSearch.jsx'),
    renderAttributes = require('./renderAttributes.jsx'),
    manageSelectedItem = require('./manageSelectedItem'),

    ConditionOrAction = require('./ConditionOrAction');

function renderConditionOrAction(page, model, getServices, children) {
  var selectedItem = manageSelectedItem.get(page);
  var conditionOrAction = new ConditionOrAction(selectedItem, model.building);

  if (!conditionOrAction.hasChosenService()) {
    var services = getServices(model);

    var serviceChosenCallback = (service) => {
      var selectedItem = manageSelectedItem.get(page);
      service.id = selectedItem.id;
      manageSelectedItem.update(service, page);
    };

    return <div>
      <ServiceSearch services={services}
        model={model}
        serviceChosenCallback={serviceChosenCallback} />
      {children}
    </div>;
  }
  else {
    return renderAttributes(page, model);
  }
}

module.exports = renderConditionOrAction;
