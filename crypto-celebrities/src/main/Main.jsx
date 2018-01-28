import React from 'react';
import { Table, Tooltip } from 'antd';
import './main.css';
import cryptoCelebritiesLogo from '../images/crypto-celebrities-logo.svg';
import jalepeno from '../images/jalepeno.svg';
import firebase from 'firebase';
import config from '../config.js';

firebase.initializeApp(config);
const db = firebase.database();

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersObj: [],
      sort: 'jalepeno',
      sortDesc: true,
      columns: [],
    }
  }
  componentWillMount() {
    db.ref(`users/`).once('value')
      .then((snap) => {
        // this.setState({ users });
        this.parseUsers(snap.val());
      });
  }
  getJalepenoLevel(celebrityData, name) {
    // Object.keys(celebrityData).forEach((key) => {
    //   console.log(key,': ', celebrityData[key]);
    // });
    const uniquePrices = [];
    Object.keys(celebrityData).forEach((timestamp) => {
      const currData = celebrityData[timestamp];
      if (uniquePrices.indexOf(currData.price) === -1) {
        uniquePrices.push({ price: currData.price, timestamp: currData.timestamp });
      }
    });
    const currUnixTime = Date.now() / 1000;
    let jalepenoLevel = 0;
    uniquePrices.forEach((data) => {
      if (data.timestamp > currUnixTime - 86400) {
        jalepenoLevel += 1;
      }
    })
    // console.log(name, jalepenoLevel);
    return jalepenoLevel;
  }
  parseUsers(users) {
    let keyVal = 0;
    let usersObj = [];

    Object.keys(users).forEach((name) => {
      const userObj = { key: null, name: null, price: null };
      const celebrityData = users[name];
      const latestDate = Object.keys(celebrityData).reduce((a, b) => celebrityData[a] > celebrityData[b] ? a : b);
      const latestCelebrityData = celebrityData[latestDate];
      const jalepenoLevel = this.getJalepenoLevel(celebrityData, celebrityData[latestDate].name);

      userObj.key = keyVal;
      userObj.name = latestCelebrityData.name;
      userObj.price = latestCelebrityData.price;
      userObj.jalepeno = jalepenoLevel;
      usersObj.push(userObj);
      keyVal += 1;
    });
    usersObj.sort((a, b) => b.price - a.price);
    const columns = [{
      title: <span style={{ cursor: 'pointer' }} onClick={() => this.sortSetter('name')}>Name</span>,
      dataIndex: 'name',
      key: 'name',
    }, {
      title: <span style={{ cursor: 'pointer' }} onClick={() => this.sortSetter('price')}>Price</span>,
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: (
        <Tooltip title="How active trading has been for the last 24 hours">
          <img onClick={() => this.sortSetter('jalepeno')} style={{ width: 35, cursor: 'pointer' }} src={jalepeno} />
        </Tooltip>),
      dataIndex: 'jalepeno',
      key: 'jalepeno',
    }];
    this.setState({ usersObj, columns });
  }

  sortSetter(type) {
    const { sort, sortDesc } = this.state;

    if (sort === type) {
      this.setState({ sortDesc: !sortDesc });
    } else {
      this.setState({ sort: type, sortDesc: true });
    }
  }

  sorter(usersObj) {
    const { sortDesc, sort } = this.state;

    if (sort === 'name') {

      if (sortDesc) {
        return usersObj.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      }
      return usersObj.sort((a, b) => {
        if (a.name > b.name) return -1;
        if (a.name < b.name) return 1;
        return 0;
      });

    } else {

      if (sortDesc) {
        return usersObj.sort((a, b) => a[sort] - b[sort]);
      }
      return usersObj.sort((a, b) => b[sort] - a[sort]);

    }
  }

  render() {
    const { usersObj, columns, sort } = this.state;

    return (
      <div className="container">
        <div className="header">
          <div className="inner-header">
            <img src={cryptoCelebritiesLogo} className="logo" />
            <div className="title">
              <h1>Crypto Celebrities Chart</h1>
              <div className="welcome-text">
                A curated chart to help you buy the next hottest celebrity!
            </div>
            </div>
          </div>
        </div>
        <div className="table-container">
          <Table dataSource={this.sorter(usersObj, sort)} columns={columns} />
        </div>
      </div>
    );
  }
}

export default Main;
