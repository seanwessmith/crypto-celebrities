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
      sortAsc: false,
      columns: [],
    }
  }
  componentWillMount() {
    db.ref(`snapshot/`).once('value')
      .then((returnVal) => {
        const snapshot = returnVal.val();
        const usersObj = [];

        snapshot.forEach((snap) => {
          usersObj.push(snap);
        });

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
      });
  }

  sortSetter(type) {
    const { sort, sortAsc } = this.state;

    if (sort === type) {
      this.setState({ sortAsc: !sortAsc });
    } else {
      this.setState({ sort: type, sortAsc: true });
    }
  }

  sorter(usersObj) {
    const { sortAsc, sort } = this.state;

    if (sort === 'name') {

      if (sortAsc) {
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

      if (sortAsc) {
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
        <div className="explanation">
          <p><img style={{ width: 25 }} src={jalepeno} /> indicates how many times that celebrity has been traded in the last 24 hours.</p>
        </div>
        <div className="table-container">
          <Table dataSource={this.sorter(usersObj)} columns={columns} />
        </div>
      </div>
    );
  }
}

export default Main;
