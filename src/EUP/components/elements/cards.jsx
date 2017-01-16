var React = require('react');

var Card = React.createClass({
  render: function () {
    return <div className="card">
      {this.props.children}
    </div>;
  }
});

var CardHeader = React.createClass({
  render: function () {
    var meta = <span />;
    if (this.props.meta)
      meta = <h5 className="card-meta">{this.props.meta}</h5>;

    return <div className="card-header">
      <h5 className="card-title">
        {this.props.title}
      </h5>
      {meta}
    </div>;
  }
});

var CardBody = React.createClass({
  render: function () {
    return <div className="card-body">
      {this.props.children}
    </div>;
  }
});

var CardFooter = React.createClass({
  render: function () {
    return <div className="card-footer">
      {this.props.children}
    </div>;
  }
});

var CollapsibleCard = React.createClass({
  getInitialState: function () {
    return { collapsed: !this.props.open };
  },

  _toggleCollapse: function () {
    this.setState({ collapsed: !this.state.collapsed });
  },

  render: function () {
    var body = <div className='pt-10' />;
    if (!this.state.collapsed) {
      body = this.props.children;
    }
    var style = { 'cursor': 'pointer' };
    var arrow = this.state.collapsed ?
          <i className="fa fa-arrow-down" aria-hidden="true"></i> :
          <i className="fa fa-arrow-up" aria-hidden="true"></i>;

    return <div className='mt-10'>
      <Card>
        <div className='card-header'>
          <p className='text-bold text-center text-uppercase'
            onClick={this._toggleCollapse}
            style={style}>
            {this.props.title}
            &nbsp;
            {arrow}
          </p>
        </div>
        {body}
      </Card>
    </div>;
  }
});

module.exports = {
  Card: Card,
  CardHeader: CardHeader,
  CardFooter: CardFooter,
  CardBody: CardBody,
  CollapsibleCard: CollapsibleCard
};
