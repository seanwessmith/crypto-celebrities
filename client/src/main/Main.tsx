import React, { useEffect } from "react";
import { Table, Tooltip } from "antd";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import cryptoCelebritiesLogo from "../images/crypto-celebrities-logo.svg";
import jalepeno from "../images/jalepeno.svg";
import "./main.css";

const firebaseConfig = {
  databaseURL: "https://DATABASE_NAME.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

const Main = () => {
  const [usersObj, setUsersObj] = React.useState<any[]>([]);
  const [columns, setColumns] = React.useState<any[]>([]);
  const [sort, setSort] = React.useState("jalepeno");
  const [sortAsc, setSortAsc] = React.useState(false);

  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const usersObj: any[] = [];

      snapshot.forEach((snap) => {
        usersObj.push(snap);
      });

      const columns = [
        {
          title: (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => sortSetter("name")}
            >
              Name
            </span>
          ),
          dataIndex: "name",
          key: "name",
        },
        {
          title: (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => sortSetter("price")}
            >
              Price
            </span>
          ),
          dataIndex: "price",
          key: "price",
        },
        {
          title: (
            <Tooltip title="How active trading has been for the last 24 hours">
              <img
                onClick={() => sortSetter("jalepeno")}
                style={{ width: 35, cursor: "pointer" }}
                src={jalepeno}
              />
            </Tooltip>
          ),
          dataIndex: "jalepeno",
          key: "jalepeno",
        },
      ];
      setUsersObj(usersObj);
      setColumns(columns);
    });
  });

  const sortSetter = (type: any) => {
    if (sort === type) {
      setSortAsc(!sortAsc);
    } else {
      setSort(type);
      setSortAsc(true);
    }
  };

  const sorter = (usersObj: any) => {
    if (sort === "name") {
      if (sortAsc) {
        return usersObj.sort((a: any, b: any) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      }
      return usersObj.sort((a: any, b: any) => {
        if (a.name > b.name) return -1;
        if (a.name < b.name) return 1;
        return 0;
      });
    } else {
      if (sortAsc) {
        return usersObj.sort((a: any, b: any) => a[sort] - b[sort]);
      }
      return usersObj.sort((a: any, b: any) => b[sort] - a[sort]);
    }
  };

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
        <p>
          <img style={{ width: 25 }} src={jalepeno} /> indicates how many times
          that celebrity has been traded in the last 24 hours.
        </p>
      </div>
      <div className="table-container">
        <Table dataSource={sorter(usersObj)} columns={columns} />
      </div>
    </div>
  );
};

export default Main;
