import React, { useEffect, useState } from "react";
import { Row, Col, Breadcrumb, Divider } from "antd";
import ListPage from "./components/ListPage";
import BarChar from "./components/BarChart";
import LineChar from "./components/LineChar";
import "./index.scss";
import { postServices } from "../../utils/services/postService";

import ScoreCard from './../../components/ScoreCard/ScoreCard';
import MyPieChart from "../../components/PieChart/PieChart";
import PercentAreaChart from "../../components/PercentAreaChart/PercentAreaChart";



const ThongKeTime: React.FC = () => {
  const [dataThongKe, setDataThongKe] = useState([]);
  const [dataScore, setDataScore] = useState([]);

  const getDataThongKe = () => {
    postServices
      .getcount()
      .then((res) => {
        if (Array.isArray(res.data)) {
          const temp = res.data.map((item: any) => {
            // console.log(item)
            return {
              name: item?.collection_name ,
              count: item?.count,
            };
          });
          setDataThongKe(temp);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDataThongKe();
  }, []);

  const getDataScore = () => {
    postServices
      .getscore()
      .then((res) => {
        if (Array.isArray(res.data) ) {
          setDataScore(res.data[0]); // Trả về đối tượng từ mảng đầu tiên
        }
      })
      .catch((err) => {
        console.error("Error fetching score data:", err);
        // Xử lý lỗi ở đây nếu cần
      });
  };
  console.log("Test data Score index:",dataScore);
  useEffect(() => {
    getDataScore();
  }, []);


  return (
    <div className="thong-ke-time">
      <Row>
        <Breadcrumb
          style={{ margin: "auto", marginLeft: 0 }}
          items={[
            {
              title: "Thống kê",
            },
            {
              title: <span style={{ fontWeight: "bold" }}>Thống kê</span>,
            },
          ]}
        />
        <Divider style={{ margin: "10px" }}></Divider>
      </Row>
      <Row gutter={[10, 10]}>
      <ScoreCard dataScore={dataScore} />
        <Col span={16}>
          <BarChar dataThongKe={dataThongKe} />
        </Col>
      </Row>
      <MyPieChart dataThongKe={dataThongKe}/>
      {/* <PercentAreaChart data={dataThongKe}/> */}
    </div> 
  );
  
};

export default ThongKeTime;
