import { UserOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';

import { RouterLinks } from '../const/RouterLinks';
const { Header } = Layout;

const AppHeader = () => {
  const userData = localStorage.getItem('name');

  return (
    <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ marginRight: '7px' }}>
        <h4 style={{ marginTop: '2px' }}>{userData} </h4>
      </div>
      <UserOutlined style={{ fontSize: '25px', padding: '14px',marginRight:"20px", color: 'black' }} />
    </Header>
  );
};

export default AppHeader;
