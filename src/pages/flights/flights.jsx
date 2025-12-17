import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Pagination,
  Breadcrumb,
  // Tag,
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
        const attendants = record?.wagonAttendants || [];
        const minItemHeight = 50;
        const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
        return (
          <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', alignItems: 'center' }}>
          <span className="table_number">
            {pageIndex}
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
        const attendants = record?.wagonAttendants || [];
        const minItemHeight = 50;
        const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
        return (
          <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', alignItems: 'center' }}>
            <span className="table_departure">
              {record?.scheduled_departure ? dayjs(record.scheduled_departure).format("DD.MM.YYYY HH:mm") : "-"}
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
        const attendants = record?.wagonAttendants || [];
        const minItemHeight = 50;
        const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
        return (
          <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', alignItems: 'center' }}>
        <span className="table_flight_number">
          {record?.train?.train_number || "-"}
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
        const attendants = record?.wagonAttendants || [];
        const minItemHeight = 50;
        const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
        return (
          <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', alignItems: 'center' }}>
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
        const attendants = record?.wagonAttendants || [];
        const minItemHeight = 50;
        const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
        const isExpanded = expandedRows.includes(record.key);
        return (
          <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="table_route">
              {record?.train_driver || "-"}
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setExpandedRows(prev => 
                  isExpanded 
                    ? prev.filter(key => key !== record.key)
                    : [...prev, record.key]
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
      title: "Вагон кузатувчиси",
      dataIndex: "wagonAttendants",
      minWidth: 200,
      render: (_, record) => {
        const attendants = record?.wagonAttendants || [];
        const minItemHeight = 50;
        const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
        const itemHeight = attendants.length > 0 ? minItemHeight : 'auto';
        
        return (
          <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', flexDirection: 'column' }}>
            {attendants.length > 0 ? (
              attendants.map((emp, idx) => {
                const name = `${emp?.firstName || ""} ${emp?.lastName || ""}`.trim();
                return (
                  <div 
                    key={emp?.id || idx}
                    style={{ 
                      minHeight: typeof itemHeight === 'number' ? `${itemHeight}px` : itemHeight,
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: idx < attendants.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <span className="table_name">{name || "-"}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', alignItems: 'center' }}>
                <span className="table_name">-</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Етиб бориш станцияси",
      dataIndex: "arrival_station",
      width: 180,
      render: (_, record) => {
        const attendants = record?.wagonAttendants || [];
        const minItemHeight = 50;
        const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
        const itemHeight = attendants.length > 0 ? minItemHeight : 'auto';
        
        return (
          <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', flexDirection: 'column' }}>
            {attendants.length > 0 ? (
              attendants.map((emp, idx) => (
                <div 
                  key={emp?.id || idx}
                  style={{ 
                    minHeight: typeof itemHeight === 'number' ? `${itemHeight}px` : itemHeight,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: idx < attendants.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}
                >
                  <span className="table_route">
                    {getStationLabel(record?.arrival_station)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', alignItems: 'center' }}>
        <span className="table_route">
          {getStationLabel(record?.arrival_station)}
        </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Етиб бориш вақти.",
      dataIndex: "scheduled_arrival",
      width: 160,
      render: (_, record) => {
        const attendants = record?.wagonAttendants || [];
        const minItemHeight = 50;
        const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
        const itemHeight = attendants.length > 0 ? minItemHeight : 'auto';
        const arrivalTime = record?.scheduled_arrival ? dayjs(record.scheduled_arrival).format("DD.MM.YYYY HH:mm") : "-";
        
        return (
          <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', flexDirection: 'column' }}>
            {attendants.length > 0 ? (
              attendants.map((emp, idx) => (
                <div 
                  key={emp?.id || idx}
                  style={{ 
                    minHeight: typeof itemHeight === 'number' ? `${itemHeight}px` : itemHeight,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: idx < attendants.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}
                >
                  <span className="table_arrival">{arrivalTime}</span>
                </div>
              ))
            ) : (
              <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', alignItems: 'center' }}>
                <span className="table_arrival">{arrivalTime}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Тасдиқлаш.",
      dataIndex: "wagonAttendants",
      width: 100,
      render: (_, record) => {
        const attendants = record?.wagonAttendants || [];
        const minItemHeight = 50;
        const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
        const itemHeight = attendants.length > 0 ? minItemHeight : 'auto';
        
        return (
          <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', flexDirection: 'column' }}>
            {attendants.length > 0 ? (
              attendants.map((emp, idx) => {
                const attendance = emp?.attendance_status;
                
            
                const isConfirmed = attendance && attendance.status === "present";
                return (
                  <div 
                    key={emp?.id || idx}
                    style={{ 
                      minHeight: typeof itemHeight === 'number' ? `${itemHeight}px` : itemHeight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: idx < attendants.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    {attendance ? (
                      isConfirmed ? (
                        <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 18 }} />
                      ) : (
                        <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />
                      )
                    ) : (
                      <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />

              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      width: 120,
      align: "right",
      render: (_, record) => {
        const attendants = record?.wagonAttendants || [];
        const minItemHeight = 50;
        const rowHeight = attendants.length > 0 ? Math.max(minItemHeight * attendants.length, minItemHeight) : 'auto';
        return (
          <div style={{ minHeight: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
    return (
      <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <strong>Reys raqami:</strong> {record?.trip_number || "-"}
          </div>
          <div>
            <strong>Reys sanasi:</strong> {record?.trip_date ? dayjs(record.trip_date).format("DD.MM.YYYY") : "-"}
          </div>
          <div>
            <strong>Poyezd nomi:</strong> {record?.train?.train_name || "-"}
          </div>
          <div>
            <strong>Poyezd turi:</strong> {record?.train?.train_type || "-"}
          </div>
          <div>
            <strong>Status:</strong> {record?.status || "-"}
          </div>
          <div>
            <strong>Faol:</strong> {record?.is_active !== undefined ? (record.is_active ? "Ha" : "Yo'q") : "-"}
          </div>
          {record?.intermediate_stations && Array.isArray(record.intermediate_stations) && record.intermediate_stations.length > 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>O'rta stansiyalar:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                {record.intermediate_stations.map((station, idx) => (
                  <li key={idx}>
                    {station?.name || "-"}
                    {station?.arrival && ` (Kelish: ${station.arrival})`}
                    {station?.departure && ` (Jo'nash: ${station.departure})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {record?.created_at && (
            <div>
              <strong>Yaratilgan vaqti:</strong> {dayjs(record.created_at).format("DD.MM.YYYY HH:mm")}
            </div>
          )}
          {record?.updated_at && (
            <div>
              <strong>Yangilangan vaqti:</strong> {dayjs(record.updated_at).format("DD.MM.YYYY HH:mm")}
            </div>
          )}
        </div>
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
                setExpandedRows(expandedKeys);
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
