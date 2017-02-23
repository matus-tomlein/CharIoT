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
    let updateData = () => {
      modelHelper.fetch((err, data) => {
        if (this.state.data != data) {
          this.setState(data);
        }
      });
    };

    updateData();
    this._timer = setInterval(updateData, 1000);
  }

  componentWillUnmount() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
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
