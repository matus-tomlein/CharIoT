const React = require('react');

class Loading extends React.Component {
  render() {
    var text = this.props.text || 'Loading, please wait...';

    return <div>
        <div className="spinner">
          <div className="cube1"></div>
          <div className="cube2"></div>
        </div>
        <h1 className='text-center'>{text}</h1>
      </div>;
  }
}

module.exports = Loading;
