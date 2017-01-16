var React = require('react'),
    $ = require('jquery'),
    browserHistory = require('react-router').browserHistory;

function generateId() {
  return Math.random().toString(36).substring(7);
}

module.exports = (page) => {
  if (page.state.conditions.length && page.state.actions.length) {
    var installCallback = () => {
      var rule = {
        id: generateId,
        conditions: page.state.conditions,
        actions: page.state.actions
      };

      $.post('/api/rules', rule, function () {
        browserHistory.push('/refresh');
      });
    };

    return <div className='text-center'>
      <button className='btn btn-primary btn-lg' onClick={installCallback}>
        <i className='fa fa-download' aria-hidden='true'></i> Install
      </button>
    </div>;
  }
  return <div />;
};
