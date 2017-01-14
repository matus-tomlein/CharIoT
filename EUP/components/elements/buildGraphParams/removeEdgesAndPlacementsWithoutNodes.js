module.exports = (graphParams) => {
  var hasNode = (id) => {
    return graphParams.nodes.find((node) => { return node.id == id; });
  };

  var hasEdge = (id) => {
    return graphParams.edges.find((e) => { return e.from == id || e.to == id; });
  };

  var removeEdgesAndNodes = () => {
    graphParams.edges = graphParams.edges.filter((edge) => {
      return hasNode(edge.from) && hasNode(edge.to);
    });

    graphParams.nodes = graphParams.nodes.filter((node) => {
      return !node.removeIfNoEdges || hasEdge(node.id);
    });
  };

  removeEdgesAndNodes();
  removeEdgesAndNodes();

  graphParams.placements = graphParams.placements.filter((pl) => {
    return hasNode(pl.of);
  });
};
