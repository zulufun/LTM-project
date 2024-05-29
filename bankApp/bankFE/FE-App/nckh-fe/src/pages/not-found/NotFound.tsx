import { Button, Result } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   // window.document.title = '404 - admin'
  // }, [window.location.pathname]);

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      style={{
        color: "#fff",
      }}
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Back Home
        </Button>
      }
    />
  );
};

export default NotFound;
