import React, { Component } from 'react';
import axios from 'axios'


class ListDevices extends Component {
    state = {
    }

    render() { 
        return (
          <div className="tableDiv">
            <tr>
              {this.props.header.map((key, index) => {
                if (key != 'id') {
                  return <th key={index}>{key.toUpperCase()}</th>;
                }
                else
                  return <th key={index}>{}</th>;
              })}
            </tr>
            {this.props.devices.map((device, index) => {
              const { id, type, name, status } = device;
              return (
                <tr key={id}>
                  <td>o</td>
                  <td>{type}</td>
                  <td>{name}</td>
                  <td>{status == 1 ? 'ON' : 'OFF'}</td>
                </tr>
              );
            })}
          </div>
        );
    }
}
 
export default ListDevices;