var React = require('react'),

    renderCondition = require('./renderCondition.jsx'),
    renderAction = require('./renderAction.jsx'),
    renderInitialSubPage = require('./renderInitialSubPage.jsx'),
    renderIFTTTMessage = require('./renderIFTTTMessage.jsx');

function renderPage(page, model) {
  var subPage;
  if (page.state.selectedConditionId) {
    subPage = renderCondition(page, model);
  } else if (page.state.selectedActionId) {
    subPage = renderAction(page, model);
  } else {
    subPage = renderInitialSubPage(page, model);
  }

  var message = renderIFTTTMessage(page, model);

  return (
    <div>
      {message}
      <div className="divider"></div>
      {subPage}
    </div>
  );
}

module.exports = renderPage;
