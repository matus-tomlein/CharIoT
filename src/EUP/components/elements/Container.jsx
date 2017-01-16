var React = require('react'),
    Link = require('react-router').Link,
    MenuBar = require('./MenuBar.jsx');

var Container = React.createClass({
  render: function() {
    return (
      <div>
        <div className="container grid-960">
          <MenuBar application={this} location={this.props.location} />
          {this.props.children}
        </div>
        <br /> <br />
        <footer>
          <section id='copyright' className='grid-footer container grid-960'>
            <p>
              <Link to='/' className='btn btn-link'>
                <i className='fa fa-rocket' aria-hidden='true'></i>&nbsp;
                CharIoT
              </Link>
              <Link to='/configure' className='btn btn-link'>
                <i className='fa fa-pencil' aria-hidden='true'></i>&nbsp;
                configure
              </Link>
              <Link to='/refresh' className='btn btn-link'>
                <i className='fa fa-refresh' aria-hidden='true'></i>&nbsp;
                refresh
              </Link>
            </p>
          </section>
        </footer>
      </div>
    );
  }
});

module.exports = Container;
