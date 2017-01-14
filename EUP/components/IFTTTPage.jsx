var React = require('react'),

    renderPage = require('./IFTTT/renderPage.jsx'),

    elements = require('./elements'),
    Container = elements.Container,

    modelHelper = require('./modelHelper');


class IFTTTPage extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.recommendedRule) {
      var model = this.props.model;
      var rule = model.allRecommenedRules.find((rule) => {
        return rule.id == this.props.recommendedRule;
      });

      if (rule) {
        this.state = {
          conditions: rule.data.conditions,
          actions: rule.data.actions
        };
        return;
      }
    }

    this.state = {
      conditions: [],
      actions: []
    };
  }

  render() {
    return renderPage(this, this.props.model);
  }
}

class IFTTTPageWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    modelHelper.fetch((err, data) => {
      this.setState({ data: data });
    });
  }

  render() {
    var page = <div />;
    if (this.state.data) {
      var model = modelHelper.create(this.state.data);
      if (this.props.params.id) {
        page = <IFTTTPage model={model}
          recommendedRule={this.props.params.id} />;
      } else {
        page = <IFTTTPage model={model} />;
      }
    }
    return <Container location={this.props.location}>
      {page}
    </Container>;
  }
}

module.exports = IFTTTPageWrapper;
