var React = require('react'),
    $ = require('jquery'),

    elements = require('./elements'),
    Container = elements.Container;

var UriInput = React.createClass({
  _uriChanged: function (event) {
    this.props.parent.uriChanged(event.target.value, this.props.i);
  },

  _handleRemove: function () {
    this.props.parent.removeRow(this.props.i);
  },

  render: function () {
    return (
      <tr>
        <td>
          <input type="text" className="form-input" value={this.props.uri} onChange={this._uriChanged} />
        </td>
        <td>
          <button className='btn btn-link' onClick={this._handleRemove}>
            Remove
          </button>
        </td>
      </tr>
    );
  }
});

var EditConfigurationPage = React.createClass({
  getInitialState: function () {
    return { data: { hubs: [] } };
  },

  loadConfiguration: function () {
    $.get('/api/data', function (data) {
      this.setState({ data: data.configuration });
    }.bind(this));
  },

  componentDidMount: function() {
    this.loadConfiguration();
  },

  _handleAddHub: function () {
    var state = this.state;
    if (!state.data.hubs) {
      state.data.hubs = [];
    }
    state.data.hubs.push({ uri: 'http://' });
    this.setState(state);
  },

  removeRow: function (i) {
    var state = this.state;
    state.data.hubs.splice(i, 1);
    this.setState(state);
  },

  uriChanged: function (uri, i) {
    var state = this.state;
    state.data.hubs[i].uri = uri;
    this.setState(state);
  },

  _handleSave: function () {
    $.post('/api/configuration', this.state.data);
  },

  render: function() {
    var that = this;
    var hubElements = (this.state.data.hubs || []).map(function (hub, i) {
      return <UriInput uri={hub.uri}
        i={i}
        parent={that} />;
    });

    return (
      <Container location={this.props.location}>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Hub URIs</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {hubElements}
          </tbody>
          <tfoot>
            <tr>
              <th>
                <button className='btn btn-link' onClick={this._handleAddHub}>
                  Add a Hub
                </button>
              </th>
              <th>&nbsp;</th>
            </tr>
          </tfoot>
        </table>

        <div className='columns'>
          <div className='column col-sm-12'>
            <div className='actions'>
              <button className='btn btn-outlined' type='submit' onClick={this._handleSave}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </Container>);
  }
});

module.exports = EditConfigurationPage;
