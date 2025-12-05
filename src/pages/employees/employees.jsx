import { useState } from "react";
import {
  Input,
  Button,
  Table,
  Pagination,
  Breadcrumb,
  Popover,
  Tag,
} from "antd";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import { useLocalization } from "../../LocalizationContext";
import DeleteConfirmModal from "../../components/modals/deleteConfirm";

// Mock data for employees
const mockEmployees = [
  {
    id: 1,
    full_name: "Abdullayev Akmal Toshmatovich",
    phone_number: "+998901234567",
    role: "Lokomotiv haydovchisi",
    username: "akmal.abdullayev",
    status: "active",
    department: "Yuk tashish bo'limi",
    experience: "5 yil",
  },
  {
    id: 2,
    full_name: "Karimova Dilshoda Rustamovna",
    phone_number: "+998901234568",
    role: "Dispetcher",
    username: "dilshoda.karimova",
    status: "active",
    department: "Operatsion bo'lim",
    experience: "3 yil",
  },
  {
    id: 3,
    full_name: "Toshmatov Bahodir Alimovich",
    phone_number: "+998901234569",
    role: "Yoqilg'i operatori",
    username: "bahodir.toshmatov",
    status: "active",
    department: "Yoqilg'i xizmati",
    experience: "7 yil",
  },
  {
    id: 4,
    full_name: "Nazarova Gulnoza Farhodovna",
    phone_number: "+998901234570",
    role: "Kassir",
    username: "gulnoza.nazarova",
    status: "active",
    department: "Kassa bo'limi",
    experience: "2 yil",
  },
  {
    id: 5,
    full_name: "Rahimov Otabek Shavkatovich",
    phone_number: "+998901234571",
    role: "Texnik xodim",
    username: "otabek.rahimov",
    status: "inactive",
    department: "Texnik xizmat",
    experience: "4 yil",
  },
  {
    id: 6,
    full_name: "Yuldasheva Madina Azizovna",
    phone_number: "+998901234572",
    role: "Lokomotiv haydovchisi",
    username: "madina.yuldasheva",
    status: "active",
    department: "Yuk tashish bo'limi",
    experience: "6 yil",
  },
  {
    id: 7,
    full_name: "Ismoilov Farrux Bahodirovich",
    phone_number: "+998901234573",
    role: "Dispetcher",
    username: "farrux.ismoilov",
    status: "active",
    department: "Operatsion bo'lim",
    experience: "8 yil",
  },
  {
    id: 8,
    full_name: "Sattorova Nigora Turgunovna",
    phone_number: "+998901234574",
    role: "Yoqilg'i operatori",
    username: "nigora.sattorova",
    status: "active",
    department: "Yoqilg'i xizmati",
    experience: "5 yil",
  },
];

function Employees() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLocalization();
  
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 10;
  const searchValue = searchParams.get("search") || "";

  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: mockEmployees.length,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [employees, setEmployees] = useState(mockEmployees);

  // Filter employees based on search
  const filteredEmployees = employees.filter((employee) =>
    employee.full_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    employee.phone_number.includes(searchValue) ||
    employee.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDelete = () => {
    if (currentEmployee) {
      setEmployees(employees.filter((emp) => emp.id !== currentEmployee));
      setModalVisible(false);
      setCurrentEmployee(null);
    }
  };

  // Paginate filtered results
  const paginatedEmployees = filteredEmployees.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));

    setSearchParams({
      page: pagination.current,
      pageSize: pagination.pageSize,
      search: searchValue || "",
    });
  };

  const onSearch = (value) => {
    setPagination((prev) => ({ ...prev, current: 1 }));

    setSearchParams({
      page: 1,
      pageSize: pagination.pageSize,
      search: value.trim() || "",
    });
  };

  const columns = [
    {
      title: "To'liq ism",
      dataIndex: "full_name",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <Popover placement="bottom" content={record?.full_name}>
            <p>{record?.full_name}</p>
          </Popover>
        </span>
      ),
    },
    {
      title: "Telefon raqami",
      dataIndex: "phone_number",
      width: 150,
      render: (_, record) => (
        <span className="table_phone_number">
          <a href={`tel:${record?.phone_number}`}>{record?.phone_number}</a>
        </span>
      ),
    },
    {
      title: "Lavozim",
      dataIndex: "role",
      width: 180,
      render: (_, record) => (
        <span className="table_role">
          <p>{record?.role}</p>
        </span>
      ),
    },
    {
      title: "Bo'lim",
      dataIndex: "department",
      width: 180,
      render: (_, record) => (
        <span className="table_department">
          <p>{record?.department}</p>
        </span>
      ),
    },
    {
      title: "Tajriba",
      dataIndex: "experience",
      width: 120,
      render: (_, record) => (
        <span className="table_experience">
          <p>{record?.experience}</p>
        </span>
      ),
    },
    {
      title: "Holat",
      dataIndex: "status",
      width: 120,
      render: (_, record) => (
        <span className="table_status">
          <Tag color={record?.status === "active" ? "green" : "default"}>
            {record?.status === "active" ? "Faol" : "Nofaol"}
          </Tag>
        </span>
      ),
    },
    {
      title: "Amal",
      dataIndex: "action",
      width: 100,
      render: (_, record) => (
        <span className="action_wrapper">
          <Icon
            icon="ic_edit"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/employees/${record.id}`);
            }}
          />
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(true);
              setCurrentEmployee(record.id);
            }}
          />
        </span>
      ),
    },
  ];

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize, total: filteredEmployees.length });
    handleTableChange({ current: page, pageSize });
  };

  return (
    <section className="page partners">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Xodimlar</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Xodimlar ro'yxati",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Link to="/employees/add">
              <Button type="primary">Xodim qo'shish</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
            <Input
              placeholder="Ism bo'yicha qidirish"
              allowClear
              size="large"
              onSearch={onSearch}
              prefix={<Icon className="icon icon_prefix" icon="ic_search" />}
              onChange={(e) => {
                setPagination((prev) => ({ ...prev, current: 1 }));
                setSearchParams({
                  page: 1,
                  pageSize: pagination.pageSize,
                  search: e.target.value || "",
                });
              }}
            />
          </div>
        </div>
        <div className="table_wrapper">
          <Table
            columns={columns}
            dataSource={paginatedEmployees.map((item) => ({
              ...item,
              key: item?.id,
            }))}
            pagination={false}
            onChange={handleTableChange}
          />
        </div>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={filteredEmployees.length}
          showSizeChanger
          onChange={handlePaginationChange}
          style={{ marginTop: 20, textAlign: "center" }}
          locale={{ items_per_page: `/ sahifa` }}
        />
        <DeleteConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleDelete}
          title="Xodimni o'chirish?"
          message="Bu xodimni o'chirmoqchimisiz?"
          dangerMessage="Barcha xodim ma'lumotlari qayta tiklanmaydi."
        />
      </div>
    </section>
  );
}

export default Employees;

