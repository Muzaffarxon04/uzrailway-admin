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
import DeleteConfirmModal from "../../components/modals/deleteConfirm";

// Mock data for flights (trains)
const mockFlights = [
  {
    id: 1,
    flight_number: "RE-001",
    route: "Toshkent - Samarqand",
    departure_time: "08:00",
    arrival_time: "12:30",
    train_type: "Yuk poyezdi",
    status: "active",
    locomotive_number: "L-1234",
    driver: "Abdullayev Akmal Toshmatovich",
    cargo_weight: "500 tonna",
    date: "2024-01-15",
  },
  {
    id: 2,
    flight_number: "RE-002",
    route: "Samarqand - Buxoro",
    departure_time: "14:00",
    arrival_time: "18:45",
    train_type: "Yo'lovchi poyezdi",
    status: "active",
    locomotive_number: "L-1235",
    driver: "Yuldasheva Madina Azizovna",
    cargo_weight: "0 tonna",
    date: "2024-01-15",
  },
  {
    id: 3,
    flight_number: "RE-003",
    route: "Toshkent - Andijon",
    departure_time: "06:30",
    arrival_time: "14:20",
    train_type: "Yuk poyezdi",
    status: "completed",
    locomotive_number: "L-1236",
    driver: "Toshmatov Bahodir Alimovich",
    cargo_weight: "750 tonna",
    date: "2024-01-14",
  },
  {
    id: 4,
    flight_number: "RE-004",
    route: "Buxoro - Urganch",
    departure_time: "10:15",
    arrival_time: "16:00",
    train_type: "Yuk poyezdi",
    status: "delayed",
    locomotive_number: "L-1237",
    driver: "Ismoilov Farrux Bahodirovich",
    cargo_weight: "600 tonna",
    date: "2024-01-15",
  },
  {
    id: 5,
    flight_number: "RE-005",
    route: "Andijon - Farg'ona",
    departure_time: "09:00",
    arrival_time: "11:30",
    train_type: "Yo'lovchi poyezdi",
    status: "active",
    locomotive_number: "L-1238",
    driver: "Karimova Dilshoda Rustamovna",
    cargo_weight: "0 tonna",
    date: "2024-01-15",
  },
  {
    id: 6,
    flight_number: "RE-006",
    route: "Toshkent - Qarshi",
    departure_time: "20:00",
    arrival_time: "02:30",
    train_type: "Yuk poyezdi",
    status: "active",
    locomotive_number: "L-1239",
    driver: "Rahimov Otabek Shavkatovich",
    cargo_weight: "800 tonna",
    date: "2024-01-15",
  },
  {
    id: 7,
    flight_number: "RE-007",
    route: "Navoiy - Toshkent",
    departure_time: "12:00",
    arrival_time: "18:45",
    train_type: "Yuk poyezdi",
    status: "completed",
    locomotive_number: "L-1240",
    driver: "Sattorova Nigora Turgunovna",
    cargo_weight: "450 tonna",
    date: "2024-01-14",
  },
  {
    id: 8,
    flight_number: "RE-008",
    route: "Toshkent - Termiz",
    departure_time: "16:00",
    arrival_time: "06:00",
    train_type: "Yo'lovchi poyezdi",
    status: "active",
    locomotive_number: "L-1241",
    driver: "Abdullayev Akmal Toshmatovich",
    cargo_weight: "0 tonna",
    date: "2024-01-15",
  },
];

function Flights() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 10;
  const searchValue = searchParams.get("search") || "";

  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: mockFlights.length,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);
  const [flights, setFlights] = useState(mockFlights);

  // Filter flights based on search
  const filteredFlights = flights.filter((flight) =>
    flight.flight_number.toLowerCase().includes(searchValue.toLowerCase()) ||
    flight.route.toLowerCase().includes(searchValue.toLowerCase()) ||
    flight.driver.toLowerCase().includes(searchValue.toLowerCase()) ||
    flight.locomotive_number.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDelete = () => {
    if (currentFlight) {
      setFlights(flights.filter((flight) => flight.id !== currentFlight));
      setModalVisible(false);
      setCurrentFlight(null);
    }
  };

  // Paginate filtered results
  const paginatedFlights = filteredFlights.slice(
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "delayed":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Faol";
      case "completed":
        return "Yakunlangan";
      case "delayed":
        return "Kechikkan";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "Reys raqami",
      dataIndex: "flight_number",
      width: 120,
      render: (_, record) => (
        <span className="table_flight_number">
          <p style={{ fontWeight: 600 }}>{record?.flight_number}</p>
        </span>
      ),
    },
    {
      title: "Marshrut",
      dataIndex: "route",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_route">
          <Popover placement="bottom" content={record?.route}>
            <p>{record?.route}</p>
          </Popover>
        </span>
      ),
    },
    {
      title: "Poyezd turi",
      dataIndex: "train_type",
      width: 150,
      render: (_, record) => (
        <span className="table_train_type">
          <p>{record?.train_type}</p>
        </span>
      ),
    },
    {
      title: "Ketish vaqti",
      dataIndex: "departure_time",
      width: 120,
      render: (_, record) => (
        <span className="table_departure">
          <p>{record?.departure_time}</p>
        </span>
      ),
    },
    {
      title: "Kelish vaqti",
      dataIndex: "arrival_time",
      width: 120,
      render: (_, record) => (
        <span className="table_arrival">
          <p>{record?.arrival_time}</p>
        </span>
      ),
    },
    {
      title: "Lokomotiv raqami",
      dataIndex: "locomotive_number",
      width: 150,
      render: (_, record) => (
        <span className="table_locomotive">
          <p>{record?.locomotive_number}</p>
        </span>
      ),
    },
    {
      title: "Haydovchi",
      dataIndex: "driver",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_driver">
          <Popover placement="bottom" content={record?.driver}>
            <p>{record?.driver}</p>
          </Popover>
        </span>
      ),
    },
    {
      title: "Yuk og'irligi",
      dataIndex: "cargo_weight",
      width: 120,
      render: (_, record) => (
        <span className="table_cargo">
          <p>{record?.cargo_weight}</p>
        </span>
      ),
    },
    {
      title: "Holat",
      dataIndex: "status",
      width: 120,
      render: (_, record) => (
        <span className="table_status">
          <Tag color={getStatusColor(record?.status)}>
            {getStatusText(record?.status)}
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
              navigate(`/flights/${record.id}`);
            }}
          />
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(true);
              setCurrentFlight(record.id);
            }}
          />
        </span>
      ),
    },
  ];

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize, total: filteredFlights.length });
    handleTableChange({ current: page, pageSize });
  };

  return (
    <section className="page partners">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Reyslar</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Reyslar ro'yxati",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Link to="/flights/add">
              <Button type="primary">Reys qo'shish</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
            <Input
              placeholder="Reys raqami, marshrut yoki haydovchi bo'yicha qidirish"
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
            dataSource={paginatedFlights.map((item) => ({
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
          total={filteredFlights.length}
          showSizeChanger
          onChange={handlePaginationChange}
          style={{ marginTop: 20, textAlign: "center" }}
          locale={{ items_per_page: `/ sahifa` }}
        />
        <DeleteConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleDelete}
          title="Reysni o'chirish?"
          message="Bu reysni o'chirmoqchimisiz?"
          dangerMessage="Barcha reys ma'lumotlari qayta tiklanmaydi."
        />
      </div>
    </section>
  );
}

export default Flights;

