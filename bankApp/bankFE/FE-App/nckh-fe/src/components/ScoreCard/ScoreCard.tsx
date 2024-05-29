import React from "react";
import { StatisticCard } from "@ant-design/pro-components";
import RcResizeObserver from "rc-resize-observer";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
const imgStyle = {
  display: "block",
  width: 42,
  height: 42,
};

interface Props {
  dataScore: any;
}

const ScoreCard: React.FC<Props> = ({ dataScore }) => {
  // const { total_collections, total_documents, max_collection, min_collection } = dataScore;
    const [responsive, setResponsive] = useState(false);
    const total= dataScore.total_collections
    const documents= dataScore.total_documents
    const max= dataScore.max_collection
    const min= dataScore.min_collection
    return (
        <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <StatisticCard.Group direction={responsive ? "column" : "row"}>
          <StatisticCard
            statistic={{
              title: "Số lượng ngân hàng đã thu thập",
              value: total,
              icon: (
                <img
                  style={imgStyle}
                  src="https://cdn-icons-png.freepik.com/256/8176/8176383.png?semt=ais_hybrid"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: "Tổng số dữ liệu",
              value: documents,
              icon: (
                <img
                  style={imgStyle}
                  src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: "Ngân hàng có nhiều chi nhánh nhất",
              value: max,
              icon: (
                <img
                  style={imgStyle}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_bsoNP1VDathu7ajyKinKl4ZWy-DvQ_siqY623kR87A&s"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: "Ngân hàng có ít chi nhánh nhất",
              value: min,
              icon: (
                <img
                  style={imgStyle}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThaFWy6PLrgdTuXz-nCJJ5L7uIBbQHO0jqTBUegtpQMA&s"
                  alt="icon"
                />
              ),
            }}
          />
        </StatisticCard.Group>
      </RcResizeObserver>
    );
};
export default ScoreCard;
  

  
    

