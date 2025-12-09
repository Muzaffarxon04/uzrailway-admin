import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Pagination,
  Breadcrumb,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, RightOutlined, ClockCircleOutlined } from "@ant-design/icons";
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

  const allFlightsRaw = fetchedFlightsData?.data?.data || fetchedFlightsData?.data || fetchedFlightsData || [];
  
  // Transform data to flat structure - first row with all info, subsequent rows only for supervisors
  const allFlights = Array.isArray(allFlightsRaw) ? allFlightsRaw.flatMap((flight, flightIndex) => {
    const supervisors = flight?.staff?.filter(s => s?.role === "wagon_supervisor") || [];
    
    const rows = [];
    
    // First row - main row with all columns filled
    rows.push({
      ...flight,
      key: `flight-${flight?.id}-main`,
      isFirstRow: true,
      currentSupervisor: supervisors[0] || null,
    });
    
    // Additional rows for remaining supervisors (if any)
    if (supervisors.length > 1) {
      supervisors.slice(1).forEach((supervisor, idx) => {
        rows.push({
          ...flight,
          key: `flight-${flight?.id}-supervisor-${supervisor?.id || idx + 1}`,
          isFirstRow: false,
          currentSupervisor: supervisor,
        });
      });
    } else if (supervisors.length === 0) {
      // If no supervisors, add one empty row
      rows.push({
        ...flight,
        key: `flight-${flight?.id}-empty`,
        isFirstRow: false,
        currentSupervisor: null,
      });
    }
    
    return rows;
  }) : [];

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

  const [updatingStaffId, setUpdatingStaffId] = useState(null);

  const handleDelete = () => {
    flightDelete({
      id: currentFlight,
    });
  };

  const handleUpdateStaffStatus = async (staffId, e) => {
    e.stopPropagation();
    if (!staffId) return;
    
    setUpdatingStaffId(staffId);
    
    try {
      const lang = localStorage.getItem("app-language");
      const response = await fetch(`${BASE_URL}/train-schedule/staff/${staffId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          lang: "en" || lang,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData?.error?.message ||
          responseData?.message?.message ||
          responseData?.message ||
          "An error occurred"
        );
      }

      showNotification(
        "success",
        "Muvaffaqiyatli",
        "Xodim statusi 'keldiga' o'zgartirildi"
      );
      refetchData();
    } catch (error) {
      showNotification(
        "error",
        "Xatolik",
        error?.message || "Statusni o'zgartirishda xatolik yuz berdi"
      );
    } finally {
      setUpdatingStaffId(null);
    }
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
      // Count only first rows (flights) for pagination
      const firstRowsCount = allFlightsRaw?.length || 0;
      setPagination((prev) => ({
        ...prev,
        total: fetchedFlightsData?.total || fetchedFlightsData?.data?.total || firstRowsCount || 0,
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

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      width: 60,
      render: (_, record, index) => {
        // Only show number for first row of each flight
        if (!record?.isFirstRow) return null;
        const pageIndex = (pagination.current - 1) * pagination.pageSize + 
          allFlights.filter((r, i) => i < index && r.isFirstRow).length + 1;
        return (
          <span className="table_number">
            {pageIndex}
          </span>
        );
      },
    },
    {
      title: "Кетиш вакти",
      dataIndex: "departureDate",
      width: 130,
      render: (_, record) => {
        if (!record?.isFirstRow) return null;
        return (
          <span className="table_departure">
            {record?.departureDate ? dayjs(record.departureDate).format("DD.MM.YYYY") : "-"}
          </span>
        );
      },
    },
    {
      title: "Поезд рақами",
      dataIndex: "trainNumber",
      width: 130,
      render: (_, record) => {
        if (!record?.isFirstRow) return null;
        return (
          <span className="table_flight_number">
            {record?.trainNumber || "-"}
          </span>
        );
      },
    },
    {
      title: "Жўнаш станцияси",
      dataIndex: "departureStation",
      minWidth: 180,
      render: (_, record) => {
        if (!record?.isFirstRow) return null;
        return (
          <span className="table_route">
            {record?.departureStation?.name || `ID: ${record?.departureStationId}` || "-"}
          </span>
        );
      },
    },
    {
      title: "Поезд бошлиғи",
      dataIndex: "trainChief",
      minWidth: 200,
      render: (_, record) => {
        if (!record?.isFirstRow) return null;
        const trainChief = record?.staff?.find(s => s?.role === "train_chief");
        return (
          <span className="table_train_chief">
            {trainChief ? (
              <>
                <span className="chief_name">
                  {trainChief?.employee?.fullname || `ID: ${trainChief?.employeeId}`}
                </span>
                <RightOutlined className="arrow_icon" />
              </>
            ) : (
              "-"
            )}
          </span>
        );
      },
    },
    {
      title: "Вагон кузатувчиси",
      dataIndex: "wagonSupervisors",
      minWidth: 250,
      render: (_, record) => {
        const supervisor = record?.currentSupervisor;
        if (!supervisor) return "-";
        
        const arrivalStatus = supervisor?.arrivalStatus;
        const departureStatus = supervisor?.departureStatus;
        const isConfirmed = arrivalStatus === "arrived" || departureStatus === "arrived";
        const isRejected = arrivalStatus === "rejected" || departureStatus === "rejected";
        const isLate = arrivalStatus === "late" || departureStatus === "late";
        
        return (
          <div className="table_supervisors">
            <div className="supervisor_item">
              <span className="supervisor_name">
                {supervisor?.employee?.fullname || `ID: ${supervisor?.employeeId}`}
              </span>
              {isConfirmed ? (
                <CheckCircleOutlined className="confirm_icon confirmed" />
              ) : isRejected ? (
                <CloseCircleOutlined className="confirm_icon rejected" />
              ) : isLate ? (
                <ClockCircleOutlined className="confirm_icon late" style={{ color: '#faad14' }} />
              ) : (
                <RightOutlined className="arrow_icon" />
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Етиб бориш станцияси",
      dataIndex: "arrivalStation",
      minWidth: 180,
      render: (_, record) => {
        return (
          <span className="table_route">
            {record?.arrivalStation?.name || `ID: ${record?.arrivalStationId}` || "-"}
          </span>
        );
      },
    },
    {
      title: "Етиб бориш вакти",
      dataIndex: "arrivalDate",
      width: 130,
      render: (_, record) => {
        return (
          <span className="table_arrival">
            {record?.arrivalDate ? dayjs(record.arrivalDate).format("DD.MM.YYYY") : "-"}
          </span>
        );
      },
    },
    {
      title: "Тасдиқлаш",
      dataIndex: "confirmation",
      width: 150,
      align: "center",
      render: (_, record) => {
        // Check if there's a supervisor in this row
        const supervisor = record?.currentSupervisor;
        if (!supervisor) {
          // If no supervisor, show nothing for non-first rows, but for first row show nothing too
          return null;
        }
        
        // Check arrivalStatus - if "arrived" then confirmed, if "late" then late, otherwise show button
        const arrivalStatus = supervisor?.arrivalStatus;
        const isConfirmed = arrivalStatus === "arrived";
        const isLate = arrivalStatus === "late";
        const staffId = supervisor?.id;
        
        return (
          <div className="confirmation_cell">
            {isConfirmed ? (
              <CheckCircleOutlined className="confirm_icon confirmed" style={{ fontSize: 20, color: '#52c41a' }} />
            ) : isLate ? (
              <ClockCircleOutlined className="confirm_icon late" style={{ fontSize: 20, color: '#faad14' }} />
            ) : (
              <Button
                type="primary"
                size="small"
                loading={updatingStaffId === staffId}
                onClick={(e) => handleUpdateStaffStatus(staffId, e)}
                style={{ fontSize: 12 }}
              >
                Keldiga o'tkazish
              </Button>
            )}
          </div>
        );
      },
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
            dataSource={allFlights}
            loading={isFlightsLoading ? customLoader : false}
            pagination={false}
            onChange={handleTableChange}
            scroll={{ y: 'calc(100vh - 300px)', x: 'max-content' }}
            onRow={(record) => ({
              onClick: () => {
                if (record?.isFirstRow) {
                  navigate(`/flights/detail/${record.id}`);
                }
              },
              className: !record?.isFirstRow ? "sub-row" : "",
              style: { 
                cursor: record?.isFirstRow ? "pointer" : "default",
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
