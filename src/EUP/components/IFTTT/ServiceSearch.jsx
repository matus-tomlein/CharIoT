var React = require('react'),
    _ = require('underscore'),
    ConditionOrAction= require('./ConditionOrAction');

class ServiceSearch extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { search: '' };
    this._handleSearch = this._handleSearch.bind(this);
  }

  _handleSearch(event) {
    this.setState({ search: event.target.value });
  }

  render() {
    var model = this.props.model;

    var filteredServices = this.props.services.map((service) => {
      return new ConditionOrAction(service, model);
    });
    if (this.state.search) {
      var search = this.state.search.toLowerCase();
      filteredServices = filteredServices.filter((service) => {
        var name = service.serviceNameWithSource;
        return name.toLowerCase().includes(search);
      });
    }

    filteredServices = _.sortBy(filteredServices, (service) => {
      return service.serviceNameWithSource;
    });

    var services = filteredServices.map((service) => {
      var onClick = () => {
        this.props.serviceChosenCallback(service.data);
      };
      var name = service.serviceNameWithSource;

      var className = 'rounded padded ';
      if (service.requiresVirtualSensor()) {
        className += 'green';
      } else if (service.hasLocation()) {
        className += 'lightred';
      } else if (service.requiresDevice()) {
        className += 'purple';
      }

      return <div className='column col-sm-12 col-4 pt-10'>
        <div className={className}>
          <p className='lead'>
            {name}
          </p>
          <p>
            <button className='btn' onClick={onClick}>
              Choose
            </button>
          </p>
        </div>
      </div>;
    });

    return <section className="navbar-section">
        <div className='columns'>
          <div className='column col-sm-12 col-3'></div>
          <div className='column col-sm-12 col-6'>
            <div className="input-group input-inline">
              <input className="form-input" type="text" onChange={this._handleSearch} placeholder="Search services" />
              <button className="btn btn-primary input-group-btn">Search</button>
            </div>
          </div>
        </div>

        <div className='columns'>
          {services}
        </div>
      </section>;
  }
}

module.exports = ServiceSearch;
