import React, { useContext } from "react";
import { Layout, theme, Dropdown, MenuProps } from "antd";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { RouterLinks } from "../const/RouterLinks";
// import { AppContext } from "../context/appContext";
import Sidebar from "./sider/sider";
import AppHeader from "./Header";
import "./Layout.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

const { Content, Header } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  // const { socket } = useContext(AppContext);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  const hanldeLogout = () => {
    localStorage.clear();
    navigate(RouterLinks.LOGIN);
  };
  const items: MenuProps["items"] = [
    {
      label: (
        <div onClick={hanldeLogout} style={{ color: "red" }}>
          <FontAwesomeIcon
            style={{ marginRight: "7px" }}
            icon={faArrowRightFromBracket}
          />
          Đăng xuất
        </div>
      ),
      key: "0",
    },
  ];

  return (
    <Layout hasSider>
      <Sidebar />
      <Layout style={{ marginLeft: 220 }} className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Dropdown menu={{ items }} trigger={["click"]}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "38px",
                cursor: "pointer",
              }}
            >
              {/* <UserOutlined  style={{marginRight:"5px", fontSize:"20px"}}/> */}
              <FontAwesomeIcon
                icon={faUserCircle}
                style={{ marginRight: "5px", fontSize: "25px", color: "gray" }}
              />
              <div>{"Admin"}</div>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
