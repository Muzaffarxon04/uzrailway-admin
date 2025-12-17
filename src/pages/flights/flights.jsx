import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Pagination,
  Breadcrumb,
  Tag,
} from "antd";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import useUniversalFetch from "../../Hooks/useApi";
import DeleteConfirmModal from "../../components/modals/deleteConfirm";
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
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
  const pageSize = parseInt(searchParams.get("pageSize")) || 50;
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
      "trips",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `trips/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allFlights = fetchedFlightsData?.data || [];

  const {
    data: flightDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: flightDelete,
    isPending: isFlightDeleteLoading,
    error: flightDeleteError,
    isError: isFlightDeleteError,
  } = useDeleteMutation({
    url: `trips/`,
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
        total: fetchedFlightsData?.total_elements || fetchedFlightsData?.total || 0,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "active":
  //       return "green";
  //     case "completed":
  //       return "blue";
  //     case "delayed":
  //       return "orange";
  //     default:
  //       return "default";
  //   }
  // };

  // const getStatusText = (status) => {
  //   switch (status) {
  //     case "active":
  //       return "Faol";
  //     case "completed":
  //       return "Yakunlangan";
  //     case "delayed":
  //       return "Kechikkan";
  //     default:
  //       return status;
  //   }
  // };

  const getStationLabel = (station) => {
    if (!station) return "-";
    if (typeof station === "object") {
      return station.name || station.address || `ID: ${station.id ?? "-"}`;
    }
    return station;
  };

  const getTrainLead = (assignedEmployees) => {
    if (!Array.isArray(assignedEmployees) || assignedEmployees.length === 0) return "-";
    const lead = assignedEmployees.find(emp => 
      emp.role === "driver" || emp.role === "senior_conductor"
    );
    if (lead) {
      const name = `${lead.firstName || ""} ${lead.lastName || ""}`.trim();
      return name || "-";
    }
    return "-";
  };

  // Transform data - har bir trip uchun, har bir vagon kuzatuvchisi uchun alohida qator
  const transformedData = allFlights.flatMap((trip, tripIndex) => {
    const employees = Array.isArray(trip?.assigned_employees) ? trip.assigned_employees : [];
    const wagonAttendants = employees.filter(emp => 
      emp.role !== "driver" && emp.role !== "senior_conductor"
    );

    // Trip asosiy qatori
    const tripRow = {
      ...trip,
      key: `trip-${trip.id}`,
      tripIndex: tripIndex + 1,
      isTripRow: true,
      wagonAttendants,
      wagonAttendantsCount: wagonAttendants.length,
    };

    // Agar vagon kuzatuvchilari bo'lsa, har biri uchun alohida qator
    if (wagonAttendants.length > 0) {
      const employeeRows = wagonAttendants.map((emp, empIndex) => ({
        ...trip,
        ...emp,
        key: `trip-${trip.id}-emp-${emp.id || empIndex}`,
        isTripRow: false,
        tripIndex: null,
        employeeName: `${emp?.firstName || ""} ${emp?.lastName || ""}`.trim(),
        parentTripId: trip.id,
      }));
      return [tripRow, ...employeeRows];
    }

    return [tripRow];
  });

  const columns = [
    {
      title: "№",
      dataIndex: "tripIndex",
      width: 60,
      render: (tripIndex, record) => {
        if (record.isTripRow && tripIndex) {
          const pageIndex = (pagination.current - 1) * pagination.pageSize + tripIndex;
          return (
            <span className="table_number">
              {pageIndex}
            </span>
          );
        }
        return null;
      },
    },
    {
      title: "Кетиш вақти",
      dataIndex: "scheduled_departure",
      width: 160,
      render: (_, record) => {
        if (record.isTripRow) {
          return (
            <span className="table_departure">
              {record?.scheduled_departure ? dayjs(record.scheduled_departure).format("DD.MM.YYYY HH:mm") : "-"}
            </span>
          );
        }
        return null;
      },
    },
    {
      title: "Поезд рақами",
      dataIndex: "train",
      width: 130,
      render: (_, record) => {
        if (record.isTripRow) {
          return (
            <span className="table_flight_number">
              {record?.train?.train_number || "-"}
            </span>
          );
        }
        return null;
      },
    },
    {
      title: "Жўнаш станцияси",
      dataIndex: "departure_station",
      width: 180,
      render: (_, record) => {
        if (record.isTripRow) {
          return (
            <span className="table_route">
              {getStationLabel(record?.departure_station)}
            </span>
          );
        }
        return null;
      },
    },
    {
      title: "Вагон кузатувчиси",
      dataIndex: "employeeName",
      minWidth: 200,
      render: (_, record) => {
        if (record.isTripRow) {
          return (
            <span className="table_name">
              {record.wagonAttendantsCount > 0 ? `${record.wagonAttendantsCount} ta` : "-"}
            </span>
          );
        }
        // Employee qatori uchun
        return (
          <span className="table_name">
            {record.employeeName || "-"}
          </span>
        );
      },
    },
    {
      title: "Етиб бориш станцияси",
      dataIndex: "arrival_station",
      width: 180,
      render: (_, record) => (
        <span className="table_route">
          {getStationLabel(record?.arrival_station)}
        </span>
      ),
    },
    {
      title: "Етиб бориш вақти.",
      dataIndex: "scheduled_arrival",
      width: 160,
      render: (_, record) => (
        <span className="table_arrival">
          {record?.scheduled_arrival ? dayjs(record.scheduled_arrival).format("DD.MM.YYYY HH:mm") : "-"}
        </span>
      ),
    },
    {
      title: "Тасдиқлаш.",
      dataIndex: "attendance",
      width: 100,
      render: (_, record) => {
        if (record.isTripRow) {
          const attendants = record?.wagonAttendants || [];
          const confirmedCount = attendants.filter(emp => {
            const attendance = emp?.attendance;
            return attendance && attendance.status === "present";
          }).length;
          const totalCount = attendants.length;
          if (totalCount === 0) return "-";
          return (
            <span>
              {confirmedCount}/{totalCount}
            </span>
          );
        }
        // Employee qatori uchun
        const attendance = record?.attendance;
        if (!attendance) {
          return <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />;
        }
        const isConfirmed = attendance.status === "present";
        return isConfirmed ? (
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 18 }} />
        ) : (
          <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      width: 120,
      align: "right",
      render: (_, record) => (
        <span className="action_wrapper">
          <Icon
            icon="ic_statistics"
            className="icon info"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/flights/statistics/${record.id}`);
            }}
            title="Statistika"
          />
          <Icon
            icon="ic_edit"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/flights/${record.id}`);
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
    <section className="page partners flights">
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
              placeholder="Reys raqami yoki poyezd raqami bo'yicha qidirish"
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
            dataSource={transformedData}
            loading={isFlightsLoading ? customLoader : false}
            pagination={false}
            onChange={handleTableChange}
            scroll={{ y: 'calc(100vh - 300px)', x: 'max-content' }}
            onRow={(record) => ({
              onClick: () => {
                navigate(`/flights/detail/${record.id}`);
              },
              style: { 
                cursor: "pointer",
              },
            })}
          />
        </div>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100', '200']}
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
