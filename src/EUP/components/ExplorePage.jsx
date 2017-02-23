var React = require('react'),
    browserHistory = require('react-router').browserHistory,
    _ = require('underscore'),

    elements = require('./elements'),
    Container = elements.Container,

    modelHelper = require('./modelHelper');

class Rule extends React.Component {
  constructor(props) {
    super(props);

    this._handleInstall = this._handleInstall.bind(this);
  }

  _handleInstall() {
    browserHistory.push('/build/' + this.props.rule.id);
  }

  render() {
    var rule = this.props.rule;

    return <div className='column col-sm-12 col-4 pt-10'>
      <div className='rounded purple padded text-center'>
        <p className='lead'>
          <b>if</b> {rule.conditionNames()} <b>then</b> {rule.actionNames()}
        </p>
        <p>
          <button className='btn' onClick={this._handleInstall}>
            Adapt and install
          </button>
        </p>
      </div>
    </div>;
  }
}

class ExplorePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: modelHelper.blankData
    };
  }

  componentDidMount() {
    modelHelper.fetch((err, data) => {
      var state = this.state;
      state.data = data;
      this.setState(state);
    });
  }

  render() {
    var model = modelHelper.create(this.state.data);

    var rules = model.allRecommenedRules.map((rule) => {
      return <Rule rule={rule} />;
    });

    let relatedRules = [];
    let recommendations = model.recommendations;
    model.rules.forEach((rule) => {
      let related = recommendations.rulesRelatedToRule(rule);
      if (related.length) {
        related = related.map((r) => { return <Rule rule={r} />; });

        relatedRules.push(<div>
          <h5>Since you installed: <i>{rule.name()}</i></h5>
          <div className='columns'>
            {related}
          </div>
        </div>);
      }
    });

    let relatedRulesToDevices = [];
    let deviceTypes = _.uniq(model.devices.map((device) => {
      return device.type;
    }));
    deviceTypes.forEach((deviceType) => {
      let related = recommendations.rulesRelatedToDeviceType(deviceType);
      if (related.length) {
        related = related.map((r) => { return <Rule rule={r} />; });

        relatedRulesToDevices.push(<div>
          <h5>Since you have a <i>{deviceType}</i></h5>
          <div className='columns'>
            {related}
          </div>
        </div>);
      }
    });

    return (
      <Container location={this.props.location}>
        <h5>Recommendations from similar installations</h5>

        <div className='columns'>
          {rules}
        </div>

        {relatedRules}

        {relatedRulesToDevices}
      </Container>
      );
  }
}

module.exports = ExplorePage;
