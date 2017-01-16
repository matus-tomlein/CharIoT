var React = require('react'),
    Link = require('react-router').Link;

var MenuBar = React.createClass({
  render: function() {
    var devicesClass = 'page-item',
        installClass = 'page-item',
        buildClass = 'page-item';
    switch (this.props.location.pathname) {
    case '/':
      devicesClass += ' active'; break;
    case '/explore':
      installClass += ' active'; break;
    case '/build':
      buildClass += ' active'; break;
    }

    var largeStyle = { 'font-size': 'large' };
    return (
      <div>
        <div className='text-center' style={largeStyle}>
          <ul className='pagination'>
            <li className={devicesClass}>
              <Link to='/'>
                <i className="fa fa-home" aria-hidden="true"></i>&nbsp;
                My Installation
              </Link>
            </li>
            <li className={installClass}>
              <Link to='/explore'>
                <i className="fa fa-shopping-cart" aria-hidden="true"></i>&nbsp;
                Explore
              </Link>
            </li>
            <li className={buildClass}>
              <Link to='/build'>
                <i className="fa fa-paint-brush" aria-hidden="true"></i>&nbsp;
                Build
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = MenuBar;
