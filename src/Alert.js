import React, { Component } from 'react';
//import "./alert.css"

class Alert extends Component {
  constructor(props) {
    super(props);
    this.color = null;
  }

  getStyle = () => {
    return {
      color: this.color,

    };
  };

  render() {
    return (
      <div className="Alert">
        <p style={this.getStyle()}>{this.props.text}</p>
      </div>
    );
  }
}

/**
 * @description Alert component for displaying info messages
 * @extends Alert
 */


class InfoAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = 'green';
  }
}

class OfflineAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = 'orange';
  }
}
class ErrorAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = 'red';
  }
}

export { InfoAlert, OfflineAlert, ErrorAlert };