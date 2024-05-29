import React, { useState } from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
interface DataType {
  url: string;
}
interface Props {
  data: any[];
  postTitle: any,
  setPostTitle: any,
  handleClickRowTable: any
}
const fakeData = [
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
  {
    url: "https://codesandbox.io/p/sandbox/basic-usage-antd-5-14-1-lsz5vv?",
  },
];
const ListPage: React.FC<Props> = (props) => {
  const { data , postTitle, setPostTitle, handleClickRowTable} = props;
  const [dataSource, setDataSource] = useState([]);
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Các mục tiêu theo dõi",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text) => (
        
        <span title={text}>
        {text ? text : "Không xác định"}
      </span>
      ),
    },
    {
      title: "Số lượng bài viết",
      dataIndex: "uv",
      key: "uv",
      align: "center",
    
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
       handleClickRowTable(selectedRows[0]?.name)
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <Table
    rowSelection={{
      type: "radio",
      ...rowSelection,
    }}
    //   onRow={(record, rowIndex) => {
    //   return {
    //     onClick: event => handleClickRowTable(record?.name), // click row
    //   };
    //  }}
      style={{ justifyContent: "left" }}
      dataSource={data.map((item: any, index: any) => {
        return {
          ...item,
          key: index
        }

      })}
      pagination={false}
      columns={columns}
    />
  );
};

export default ListPage;
