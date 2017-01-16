var React = require('react'),
    $ = require('jquery'),
    browserHistory = require('react-router').browserHistory,

    Modal = require('./Modal.jsx');

class RuleModal extends React.Component {
  constructor(props) {
    super(props);
    this._handleRemove = this._handleRemove.bind(this);
  }

  _handleRemove() {
    $.ajax({
      url: '/api/rules/' + this.props.rule.id,
      type: 'DELETE',
      success: function () {
        browserHistory.push('/refresh');
      }
    });
  }

  render() {
    var rule = this.props.rule;
    var footer = <div>
      <button onClick={this._handleRemove} className='btn btn-link'>
        Remove
      </button>
    </div>;

    return <Modal
      title='Edit rule'
      footer={footer}
      cancel={this.props.closeCallback}>
        <h5 className='text-center'>{rule.name()}</h5>
    </Modal>;
  }
}

module.exports = RuleModal;
