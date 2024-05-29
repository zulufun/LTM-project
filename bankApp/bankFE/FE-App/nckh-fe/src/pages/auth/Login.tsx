import React from "react";
import { Form, Button, Input, Row, Col } from "antd";
import { message } from "antd";
import { authService } from "../../utils/services/authServices";
import { useDispatch } from "react-redux";
import useAction from "../../redux/useActions";
import { useNavigate } from "react-router-dom";
import { RouterLinks } from "../../const/RouterLinks";
import loginBack from "../../assets/login-v2.svg";
import ThongKeCount from './../../../../../../../../../../FE-App/nckh-fe/src/pages/thong-ke-count/index';

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (value: any) => {
    // localStorage.setItem("username", "hoangnam");
    // localStorage.setItem("name", "Hoàng Nam");
    // localStorage.setItem("token", "ok");
    // navigate(RouterLinks.KIEM_TRA_WEBSITE);
      try {
        const res = await authService.login(value);
        console.log(res)
        if (res.status) {
          console.log("res.status", res.data.name)
          // localStorage.setItem("role", res.data.id_position)
          // localStorage.setItem("username", res.data.TaiKhoan)
          // localStorage.setItem("name", res.data.name)
          // localStorage.setItem("token", res.data.access_token)
          // localStorage.setItem("refresh_token", res.data.refresh_token)
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("token", "ok");
          navigate(RouterLinks.HOME_PAGE);
    // navigate(RouterLinks.KIEM_TRA_WEBSITE)
        } else {
          message.error(res.message)
        }
      } catch (err) {
        console.log(err);
        message.error("Đăng nhập thất bại")
      }
  };

  return (
    <div className="login">
      {contextHolder}
      <Row>
        <Col span={16}>
          <img
            src={loginBack}
            className="login-background"
            alt="htht"
            style={{ width: "90%" }}
          />
        </Col>
        <Col
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          span={8}
        >
          {/* <img src={Logo} className="logo-login" alt="htht" height={200} /> */}
          <div
            style={{
              fontSize: "25px",
              marginBottom: "1px",
              fontWeight: "600",
              fontFamily: "cursive",
            }}
          >
            Hệ thống thu thập thông tin các Ngân hàng tại Việt Nam
          </div>
          <div style={{ margin: "30px", width: "75%" }}>
            <Form onFinish={onFinish} form={form} layout="vertical">
              <Form.Item
                style={{ marginBottom: "7px" }}
                label="Tên đăng nhập"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Tên đăng nhập không được bỏ trống",
                  },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        const regex = /^\s*$/;
                        if (regex.test(value)) {
                          throw new Error("Tên bài không hợp lệ !");
                        }
                      }
                    },
                  },
                ]}
              >
                <Input placeholder="Tên đăng nhập" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Mât khảu không được bỏ trống",
                  },
                ]}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  htmlType="submit"
                  type="primary"
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
