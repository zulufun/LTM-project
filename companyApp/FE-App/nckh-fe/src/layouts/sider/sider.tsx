import Sider from "antd/es/layout/Sider";
import { Image, Menu } from "antd";
import { useNavigate } from "react-router-dom";
// import { CheckCircleOutlined, LineChartOutlined } from "@ant-design/icons";
import { CheckCircleOutlined, LineChartOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import SubMenu from "antd/es/menu/SubMenu";
import { memo } from "react";
import { RouterLinks } from "../../const/RouterLinks";

const menuItems = [
  {
    key: "kiem-tra",
    label: "Kiểm tra",
    icon: (
      <CheckCircleOutlined
        style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }}
      />
    ),
    children: [
      {
        key: RouterLinks.KIEM_TRA_WEBSITE,
        label: "Quét website",
      },
      {
        key: RouterLinks.KIEM_TRA__ONE_WEBSITE,
        label: "Kiểm tra web",
      },
    ],
  },
  {
    key: "thong-ke",
    label: "Thống kê",
    icon: (
      <LineChartOutlined
        style={{ fontSize: "1.3rem", paddingRight: "0.5rem" }}
      />
    ),
    children: [
      {
        key: RouterLinks.THONG_KE_COUNT,
        label: "Danh sách page nhạy cảm",
      },
      {
        key: RouterLinks.THONG_KE_TIME,
        label: "Thống kê ",
      },
    ],
  },
];
const Sidebar = () => {
  const navigate = useNavigate();
  const onClick = (e: any) => {
    navigate(e.key);
  };
  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
      // style={{width}}
      width={230}
      trigger={null}
      collapsible
      // style={{ height: "100vh" }}
    >
      <div style={{ margin: "0 auto" }}>
        <Image
          src={logo}
          preview={false}
          style={{
            padding: 5,
            width: "170px",
            height: "65px",
            marginTop: "7px",
          }}
        />
      </div>
      <Menu
        selectedKeys={[
          "/" +
            window.location.pathname.split("/")[1] +
            "/" +
            window.location.pathname.split("/")[2],
        ]}
        defaultOpenKeys={[window.location.pathname.split("/")[1]]}
        theme="dark"
        mode="inline"
        items={menuItems}
        onClick={onClick}
      >
        {menuItems.map((item) => {
          if (item.children) {
            return (
              <SubMenu
                key={item.key}
                title={
                  <span>
                    {" "}
                    {item.icon}
                    {item.label}
                  </span>
                }
              >
                {item.children.map((childItem) => (
                  <Menu.Item key={childItem.key}>
                    {/* <Link to={childItem.key}>{childItem.label}</Link> */}
                    {item.label}
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
                {/* <Link to={item.key}>{item.label}</Link> */}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </Sider>
  );
};

export default memo(Sidebar);
