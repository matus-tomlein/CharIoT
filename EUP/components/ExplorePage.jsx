var React = require('react'),
    _ = require('underscore'),
    browserHistory = require('react-router').browserHistory,

    elements = require('./elements'),
    Container = elements.Container,
    Tag = elements.Tag,

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
            Configure
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
      data: modelHelper.blankData,
      selectedLocationTags: [],
      selectedSensorTags: [],
      selectedActionTags: []
    };
  }

  componentDidMount() {
    modelHelper.fetch((err, data) => {
      var state = this.state;
      state.data = data;
      this.setState(state);
    });
  }

  tagClicked(tag, enable, type) {
    var state = this.state;
    var key = 'selectedLocationTags';

    if (type == 'sensor') key = 'selectedSensorTags';
    else if (type == 'action') key = 'selectedActionTags';

    if (enable) {
      state[key].push(tag);
    } else if (state[key].includes(tag)) {
      state[key].splice(state[key].indexOf(tag), 1);
    }
    this.setState(state);
  }

  render() {
    var that = this;
    var model = modelHelper.create(this.state.data, {
      selectedLocations: this.state.selectedLocationTags,
      selectedSensors: this.state.selectedSensorTags,
      selectedActions: this.state.selectedActionTags
    });

    var allRules = model.allRecommenedRules;
    var sensors = _.uniq(_.flatten(allRules.map((rule) => { return rule.sensorTypes(); })));
    var actions = _.uniq(_.flatten(allRules.map((rule) => { return rule.actionTypes(); })));

    var locationTags = model.locations().map((location) => {
      var active = that.state.selectedLocationTags.includes(location.name);
      return <Tag tag={location.name} active={active} page={that} type='location' />;
    });

    var sensorTags = sensors.map((sensor) => {
      var active = that.state.selectedSensorTags.includes(sensor);
      return <Tag tag={sensor} active={active} page={that} type='sensor' />;
    });

    var actionTags = actions.map((action) => {
      var active = that.state.selectedActionTags.includes(action);
      return <Tag tag={action} active={active} page={that} type='action' />;
    });

    var rules = model.recommendedRules().map((rule) => {
      return <Rule rule={rule} />;
    });

    return (
      <Container location={this.props.location}>
        <span className="text-bold">Locations:</span>
        <ul className="pagination">
          {locationTags}
        </ul>

        <span className="text-bold">Sensors:</span>
        <ul className="pagination">
          {sensorTags}
        </ul>

        <span className="text-bold">Actions:</span>
        <ul className="pagination">
          {actionTags}
        </ul>

        <div className='columns'>
          {rules}
        </div>
      </Container>
      );
  }
}

module.exports = ExplorePage;
