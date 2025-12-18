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
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined, CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons";
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
  const [expandedRows, setExpandedRows] = useState([]);
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



  // Transform data - har bir trip uchun bitta qator, employee'lar qator ichida
  const transformedData = allFlights.map((trip, tripIndex) => {
    const employees = Array.isArray(trip?.assigned_employees) ? trip.assigned_employees : [];
    const wagonAttendants = employees.filter(emp => 
      emp.role !== "driver" && emp.role !== "senior_conductor"
    );

    return {
      ...trip,
      key: `trip-${trip.id}`,
      tripIndex: tripIndex + 1,
      wagonAttendants,
      wagonAttendantsCount: wagonAttendants.length,
    };
  });

  const columns = [
    {
      title: "№",
      dataIndex: "tripIndex",
      width: 60,
      render: (tripIndex, record) => {
        const pageIndex = (pagination.current - 1) * pagination.pageSize + tripIndex;
    
   
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="table_number">
            {pageIndex}
          </span>
          </div>
        );
      },
    },
    {
      title: "Поезд рақами",
      dataIndex: "train",
      width: 130,
      render: (_, record) => {
    
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className="table_flight_number">
          {record?.train?.train_number || "-"}
        </span>
          </div>
        );
      },
    },
    {
      title: "Кетиш вақти",
      dataIndex: "scheduled_departure",
      width: 160,
      render: (_, record) => {
 
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="table_departure">
              {record?.scheduled_departure ? dayjs(record.scheduled_departure).format("DD.MM.YYYY HH:mm") : "-"}
        </span>
          </div>
        );
      },
    },
 
    {
      title: "Жўнаш станцияси",
      dataIndex: "departure_station",
      width: 180,
      render: (_, record) => {

  
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className="table_route">
          {getStationLabel(record?.departure_station)}
        </span>
          </div>
        );
      },
    },
    {
      title: "Поезд бошлиғи",
      dataIndex: "train_driver",
      width: 180,
      render: (_, record) => {
        const seniorConductors = record?.senior_conductors || [];
        
        const isExpanded = expandedRows.includes(record.key);
        return (
          <div style={{display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <div style={{ flex: 1 }}>
              {seniorConductors.length > 0 ? (
                seniorConductors.map((emp, idx) => {
                  const name = `${emp?.firstName || ""} ${emp?.lastName || ""}`.trim();
                  return (
                    <div key={emp?.id || idx} style={{ marginBottom: idx < seniorConductors.length - 1 ? 4 : 0 }}>
                      <span className="table_route">{name || "-"}</span>
                    </div>
                  );
                })
              ) : (
                <span className="table_route">-</span>
              )}
            </div>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setExpandedRows(
                  isExpanded 
                    ? []
                    : [record.key]
                );
              }}
              style={{ 
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: 0,
                top: 0,
                width: '25px',
                height: '45px',
                padding: '12px',
                transition: 'transform 0.3s',
                flexShrink: 0,
              }}
            >
              {isExpanded ? (
                <CaretDownOutlined style={{ fontSize: 36, color: '#1890ff' }} />
              ) : (
                <CaretRightOutlined style={{ fontSize: 36, color: '#1890ff' }} />
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: "Етиб бориш станцияси",
      dataIndex: "arrival_station",
      width: 180,
      render: (_, record) => {
        return <span className="table_route">{getStationLabel(record?.arrival_station)}</span>;
      },
    },
    {
      title: "Етиб бориш вақти.",
      dataIndex: "scheduled_arrival",
      width: 160,
      render: (_, record) => {
        const arrivalTime = record?.scheduled_arrival ? dayjs(record.scheduled_arrival).format("DD.MM.YYYY HH:mm") : "-";
        return <span className="table_arrival">{arrivalTime}</span>;
      },
    },
    {
      title: "Тасдиқлаш.",
      dataIndex: "wagonAttendants",
      width: 100,
      render: (_, record) => {
        const attendants = record?.wagonAttendants || [];
        const allPresent =
          attendants.length > 0 &&
          attendants.every((emp) => emp?.attendance_status?.status === "check_out");

        const icon =
          attendants.length > 0 && allPresent ? (
            <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 18 }} />
          ) : (
            <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />
          );

        return <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>;
      },
    },
    {
      title: "",
      dataIndex: "action",
      width: 120,
      align: "right",
      render: (_, record) => {
     
        return (
          <div style={{  display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
          </div>
        );
      },
    },
  ];

  const expandedRowRender = (record) => {
    const assignedEmployees = record?.assigned_employees || [];

    return (
      <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
        {Array.isArray(assignedEmployees) && assignedEmployees.length > 0 ? (
          <div>
            <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              Tayinlangan xodimlar ({assignedEmployees.length})
            </h4>
            <Table
              dataSource={assignedEmployees.map((item, index) => ({
                ...item,
                key: item?.id || index,
              }))}
              columns={[
                {
                  title: "№",
                  dataIndex: "index",
                  width: 60,
                  render: (_, record, index) => <span>{index + 1}</span>,
                },
                {
                  title: "Ism",
                  dataIndex: "name",
                  minWidth: 200,
                  render: (_, record) => {
                    const name = `${record?.firstName || ""} ${record?.lastName || ""}`.trim();
                    return <span>{name || "-"}</span>;
                  },
                },
                {
                  title: "Lavozim ID",
                  dataIndex: "position",
                  width: 100,
                  render: (_, record) => <span>{record?.position || "-"}</span>,
                },
                {
                  title: "Kelish vaqti",
                  dataIndex: "attendance",
                  width: 170,
                  render: (_, record) => {
                    const checkInTime = record?.attendance_status?.check_in_time;
                    return checkInTime 
                      ? dayjs(checkInTime).format("DD.MM.YYYY HH:mm")
                      : "-";
                  },
                },
                {
                  title: "Ketish vaqti",
                  dataIndex: "attendance",
                  width: 170,
                  render: (_, record) => {
                    const checkOutTime = record?.attendance_status?.check_out_time;
                    return checkOutTime 
                      ? dayjs(checkOutTime).format("DD.MM.YYYY HH:mm")
                      : "-";
                  },
                },
                {
                  title: "Kelish joyi",
                  dataIndex: "attendance",
                  minWidth: 150,
                  render: (_, record) => {
                    return record?.attendance_status?.check_in_location || "-";
                  },
                },
                {
                  title: "Ketish joyi",
                  dataIndex: "attendance",
                  minWidth: 150,
                  render: (_, record) => {
                    return record?.attendance_status?.check_out_location || "-";
                  },
                },
                {
                  title: "Davomat statusi",
                  dataIndex: "attendance",
                  width: 150,
                  render: (_, record) => {
                    const attendance = record?.attendance_status;
                    if (!attendance) {
                      return <Tag color="default">Kelmadi</Tag>;
                    }
                    const statusColors = {
                      check_in: "green",
                      not_checked: "red",
                      late: "orange",
                      pending: "blue",
                      check_out: "cyan",
                    };
                    const statusLabels = {
                      check_in: "Keldi",
                      not_checked: "Kelmadi",
                      late: "Kechikdi",
                      pending: "Kutilmoqda",
                      check_out: "Ketdi",
                    };
                    return (
                      <Tag color={statusColors[attendance.status] || "default"}>
                        {statusLabels[attendance.status] || attendance.status}
                      </Tag>
                    );
                  },
                },
                {
                  title: "Kechikish",
                  dataIndex: "attendance",
                  width: 120,
                  render: (_, record) => {
                    const attendance = record?.attendance_status;
                    if (!attendance) return "-";
                    return attendance.is_late ? (
                      <div>
                        <Tag color="orange">Ha</Tag>
                        {attendance.late_duration_minutes && (
                          <div style={{ fontSize: 12, marginTop: 4 }}>
                            {attendance.late_duration_minutes} daq
                          </div>
                        )}
                      </div>
                    ) : (
                      <Tag color="green">Yo'q</Tag>
                    );
                  },
                },
              ]}
              rowKey="key"
              pagination={false}
              bordered
              scroll={{ x: "max-content" }}
              locale={{
                emptyText: "Tayinlangan xodimlar mavjud emas",
              }}
            />
          </div>
        ) : (
          <div style={{ padding: '12px', textAlign: 'center', color: '#999' }}>
            Xodim mavjud emas
          </div>
        )}
      </div>
    );
  };

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
            expandable={{
              expandedRowRender,
              expandRowByClick: false,
              expandedRowKeys: expandedRows,
              onExpandedRowsChange: (expandedKeys) => {
                // Faqat bitta qator ochilishi uchun, oxirgi ochilgan qatorni saqlash
                setExpandedRows(expandedKeys.length > 1 ? [expandedKeys[expandedKeys.length - 1]] : expandedKeys);
              },
              expandIcon: () => null,
              indentSize: 0,
            }}
            onRow={(record) => {
              const attendants = record?.wagonAttendants || [];
              const minItemHeight = 50;
              const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
              return {
              onClick: () => {
                navigate(`/flights/detail/${record.id}`);
              },
              style: { 
                cursor: "pointer",
                  minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight,
              },
              };
            }}
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
