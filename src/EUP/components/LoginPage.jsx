var React = require('react'),
    $ = require('jquery'),
    browserHistory = require('react-router').browserHistory,

    elements = require('./elements'),
    Container = elements.Container;

class LoginPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      clientId: '',
      clientSecret: '',
      hostname: 'bd-exp.andrew.cmu.edu',
      protocol: 'https',
      mlProtocol: 'http',
      email: '',
      building: ''
    };

    this._handleEmailChange = this._handleEmailChange.bind(this);
    this._handleClientIdChange = this._handleClientIdChange.bind(this);
    this._handleClientSecretChange = this._handleClientSecretChange.bind(this);
    this._handleHostnameChange = this._handleHostnameChange.bind(this);
    this._handleBuildingChange = this._handleBuildingChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  _handleClientIdChange(event) {
    this.setState({ clientId: event.target.value });
  }

  _handleClientSecretChange(event) {
    this.setState({ clientSecret: event.target.value });
  }

  _handleHostnameChange(event) {
    this.setState({ hostname: event.target.value });
  }

  _handleBuildingChange(event) {
    this.setState({ building: event.target.value });
  }

  _handleSubmit() {
    $.post('/api/login', this.state, () => {
      browserHistory.push('/');
    });
  }

  render() {
    return <Container location={this.props.location}>
      <h1 className='text-center'>
        <i className="fa fa-sign-in" aria-hidden="true"></i> Login to GIoTTO
      </h1>

      <div className='columns'>
        <div className='column col-sm-12 col-3'></div>
        <div className='column col-sm-12 col-6'>
          <div className='rounded padded grey'>

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input className="form-input"
                type="text"
                value={this.state.email}
                onChange={this._handleEmailChange}
                placeholder="user@gmail.com" />
            </div>

            <div className="form-group">
              <label className="form-label">Client ID:</label>
              <input className="form-input"
                type="text"
                onChange={this._handleClientIdChange}
                value={this.state.clientId} />
            </div>

            <div className="form-group">
              <label className="form-label">Client secret:</label>
              <input className="form-input"
                type="text"
                onChange={this._handleClientSecretChange}
                value={this.state.clientSecret} />
            </div>

            <div className="form-group">
              <label className="form-label">BuildingDepot hostname:</label>
              <input className="form-input"
                type="text"
                onChange={this._handleHostnameChange}
                value={this.state.hostname} />
            </div>

            <div className="form-group">
              <label className="form-label">Building name:</label>
              <input className="form-input"
                type="text"
                onChange={this._handleBuildingChange}
                value={this.state.building} />
            </div>

            <div className="form-group">
              <button className='btn btn-lg btn-primary' onClick={this._handleSubmit}>
                Login
              </button>
            </div>

          </div>
        </div>
      </div>
    </Container>;
  }
}

module.exports = LoginPage;
