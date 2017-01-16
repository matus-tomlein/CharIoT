var React = require('react'),
    _ = require('underscore'),

    manageSelectedItem = require('./manageSelectedItem'),
    ConditionOrAction = require('./ConditionOrAction');

function generateId() {
  return Math.random().toString(36).substring(7);
}

function joinElements(elements) {
  return (<span>
    {elements.map((item, i, arr) => {
      let divider = '';
      if (i < arr.length-1) divider = 'and';
      return (
        <span key={i}> {item} {divider} </span>
      );
    })}
  </span>);
}

function createElements(page, model, creatingConditions) {
  var type = creatingConditions ? 'conditions' : 'actions';
  var label = creatingConditions ? 'this' : 'that';
  var selectedItem = manageSelectedItem.get(page);

  var elements = page.state[type].map((cond) => {
    var condition = new ConditionOrAction(cond, model);

    var open = () => {
      var state = { selectedConditionId: null, selectedActionId: null };
      state[creatingConditions ? 'selectedConditionId' : 'selectedActionId'] = cond.id;
      page.setState(state);
    };

    var remove = () => {
      if (creatingConditions) {
        var conditions = page.state.conditions;
        conditions = _.reject(conditions, (c) => {
          return c.id == cond.id;
        });

        page.setState({
          selectedConditionId: null,
          selectedActionId: null,
          conditions: conditions
        });
      }

      else {
        var actions = page.state.actions;
        actions = _.reject(actions, (act) => {
          return act.id == cond.id;
        });

        page.setState({
          selectedConditionId: null,
          selectedActionId: null,
          actions: actions
        });
      }
    };

    var style = {};
    if (selectedItem && selectedItem.id == cond.id) {
      style = { color: 'black', 'font-weight': 'bold' };
    }

    return <span>
      <a onClick={open} className='link' style={style}>
        {condition.name || label}
      </a> <a onClick={remove} className='link' style={{ color: '#e85600' }}>
        <i className='fa fa-minus-square' aria-hidden='true'></i>
      </a>
    </span>;
  });

  var newCondition = () => {
    var item = {
      id: generateId()
    };
    var items = page.state[type];
    items.push(item);

    if (creatingConditions) {
      page.setState({
        selectedConditionId: item.id,
        selectedActionId: null,
        conditions: items
      });
    } else {
      page.setState({
        selectedActionId: item.id,
        selectedConditionId: null,
        actions: items
      });
    }
  };

  return <span>
    {joinElements(elements)} <a onClick={newCondition} className='link'>
      <i className="fa fa-plus-square" aria-hidden="true"></i>
    </a>
  </span>;
}

function renderIFTTTMessage(page, model) {
  var style = { 'font-size': 'xx-large', margin: '20px' };

  var conditions = createElements(page, model, true);
  var actions = createElements(page, model, false);

  return <div style={style} className='text-center'>
    if {conditions} then {actions}
  </div>;
}

module.exports = renderIFTTTMessage;
