import React, { Component } from 'react';
import Select from "react-select";
import axios from 'axios'

class AddDevice extends Component {
    state = {
        options: ['Light', 'Fan', 'TV'],
        deviceType: 'Light',
        status: '',
        name: ''
    }

    dropdownValue = (selectedOption) => {
        this.setState({
            deviceType: selectedOption,
        });
    }

    statusValue = (selectedOption) => {
        this.setState({
            status: selectedOption,
        });
    }

    deviceName = (e) => {
        let name = e.target.value;
        this.setState({
            name: name,
        });
    }

    sendRequest = async () => {
        const requestBody = {
            type: this.state.deviceType.value,
            name: this.state.name,
            status: this.state.status.value
        }
        const response = await axios
          .post(
            "http://ec2-13-233-244-253.ap-south-1.compute.amazonaws.com:3000/devices",
            requestBody,
            { headers: { "Content-Type": "application/json" } }
          )
          .catch((error) => {
            alert(error);
          });
        if (response) {
            alert('Device successfully installed')
            this.props.updatePage()
        }
    }

    render() {
        let style = {
            display: 'flex'
        }
        const deviceTypeList = [
            { label: "Light", value: "Light" },
            { label: "Fan", value: "Fan" },
            { label: "TV", value: "TV" }
        ];

        const toggleStatus = [
            { label: "ON", value: 1 },
            { label: "OFF", value: 0 },
        ];
        return (
            <div>
                <div className="inputDiv">
                    <span>Enter Device Name: </span>
                    <input type="text" onChange={(e) => this.deviceName(e)}></input>
                </div>
                <div className="dropdownDiv">
                    <span>Enter Device Type: </span>
                    <Select className="dropdown" options={deviceTypeList} onChange={this.dropdownValue}></Select>
                </div>
                <div className="statusDiv">
                    <span>Enter Device Status: </span>
                    <Select className="statusDropdown" options={toggleStatus} onChange={this.statusValue}></Select>
                </div>
                <button className="submit" onClick={this.sendRequest}>Submit</button>
            </div>
        );
    }
}

export default AddDevice;