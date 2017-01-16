module.exports = (node, model, graphParams) => {
  if (node.externalSystem) {
    var exists = graphParams.nodes.find((n) => { return n.id == node.uri; });
    if (!exists) {
      var e = model.externalSystems.find((e) => { return e.uri == node.uri; });
      graphParams.nodes.push({
        id: node.uri,
        label: e.name,
        css_class: 'node-purple'
      });
    }
  }

  if (node.uri) {
    return node.uri;
  } else if (node.join) {
    var joinId = 'join_' + node.join;

    if (!exists) {
      graphParams.nodes.push({
        id: joinId,
        label: 'Join',
        icon: 'fa-code-fork',
        css_class: 'node-grey'
      });
    }

    return joinId;
  }
};
