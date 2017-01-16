var React = require('react'),
    $ = require('jquery'),
    dagreD3 = require('./dagre-d3'),
    d3 = require('./d3');

function makeid() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i=0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var DagreD3Graph = React.createClass({

  getInitialState: function () {
    return { id: 'layout-' + makeid() };
  },

  componentDidUpdate: function() {
    this.componentDidMount();
  },

  componentDidMount: function () {
    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true})
      .setGraph({})
      .setDefaultEdgeLabel(function() { return {}; });

    // Here we"re setting nodeclass, which is used by our custom drawNodes function
    // below.
    this.props.nodes.map(function (node) {
      var label = node.label;
      if (node.icon)
        label = '<i class="fa ' + node.icon + '" aria-hidden="true"></i> ' + label;

      g.setNode(node.id, {
        label: label,
        labelType: 'html',
        class: node.css_class
      });
    });

    this.props.locations.map(function (location) {
      g.setNode(location.id, {
        label: location.label,
        clusterLabelPos: 'top',
        labelStyle: 'font-weight: bold',
        style: 'fill: ' + location.fill
      });
    });

    g.nodes().forEach(function(v) {
      var node = g.node(v);
      // Round the corners of the nodes
      node.rx = node.ry = 5;
    });

    this.props.placements.map(function (placement) {
      g.setParent(placement.of, placement.in);
    });

    // Set up edges, no special attributes.
    this.props.edges.map(function (edge) {
      var styles = ['fill: none'];
      if (edge.dashed) styles.push('stroke-dasharray: 5, 5');
      if (edge.width) styles.push('stroke-width: ' + edge.width);
      if (edge.color) styles.push('stroke: ' + edge.color);

      g.setEdge(edge.from, edge.to, {
        label: edge.label,
        lineInterpolate: edge.lineInterpolateBasis ? '' : 'basis',
        labelStyle: 'font-style: italic;',
        style: styles.join('; '),
        arrowhead: edge.arrowhead || 'normal',
        arrowheadClass: edge.arrowheadClass
      });
    });

    var selectQuery = '#' + this.state.id;

    var render = dagreD3.render();
    d3.select(selectQuery + ' g').call(render, g);
    $(selectQuery).width(g.graph().width);
    $(selectQuery).height(g.graph().height);

    if (this.props.nodeClicked) {
      var selections = d3.selectAll('g.node');
      selections.on('click', this.props.nodeClicked);
    }
  },

  render: function () {
    var style = { overflow: 'scroll' };
    return (
      <div style={style}>
        <svg id={this.state.id}><g/></svg>
      </div>
    );
  }
});

module.exports = DagreD3Graph;
