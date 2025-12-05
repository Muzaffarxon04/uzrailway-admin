import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Pagination,
  Breadcrumb,
  Popover,
  Tag,
} from "antd";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import { BASE_URL } from "../../consts/variables";
import useUniversalFetch from "../../Hooks/useApi";
import DeleteConfirmModal from "../../components/modals/deleteConfirm";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import { useNotification } from "../../components/notification";
import dayjs from "dayjs";

function Flights() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useFetchQuery, useDeleteMutation } = useUniversalFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  
  const showNotification = useNotification();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 10;
  const searchValue = searchParams.get("search") || "";
  const { t } = useLocalization();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedFlightsData,
    isPending: isFlightsLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "train-schedule",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `${BASE_URL}/train-schedule`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      search: searchValue,
    },
    token: accessToken,
  });

  const allFlights = fetchedFlightsData?.data?.data || fetchedFlightsData?.data || fetchedFlightsData || [];

  const {
    data: flightDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: flightDelete,
    isPending: isFlightDeleteLoading,
    error: flightDeleteError,
    isError: isFlightDeleteError,
  } = useDeleteMutation({
    url: `${BASE_URL}/train-schedule`,
    method: "DELETE",
    token: accessToken,
  });

  const handleDelete = () => {
    flightDelete({
      id: currentFlight,
    });
  };

  useEffect(() => {
    if (location.pathname) {
      refetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (isSuccessDeleted) {
      refetchData();
      showNotification(
        "success",
        t("messages").delete_success,
        flightDeleteData?.message || t("messages").success
      );
      setCurrentFlight(null);
      setModalVisible(false);
    } else if (isFlightDeleteError) {
      showNotification(
        "error",
        t("messages").error_2,
        flightDeleteError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, flightDeleteError, isFlightDeleteError]);

  useEffect(() => {
    if (fetchedFlightsData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedFlightsData?.total || fetchedFlightsData?.data?.total || fetchedFlightsData?.data?.length || fetchedFlightsData?.length || 0,
      }));
    }
  }, [fetchedFlightsData]);

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
      title: "ID",
      dataIndex: "id",
      width: 80,
      render: (_, record) => (
        <span className="table_id">
          <p>#{record?.id}</p>
        </span>
      ),
    },
    {
      title: "Poyezd raqami",
      dataIndex: "trainNumber",
      width: 150,
      render: (_, record) => (
        <span className="table_flight_number">
          <p>{record?.trainNumber}</p>
        </span>
      ),
    },
    {
      title: "Ketish stansiyasi",
      dataIndex: "departureStation",
      minWidth: 180,
      render: (_, record) => (
        <span className="table_route">
          <p>{record?.departureStation?.name || `ID: ${record?.departureStationId}`}</p>
        </span>
      ),
    },
    {
      title: "Kelish stansiyasi",
      dataIndex: "arrivalStation",
      minWidth: 180,
      render: (_, record) => (
        <span className="table_route">
          <p>{record?.arrivalStation?.name || `ID: ${record?.arrivalStationId}`}</p>
        </span>
      ),
    },
    {
      title: "Ketish vaqti",
      dataIndex: "departureTime",
      width: 120,
      render: (_, record) => (
        <span className="table_departure">
          <p>{record?.departureTime}</p>
        </span>
      ),
    },
    {
      title: "Kelish vaqti",
      dataIndex: "arrivalTime",
      width: 120,
      render: (_, record) => (
        <span className="table_arrival">
          <p>{record?.arrivalTime}</p>
        </span>
      ),
    },
    {
      title: "Ketish sanasi",
      dataIndex: "departureDate",
      width: 150,
      render: (_, record) => (
        <span className="table_departure">
          <p>{record?.departureDate ? dayjs(record.departureDate).format("DD.MM.YYYY") : "-"}</p>
        </span>
      ),
    },
    {
      title: "Kelish sanasi",
      dataIndex: "arrivalDate",
      width: 150,
      render: (_, record) => (
        <span className="table_arrival">
          <p>{record?.arrivalDate ? dayjs(record.arrivalDate).format("DD.MM.YYYY") : "-"}</p>
        </span>
      ),
    },
    {
      title: "Xodimlar soni",
      dataIndex: "staff",
      width: 120,
      render: (_, record) => (
        <span className="table_staff">
          <p>{record?.staff?.length || 0}</p>
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      width: 80,
      align: "right",
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

  const customLoader = {
    spinning: true,
    indicator: <LoadingOutlined style={{ fontSize: 40 }} spin />,
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
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
              placeholder="Poyezd raqami bo'yicha qidirish"
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
            dataSource={Array.isArray(allFlights) ? allFlights.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isFlightsLoading ? customLoader : false}
            pagination={false}
            onChange={handleTableChange}
            onRow={(record) => ({
              onClick: () => navigate(`/flights/detail/${record.id}`),
              style: { cursor: "pointer" },
            })}
          />
        </div>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          onChange={handlePaginationChange}
          style={{ marginTop: 20, textAlign: "center" }}
          locale={{ items_per_page: `/ ${t("Common").page}` }}
        />
        <DeleteConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          isLoading={isFlightDeleteLoading}
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
