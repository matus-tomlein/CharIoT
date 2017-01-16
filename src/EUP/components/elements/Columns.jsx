var React = require('react');

var Columns = React.createClass({

  render: function () {
    var groupedChildren = [];
    var numColumns = this.props.numColumns || 2;
    if (Array.isArray(this.props.children)) {
      for (var i in this.props.children) {
        if (i % numColumns == 0) {
          groupedChildren.push([]);
        }

        var child = this.props.children[i];
        var classNames = [
          'column'
        ];
        classNames.push('col-' + (12 / numColumns));
        if (this.props.xs)
          classNames.push('col-xs-' + this.props.xs);
        if (this.props.sm)
          classNames.push('col-sm-' + this.props.sm);
        else
          classNames.push('col-sm-12');
        if (this.props.md)
          classNames.push('col-md-' + this.props.md);
        else if (numColumns > 1)
          classNames.push('col-md-6');

        var className = classNames.join(' ');

        groupedChildren[groupedChildren.length - 1].push(
          <div className={className}>
            {child}
          </div>
        );
      }
    } else  {
      groupedChildren = [
          [
            <div className='column col-sm-12'>
              {this.props.children}
            </div>
          ]
      ];
    }

    var columns = groupedChildren.map(function (group) {
      return (
        <div className="columns">
          {group}
        </div>
      );
    });

    return (
      <div>
        {columns}
      </div>
    );
  }
});

module.exports = Columns;
