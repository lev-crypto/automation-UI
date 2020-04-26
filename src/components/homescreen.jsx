import React, { Component } from 'react';
import '../css/homescreen.css'
import ListDevices from './listDevices'
import AddDevice from './addDevice';
import Select from 'react-select'
import axios from 'axios'

class HomeScreen extends Component {
    state = {
        isList: false,
        isAdd: false,
        isRemove: false,
        isToggle: false,
        GET_ALL_DEVICE_URL: 'http://ec2-13-233-244-253.ap-south-1.compute.amazonaws.com:3000/devices',
        devices: [],
        removeDropdown: [],
        statusDropdown: [{ label: 'ON', value: 1 }, { label: 'OFF', value: 0 }],
        removeDeviceId: 0,
        status: 0

    }

    async componentWillMount() {
        let allDevices = await axios
          .get(this.state.GET_ALL_DEVICE_URL)
          .catch((error) => {
            alert(error);
          });
        let header = Object.keys(allDevices.data[0]);
        let removeDropdown = []
        allDevices.data.map(device => {
            let opt = {
                label: '',
                value: ''
            }
            opt.label = device.name;
            opt.value = device.id
            removeDropdown.push(opt)
        })
        let statusDropdown = []
        this.setState({
            devices: allDevices.data,
            header: header,
            removeDropdown: removeDropdown
        })
    }

    redirectToDocumentation = () => {
        window.open(
            "http://ec2-13-233-244-253.ap-south-1.compute.amazonaws.com:3000/explorer/"
        );
    }

    loadListComponent = () => {
        this.setState({
            isList: true,
            isAdd: false,
            isRemove: false,
            isToggle: false
        })
    }

    loadAddDeviceComponet = () => {
        this.setState({
            isList: false,
            isAdd: true,
            isRemove: false,
            isToggle: false,
        });
    }

    loadRemoveComponent = () => {
        this.setState({
            isList: false,
            isAdd: false,
            isRemove: true,
            isToggle: false,
        });
    }

    loadChangeStatusComponent = () => {
          this.setState({
            isList: false,
            isAdd: false,
            isRemove: false,
            isToggle: true,
          });
    }

    removeDevice = selectedOption => {
        this.setState({
            removeDeviceId: selectedOption.value
        })
    }

    setStatus = selectedOption => {
        this.setState({
          status: selectedOption.value,
        });
    }

    updatePage = async () => {
        let allDevices = await axios.get(this.state.GET_ALL_DEVICE_URL)
            .catch(error => {
            alert(error)    
        })
        let removeDropdown = [];
        allDevices.data.map((device) => {
            let opt = {
                label: "",
                value: "",
            };
            opt.label = device.name;
            opt.value = device.id;
            removeDropdown.push(opt);
        });
        this.setState({
            devices: allDevices.data,
            removeDropdown: removeDropdown,
        });
    }

    uninstallDevice = async () => {
        const url = 'http://ec2-13-233-244-253.ap-south-1.compute.amazonaws.com:3000/devices/' + this.state.removeDeviceId
        console.log(url)
        const response = await axios
          .delete(url, { headers: { "Content-Type": "application/json" } })
          .catch((error) => {
            alert(error);
          });
        if (response) {
            alert('Device Successfully Removed')
            this.updatePage();
        }
    }

    changeDeviceState = async () => {
        const url = 'http://ec2-13-233-244-253.ap-south-1.compute.amazonaws.com:3000/devices/' + this.state.removeDeviceId
        let deviceData = {}
        this.state.devices.map((device) => {
            if (device.id == this.state.removeDeviceId)
                deviceData = device
        })
        let mode = deviceData.status == 0 ? 'OFF' : 'ON'
        if (deviceData.status == this.state.status) {
            alert(`Device already: ${mode}`)
            return
        }
        const requestBody = {
        type: deviceData.type,
        name: deviceData.name,
        status: this.state.status,
        };

         const response = await axios.put(
            url,
           requestBody,
           { headers: { "Content-Type": "application/json" } }
        )
        .catch(error => {
            alert(error)    
        })
         if (response) {
           alert("Device State changed");
           this.updatePage();
        }
        
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="column grow">
                        <div className="card" onClick={this.loadListComponent}>
                            <h4>List All Devices</h4>
                        </div>
                    </div>

                    <div className="column positioning grow">
                        <div className="card" onClick={this.loadAddDeviceComponet}>
                            <h4>Add New device</h4>
                        </div>
                    </div>

                    <div className="column positioning position2 grow">
                        <div className="card" onClick={this.loadRemoveComponent}>
                            <h4>Remove Device</h4>
                        </div>
                    </div>

                    <div className="column positioning position3 grow">
                        <div className="card" onClick={this.loadChangeStatusComponent}>
                            <h4>Switch ON/OFF</h4>
                        </div>
                    </div>
                </div>
                <button
                    className="documentation"
                    onClick={this.redirectToDocumentation}
                >
                    Swagger UI
            </button>
                <div className="renderComponent">
                    {this.state.isList && (
                        <div className="tableList">
                            <h1 id="title">List of All devices</h1>
                            <table id="devices">
                                <tbody>
                                    <ListDevices
                                        devices={this.state.devices}
                                        header={this.state.header}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                    {this.state.isAdd && <AddDevice updatePage={this.updatePage} />}
                    {this.state.isRemove && (
                        <div>
                            <h3>Remove an installed device</h3>
                            <Select options={this.state.removeDropdown} onChange={this.removeDevice}></Select>
                            <button className="remove" onClick={this.uninstallDevice}>Remove device</button>
                        </div>
                    )}
                    {this.state.isToggle && (
                        <div>
                            <h3>Change Device state</h3>
                            <Select options={this.state.removeDropdown} onChange={this.removeDevice}></Select>
                            <br />
                            <Select options={this.state.statusDropdown} onChange={this.setStatus}></Select>
                            <br />
                            <button className="remove" onClick={this.changeDeviceState}>Change Status</button>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default HomeScreen;