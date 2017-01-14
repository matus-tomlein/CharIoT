var React = require('react');

class Modal extends React.Component {
  render() {
    var onCancel = () => {
      this.props.cancel();
    };
    return <div className="modal active">
      <div className="modal-overlay"></div>
      <div className="modal-container">
        <div className="modal-header">
          <button className="btn btn-clear float-right" onClick={onCancel} />
          <div className="modal-title">{this.props.title}</div>
        </div>
        <div className="modal-body">
          <div className="content">
            {this.props.children}
          </div>
        </div>
        <div className="modal-footer">
          {this.props.footer}
        </div>
      </div>
    </div>;
  }
}

module.exports = Modal;
