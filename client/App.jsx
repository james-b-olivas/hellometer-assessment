import React, { Component } from 'react';
import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasFile: false,
      stats: [],
      slowPickupCount: 0,
      slowPreOrderboardCount: 0,
      slowTimeMetric: 100,
      mostRecentSlowTime: 100
    }
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleTextChange(e) {
    e.preventDefault();
    let numVal = parseInt(e.target.value);
    this.setState({slowTimeMetric: numVal});
  }

  handleFileChange(e) {
    e.preventDefault();
    if (isNaN(this.state.slowTimeMetric)) {
      alert("Please input a numeric value!");
      return;
    }
    this.setState({
      mostRecentSlowTime: this.state.slowTimeMetric
    })
    $.get('/api/csv', (data) => {
      console.log(data);
      let slowPickupCount = 0;
      let slowPreOrderboardCount = 0;
      for (let customer of data) {
        if (customer.pickup > this.state.slowTimeMetric) {
          slowPickupCount++;
        }
        if (customer.pre_orderboard > this.state.slowTimeMetric) {
          slowPreOrderboardCount++;
        }
      }
      this.setState({
        hasFile: true,
        stats: data,
        slowPickupCount,
        slowPreOrderboardCount
      })
    })
  }

  render() {
    return(
      <div>
        <div style={{ textAlign: "center" }}>
          <h1>Slow Time Checker</h1>
          <label>
            Input a value of time: how slow is too slow for a customer to wait?
            <div>
              <input type="text" value={this.state.slowTimeMetric} onChange={this.handleTextChange}></input>
            </div>
          </label>
          <form>
            <button onClick={this.handleFileChange}>Update</button>
          </form>
          <div>
            {this.state.hasFile ? <div>
              There are {this.state.slowPreOrderboardCount} customers who waited over {this.state.mostRecentSlowTime} units for someone to take their order.
              There are {this.state.slowPickupCount} customers who waited over {this.state.mostRecentSlowTime} units after they placed their order.
            </div> :null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;