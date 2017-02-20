let React = require('react'),
    $ = require('jquery'),

    elements = require('../elements'),
    Loading = elements.Loading;


class VSTrain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: props.sensor};

    this._handleStartTraining = this._handleStartTraining.bind(this);
    this._handleStopTraining = this._handleStopTraining.bind(this);
    this._handleCancelTraining = this._handleCancelTraining.bind(this);
  }

  getTime(callback) {
    $.get('/api/time', (time) => {
      callback(time);
    });
  }

  _handleStartTraining(label) {
    this.getTime((time) => {
      this.state.trainingLabel = label;
      this.state.startedDemonstrating = time;
      this.setState(this.state);
    });
  }

  _handleStopTraining() {
    let sensor = this.props.sensor;
    let startedAt = this.state.startedDemonstrating;
    let label = this.state.trainingLabel;

    this.getTime((stoppedAt) => {
      sensor.addSample({
        id: Math.random().toString(36).substring(7),
        start: startedAt,
        end: stoppedAt,
        inputs: sensor.inputs,
        label: label
      });
      this.setState({
        startedDemonstrating: null,
        trainingLabel: null
      });
      this.props.updateSensor(sensor);
    });
  }

  _handleCancelTraining() {
    this.state.startedDemonstrating = null;
    this.state.trainingLabel = null;
    this.setState(this.state);
  }

  render() {
    let that = this;
    let body;
    let sensor = this.props.sensor;

    if (this.state.startedDemonstrating) {
      let text = 'Demonstrate the "' + this.state.trainingLabel + '" behaviour...';
      body = <div className='text-center'>
        <Loading text={text} />
        <div className='btn-group'>
          <button className='btn btn-primary btn-lg' onClick={this._handleStopTraining}>
            Stop and save demonstration
          </button>
          <button className='btn btn-lg' onClick={this._handleCancelTraining}>
            Cancel demonstration
          </button>
        </div>
      </div>;

    } else {
      let samples = (sensor.samples || []).map((sample) => {
        let startDate = new Date(sample.start * 1000);
        let endDate = new Date(sample.end * 1000);
        let start = startDate.toDateString() + ' ' + startDate.toLocaleTimeString();
        let end = endDate.toDateString() + ' ' + endDate.toLocaleTimeString();

        return <tr>
          <td> {sample.label} </td>
          <td>
            {start} <i className='fa fa-long-arrow-right' aria-hidden='true'></i> {end}
          </td>
        </tr>;
      });

      let rows;
      if (samples.length) {
        rows = samples;
      } else {
        rows = <tr>
          <td colSpan='4'>No demonstration samples yet...</td>
        </tr>;
      }

      let demonstrateButtons = sensor.labels.map((label) => {
        let onClick = () => {
          that._handleStartTraining(label);
        };
        return <button className='btn' onClick={onClick}> Demonstrate {label} </button>;
      });

      body = <div>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Label</th>
              <th>Trained at</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan='4'>
                <div className='btn-group'>
                  {demonstrateButtons}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>

      </div>;
    }

    return (
      <div>
        <h5>
          <i className='fa fa-thermometer-full' aria-hidden='true'></i>&nbsp;
          Train virtual sensor: {this.props.sensor.name}
        </h5>
        {body}
      </div>
    );
  }
}

module.exports = VSTrain;
