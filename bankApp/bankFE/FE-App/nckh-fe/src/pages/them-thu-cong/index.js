import { Table, Input, Card, Modal, Button, Popconfirm, Breadcrumb, Form, Select } from "antd"
import { useState, Fragment, useEffect, useRef } from "react"
import {
    Label,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"
import { Plus, X } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import Swal from "sweetalert2"
import {getPromotion, createPromotion, deletePromotion, updatePromotion } from "../../utils/services/promotion"
import {productServices} from "../../utils/services/productServices"
import withReactContent from "sweetalert2-react-content"

// import { AbilityContext } from '@src/utility/context/Can'



const Promotion = () => {
    // const ability = useContext(AbilityContext)
    const [form] = Form.useForm()

    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [idEdit, setIdEdit] = useState()

    const [product, setProduct] = useState([])

    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [action, setAction] = useState('Add')

    const [search, setSearch] = useState("")
    const [isAdd, setIsAdd] = useState(false)

    const getData = () => {
        getPromotion({
            params: {
                page: currentPage,
                limit: rowsPerPage,
                ...(search && search !== "" && { search }),
            },
        })
            .then((res) => {
                setData(res)
                console.log("data",res)
                setCount(res.count)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getProduct = () => {
      productServices.get({
        params: {
            page: currentPage,
            limit: rowsPerPage,
            ...(search && search !== "" && { search }),
        },
    })
      .then(res => {
        const data = res.map((item) => {
          return {
            value: item.name,
            label: item.name
          }
        })
        setProduct(data)
      })
      .catch((err) => {
        console.log(err)
      })
    }
    useEffect(() => {
        getData()
        getProduct()
    }, [currentPage, rowsPerPage, search])


    const handleModal = () => {
        setIsAdd(false)
        // setIsEdit(false)
    }
    const handleEdit = (record) => {
        form.setFieldsValue({
            name: record.name,
            id_product: record.id_product,
        })
        setAction('Edit')
        setIsAdd(true)
        setIdEdit(record.id)
    }
    const onReset = () => {
        form.resetFields()
        handleModal()
    }
    const onFinish = (values) => {
        if (action === 'Add') {
            createPromotion({
                name: values.name,
            })
                .then((res) => {
                    MySwal.fire({
                        title: "Thêm mới thành công",
                        text: "Yêu cầu đã được phê duyệt!",
                        icon: "success",
                        customClass: {
                            confirmButton: "btn btn-success",
                        },
                    }).then((result) => {
                        getData()
                        form.resetFields()
                        handleModal()
                    })
                })
                .catch((err) => {
                    MySwal.fire({
                        title: "Thêm mới thất bại",
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                    })
                })
        } else {
            updatePromotion(idEdit, values)
                .then((res) => {
                    MySwal.fire({
                        title: "Chỉnh sửa thành công",
                        text: "Yêu cầu đã được phê duyệt!",
                        icon: "success",
                        customClass: {
                            confirmButton: "btn btn-success",
                        },
                    }).then((result) => {
                        handleModal()
                        getData()
                        form.resetFields()
                    })
                })
                .catch((err) => {
                    MySwal.fire({
                        title: "Chỉnh sửa thất bại",
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                    })
                })
        }

    }
    const callEdit = (data) => {
        const dataSubmit = {
            ...selected.current,
            ...data,
        }
    }

   
    const handleDelete = (key) => {
        deletePromotion(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa khuyến mãi thành công",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                }).then((result) => {
                    if (currentPage === 1) {
                        getData(1, rowsPerPage)
                    } else {
                        setCurrentPage(1)
                    }
                })
            })
            .catch((error) => {
                MySwal.fire({
                    title: "Xóa khuyến mãi thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
    }
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 30,
            align: "center",
            render: (text, record, index) => (
                <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
            ),
        },
        {
            title: "Tên ngân hàng",
            dataIndex: "branch_name",
        },
        // {
        //     title: "Sản phẩm áp dụng",
        //     dataIndex: "id_product",
        //     render: (text, record, index) => {
        //       const matchedSchoolYear = product.find(item => item.value === record.id_product)
        //       return (
        //           <span>{`${matchedSchoolYear?.label ? matchedSchoolYear.label : ""}`}</span>
        //       )
        //   }
        // },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            width: "30%",
            align: "center",
        },
        {
            title: "Tên ngân hàng",
            dataIndex: "name",
            width: "30%",
            align: "center",
        },
        {
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (record) => (
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    {
                        <>
                            <EditOutlined
                                id={`tooltip_edit${record.ID}`}
                                style={{ color: "#036CBF", cursor: 'pointer' }}
                                onClick={(e) => handleEdit(record)}
                            />
                            <UncontrolledTooltip placement="top" target={`tooltip_edit${record.ID}`}>
                                Chỉnh sửa
                            </UncontrolledTooltip></>

                    }
                    {
                        <Popconfirm
                        title="Bạn chắc chắn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        cancelText="Hủy"
                        okText="Đồng ý"
                    >
                        <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} id={`tooltip_delete${record.ID}`} />
                        <UncontrolledTooltip placement="top" target={`tooltip_delete${record.ID}`}>
                            Xóa
                        </UncontrolledTooltip>
                    </Popconfirm>

                    }

                </div>
            ),
        },
    ]
    const showTotal = (count) => `Tổng số: ${count}`

    return (
        <Card
           
        >
          <Breadcrumb
                style={{ margin: "auto",marginBottom:"14px", marginLeft: 0 }}
                items={[
                    {
                        title: (
                            <span style={{ fontWeight: "bold" }}>Danh sách các ngân hàng</span>
                        ),
                    },
                ]}
            />
            <Row style={{ justifyContent: "space-between", display: "flex", marginBottom:'10px' }}>
                <Col sm="4" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Label
                        className=""
                        style={{
                            width: "100px",
                            fontSize: "14px",
                            height: "35px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        Tìm kiếm
                    </Label>
                    <Input
                        type="text"
                        placeholder="Tìm kiếm"
                        style={{ height: "35px" }}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setSearch("")
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                setSearch(e.target.value)
                                setCurrentPage(1)
                            }
                        }}
                    />
                </Col>
                <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
                    {
                        //  <Button
                        //     onClick={(e) => {
                        //     setAction('Add')
                        //     setIsAdd(true)
                         
                        // }}

                        //     type="primary"
                        // >
                        //     Thêm mới
                        // </Button>
                    }

                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={data}
                bordered
                pagination={{
                  current: currentPage,
                  pageSize: rowsPerPage,
                  defaultPageSize: rowsPerPage,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30", '100'],
                  total: count,
                  locale: { items_per_page: "/ trang" },
                  showTotal: (total, range) => <span>Tổng số: {total}</span>,
                  onShowSizeChange: (current, pageSize) => {
                      setCurrentPage(current)
                      setRowsPerpage(pageSize)
                  },
                  onChange: (pageNumber) => {
                      setCurrentPage(pageNumber)
                  }
              }}
            />
            <Modal
                open={isAdd}
                toggle={handleModal}
                onCancel={onReset}
                contentClassName="pt-0"
                autoFocus={false}
                className="modal-md"
                footer={[]}
                    >
                <div
                    className=""
                    toggle={handleModal}
                    tag="div"
                >
                     <h2 className="modal-title">{
                        action === 'Add' ? "Thêm mới ngân hàng" : "Chỉnh sửa ngân hàng"
                    } </h2>
                </div>
                
                <div className="flex-grow-1">
                    <Form
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        layout="vertical"
                    ><Row>

                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="branch_name"
                                    label="Tên chi nhánh ngân hàng"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Nhập tên chi nhánh'
                                        },
                                        {
                                            validator: (rule, value) => {
                                                if (value && value.trim() === '') {
                                                    return Promise.reject('Không được nhập toàn dấu cách')
                                                }
                                                return Promise.resolve()
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder='Nhập tên chi nhánh' />
                                </Form.Item>
                            </div>
                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="id_product"
                                    label="Chọn ngân hàng"
                                    rules={[
                                      {
                                          required: true,
                                          message: 'Chọn ngân hàng'
                                      },
                                  ]}
                                >
                                     <Select allowClear 
                                         options={product} style={{width:"100%"}}  placeholder="Chọn ngân hàng"  onKeyPress={(e) => {
                                      }}
                                  ></Select> 
                                </Form.Item>

                            </div>
                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="address"
                                    label="Địa chi"
                                    rules={[
                                        {
                                            validator: (rule, value) => {
                                                if (value && value.trim() === '') {
                                                    return Promise.reject('Không hợp lệ')
                                                }
                                                return Promise.resolve()
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder='Nhập địa chỉ' type="number"/>
                                </Form.Item>
                            </div>
                            
                        </Row>
                        <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" htmlType="submit"
                                className="addBtn" style={{ marginRight: '20px', width: '94px' }}>
                                Lưu
                            </Button>
                            <Button htmlType="button"
                                className="addBtn" onClick={onReset} style={{ width: '94px' }}>
                                Hủy
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
                 </Card>
    )
}
export default Promotion 