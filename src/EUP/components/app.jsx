var React = require('react'),
    ReactDOM = require('react-dom'),

    RefreshPage = require('./RefreshPage.jsx'),
    LoginPage = require('./LoginPage.jsx'),
    EditConfigurationPage = require('./EditConfigurationPage.jsx'),
    ExplorePage = require('./ExplorePage.jsx'),
    IFTTTPage = require('./IFTTTPage.jsx'),
    TrainVirtualSensorPage = require('./TrainVirtualSensorPage.jsx'),
    OverviewPage = require('./OverviewPage.jsx'),

    elements = require('./elements'),
    Container = elements.Container,

    Router = require('react-router').Router,
    Route = require('react-router').Route,
    browserHistory = require('react-router').browserHistory;

class NoMatch extends React.Component {
  render() {
    return <Container>
      <h1>
        <i className="fa fa-frown-o" aria-hidden="true"></i>&nbsp;
        404 Page not found
      </h1>
    </Container>;
  }
}

class Application extends React.Component {
  render() {
    return <div>
      <Router history={browserHistory}>
        <Route path="/" component={OverviewPage} />
        <Route path="/login" component={LoginPage}/>
        <Route path="/configure" component={EditConfigurationPage}/>
        <Route path="/refresh" component={RefreshPage}/>
        <Route path="/explore" component={ExplorePage}/>
        <Route path="/build" component={IFTTTPage}/>
        <Route path="/build/:id" component={IFTTTPage}/>
        <Route path="/train/:id" component={TrainVirtualSensorPage}/>

        <Route path="*" component={NoMatch}/>
      </Router>
    </div>;
  }
}

ReactDOM.render(<Application />, document.getElementById('container'));
