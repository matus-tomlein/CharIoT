var React = require('react'),
    // _ = require('underscore'),
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

    var services = filteredServices.map((service) => {
      var onClick = () => {
        this.props.serviceChosenCallback(service.data);
      };
      var name = service.serviceNameWithSource;

      let transferredLabel;
      var className = 'rounded padded ';
      if (service.requiresVirtualSensor()) {
        let vs = service.virtualSensors[0];
        if (vs.programmingType == 'Demonstrated') {
          className += 'green';
        } else {
          className += 'yellow';
        }
        if (vs.isRecommended) {
          transferredLabel = <span className='label label-primary'>Transferred</span>;
        }
      } else if (service.hasLocation()) {
        className += 'lightred';
      } else if (service.requiresDevice()) {
        className += 'purple';
      }

      let options = Object.keys(service.options).map((key) => {
        return <i> <small className='label'>{service.options[key]}</small> </i>;
      });

      return <div className='column col-sm-12 col-4 pt-10'>
        <div className={className}>
          <p className='lead'>
            {transferredLabel} {name}
          </p>
          <p>
            {options}
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
              <input className="form-input" type="text" value={this.state.search}
                onChange={this._handleSearch} placeholder="Search services" />
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
