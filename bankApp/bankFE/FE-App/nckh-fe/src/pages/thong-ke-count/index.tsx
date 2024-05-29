import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  Divider,
  Button,
  Table,
  Input,
} from "antd";
import { ColumnProps } from "antd/es/table";
import { postServices } from "../../utils/services/postService";

interface DataType {}

const ThongKeCount: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [dataSource, setDataSource] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const columns: ColumnProps<DataType>[] = [
    {
      title: "TT",
      dataIndex: "ID",
      width: 20,
      align: "center",
      render: (text, record, index) => (
        <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
      ),
    },
    {
      title: "Tên Chi Nhánh",
      dataIndex: "branch_name",
      
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (text, record, index) => (
        <span>{text.length > 200 ? `${text.slice(0, 80)}...` : text}</span>
      ),
    },
  ];

  const handleCheck = () => {
    if (urlInput.trim() === "") {
      alert("Vui lòng ngân hàng cần crawl data.");
      return;
    }
    setLoading(true);
    // Xử lý giá trị nhập vào trước khi gọi API
    const normalizedInput = normalizeInput(urlInput);
    // Gửi request đến API với dữ liệu đã được xử lý
    postServices
      .get({ bank_name: normalizedInput })
      .then((res: any) => {
        if (Array.isArray(res)) {
          setDataSource(res);
          setCount(res.length);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
      console.log(dataSource)
  };
  const handleSaveToDB = () => {
    if (urlInput.trim() === "") {
      alert("Vui lòng nhập Tên ngân hàng muốn lưu.");
      return;
    }
    setLoading(true);
  
    const normalizedInput = normalizeInput(urlInput);
    postServices
      .savetodb(normalizedInput, dataSource)
      .then((res) => {
        console.log(res);
        setSuccessMessage("Đã lưu thông tin vào cơ sở dữ liệu thành công!");
        
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };


  const normalizeInput = (input: string) => {
    return input
        .toLowerCase() // Chuyển đổi chữ hoa thành chữ thường
    .replace(/\s+/g, "") // Loại bỏ khoảng trắng
    .normalize("NFD") // Chuẩn hóa Unicode, phân tách các kí tự có dấu thành kí tự gốc và dấu
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các kí tự dấu
    .replace(/đ/g, "d"); // Thay thế "đ" thành "d" (và các kí tự có dấu tương tự khác)
  };


  useEffect(() => {
    // getData();
  }, []);

  return (
    <div className="thong-ke-count">
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
        <Divider style={{ margin: "10px" }} />
      </Row>
      <Row gutter={[10, 10]}>
        <Col span={16} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "200px", fontWeight: "700" }}>Nhập tên ngân hàng</div>
          <Input
            onChange={handleInputChange}
            value={urlInput}
            placeholder="Nhập tên ngân hàng muốn tra cứu"
            onKeyPress={(e) => {
    if (e.key === "Enter") {
      handleCheck();
      handleSaveToDB();
    }
  }}
          />
          <Button onClick={handleCheck} type="primary" style={{ marginLeft: "10px" }}>
            Xem thông tin
          </Button>
          <Button onClick={handleSaveToDB} type="primary" style={{ marginLeft: "10px" }}>
            Lưu
          </Button>
        </Col>
      </Row>
      <Table
        loading={loading}
        style={{ width: "100%" }}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

export default ThongKeCount;
