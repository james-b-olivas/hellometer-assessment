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
      slowTimeMetric: '',
      mostRecentSlowTime: 100,
      currentDay: 22,
      tempCurrentDay: '22'
    }
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.setCurrentDay = this.setCurrentDay.bind(this);
  }

  setCurrentDay(e) {
    e.preventDefault();
    this.setState({tempCurrentDay: e.target.value});
  }

  handleTextChange(e) {
    e.preventDefault();
    let numVal = parseInt(e.target.value);
    this.setState({slowTimeMetric: numVal});
  }

  handleFileChange(e) {
    e.preventDefault();
    if (isNaN(this.state.slowTimeMetric) || this.state.slowTimeMetric.length === 0) {
      alert("Please input a numeric time value!");
      return;
    }
    let val = parseInt(this.state.tempCurrentDay);
    if (isNaN(val) || val < 22 || val > 29) {
      alert("Please input a proper date between March 22 and March 29!");
      return;
    }
    this.setState({
      mostRecentSlowTime: this.state.slowTimeMetric,
      currentDay: val
    })
    $.get('/api/csv', (data) => {
      console.log(data);
      let slowPickupCount = 0;
      let slowPreOrderboardCount = 0;
      for (let customer of data) {
        let date = parseInt(customer.arrival_time.slice(8, 10));
        if (date > this.state.currentDay) break;
        if (date < this.state.currentDay) continue;
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
              <input type="text" onChange={this.handleTextChange}></input>
            </div>
          </label>
          <label>
            Choose a day between March 22 and March 29
            <div>
              March <input type="text" value={this.state.tempCurrentDay} onChange={this.setCurrentDay}/>
              {/* <button onClick={this.submitCurrentDay}>Enter Date</button> */}
            </div>
          </label>
          <form>
            <button onClick={this.handleFileChange}>Process Data</button>
          </form>
          <div>
            {this.state.hasFile ? <div>
              On March {this.state.currentDay}:
              <div>
                There are {this.state.slowPreOrderboardCount} customers who waited over {this.state.mostRecentSlowTime} units for someone to take their order.
              </div>
              <div>
                There are {this.state.slowPickupCount} customers who waited over {this.state.mostRecentSlowTime} units after they placed their order.
              </div>
            </div> :null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;