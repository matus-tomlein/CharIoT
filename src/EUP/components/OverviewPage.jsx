var React = require('react'),

    Container = require('./elements').Container,

    InstallationOverviewSection = require('./InstallationOverviewSection.jsx'),

    modelHelper = require('./modelHelper');

class OverviewPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = modelHelper.blankData;
  }

  componentDidMount() {
    modelHelper.fetch((err, data) => {
      this.setState(data);
    });
  }

  render() {
    var model = modelHelper.create(this.state);
    return (
      <Container location={this.props.location}>
        <InstallationOverviewSection model={model} />
      </Container>
    );
  }
}

module.exports = OverviewPage;
