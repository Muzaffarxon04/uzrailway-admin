import { useState, useEffect } from "react";
import {
  Input,
  Table,
  Pagination,
  Breadcrumb,
  Button,
  Tabs,
} from "antd";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import useUniversalFetch from "../../Hooks/useApi";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import dayjs from "dayjs";
import DeleteConfirmModal from "../../components/modals/deleteConfirm";
import { useNotification } from "../../components/notification";

function Assignments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useFetchQuery, useDeleteMutation } = useUniversalFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  const showNotification = useNotification();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 50;
  const searchValue = searchParams.get("search") || "";
  const [activeTab, setActiveTab] = useState("all");
  const { t } = useLocalization();
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  const {
    data: fetchedAssignmentsData,
    isPending: isAssignmentsLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "assignments",
      activeTab,
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: activeTab === "my" ? `assignments/my/` : `assignments/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allAssignments =
    fetchedAssignmentsData?.data ||
    (Array.isArray(fetchedAssignmentsData) ? fetchedAssignmentsData : []);

  const {
    data: assignmentDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: assignmentDelete,
    isPending: isAssignmentDeleteLoading,
    error: assignmentDeleteError,
    isError: isAssignmentDeleteError,
  } = useDeleteMutation({
    url: `assignments/delete/`,
    token: accessToken,
  });

  const handleDelete = () => {
    assignmentDelete({
      id: currentAssignment,
    });
  };

  useEffect(() => {
    if (location.pathname) {
      refetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (fetchedAssignmentsData) {
      setPagination((prev) => ({
        ...prev,
        total:
          fetchedAssignmentsData?.total_elements ||
          fetchedAssignmentsData?.total ||
          (Array.isArray(fetchedAssignmentsData)
            ? fetchedAssignmentsData.length
            : 0),
      }));
    }
  }, [fetchedAssignmentsData]);

  useEffect(() => {
    if (isSuccessDeleted) {
      refetchData();
      showNotification(
        "success",
        t("messages").delete_success,
        assignmentDeleteData?.message || t("messages").success
      );
      setCurrentAssignment(null);
      setModalVisible(false);
    } else if (isAssignmentDeleteError) {
      showNotification(
        "error",
        t("messages").error_2,
        assignmentDeleteError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, assignmentDeleteError, isAssignmentDeleteError]);

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

  const onTabChange = (key) => {
    setActiveTab(key);
    setPagination((prev) => ({ ...prev, current: 1 }));
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
      title: "Reys",
      dataIndex: "trip_number",
      minWidth: 200,
      render: (_, record) => {
        const tripNumber = record?.trip?.trip_number ?? record?.trip_number;
        const displayValue = (typeof tripNumber === 'string' || typeof tripNumber === 'number') 
          ? tripNumber 
          : "-";
        return (
        <span className="table_name">
            <p>{displayValue}</p>
        </span>
        );
      },
    },
    {
      title: "Xodim",
      minWidth: 150,
      render: (_, record) => {
        const employeeName = 
          record?.employee?.full_name ||
          record?.employee?.fullname ||
          (record?.employee?.firstName || record?.employee?.lastName
            ? `${record?.employee?.firstName || ""} ${record?.employee?.lastName || ""}`.trim()
            : null) ||
          (record?.employee?.first_name || record?.employee?.last_name
            ? `${record?.employee?.first_name || ""} ${record?.employee?.last_name || ""}`.trim()
            : null) ||
          record?.employee_name;
        const displayValue = (typeof employeeName === 'string' || typeof employeeName === 'number') 
          ? employeeName 
          : "-";
        return (
        <span className="table_name">
            <p>{displayValue}</p>
        </span>
        );
      },
    },
    {
      title: "Rol",
      dataIndex: "role",
      width: 100,
      render: (_, record) => {
        const roleLabels = {
          driver: "Haydovchi",
          assistant_driver: "Yordamchi haydovchi",
          conductor: "Konduktor",
          senior_conductor: "Katta konduktor",
          engineer: "Muhandis",
          attendant: "Kuzatuvchi",
          security: "Xavfsizlik",
        };
        const roleValue = record?.role;
        const roleLabel = typeof roleValue === 'string' ? roleLabels[roleValue] : null;
        return (
          <span className="table_name">
            <p>{roleLabel || (typeof roleValue === 'string' ? roleValue : "-")}</p>
          </span>
        );
      },
    },
    {
      title: "Vagon",
      dataIndex: "wagon_number",
      width: 90,
      render: (_, record) => {
        const wagonNumber = record?.wagon_number;
        const displayValue = (typeof wagonNumber === 'string' || typeof wagonNumber === 'number') 
          ? wagonNumber 
          : "-";
        return (
        <span className="table_name">
            <p>{displayValue}</p>
        </span>
        );
      },
    },
    {
      title: "Sana",
      dataIndex: "date",
      width: 130,
      render: (_, record) => (
        <span className="table_name">
          <p>
            {record?.assignment_date
              ? dayjs(record.assignment_date).format("DD.MM.YYYY HH:mm")
              : record?.created_at
              ? dayjs(record.created_at).format("DD.MM.YYYY HH:mm")
              : "-"}
          </p>
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      render: (_, record) => {
        const statusLabels = {
          assigned: "Tayinlangan",
          confirmed: "Tasdiqlangan",
          declined: "Rad etilgan",
          cancelled: "Bekor qilingan",
          completed: "Yakunlangan",
        };
        const statusColors = {
          assigned: "blue",
          confirmed: "green",
          declined: "orange",
          cancelled: "red",
          completed: "default",
        };
        const statusValue = record?.status;
        const statusLabel = typeof statusValue === 'string' ? statusLabels[statusValue] : null;
        return (
          <span className="table_name">
            <p style={{ 
              color: (typeof statusValue === 'string' ? statusColors[statusValue] : null) || "default",
              fontWeight: 500 
            }}>
              {statusLabel || (typeof statusValue === 'string' ? statusValue : "-")}
            </p>
          </span>
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      width: 150,
      align: "right",
      render: (_, record) => (
        <span className="action_wrapper">
          <Icon
            icon="ic_edit"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/assignments/${record.id}`);
            }}
          />
          <Icon
            icon="ic_info"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/assignments/detail/${record.id}`);
            }}
          />
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(true);
              setCurrentAssignment(record.id);
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
            <h2>Topshiriqlar</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Topshiriqlar ro'yxati",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Button type="primary" onClick={() => navigate("/assignments/add")}>
              Topshiriq qo'shish
            </Button>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div
          className="filters_area"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div className="item" style={{ width: 320 }}>
            <Input
              placeholder="Xodim yoki reys raqami bo'yicha qidirish"
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

          <Tabs
            activeKey={activeTab}
            onChange={onTabChange}
            items={[
              { key: "all", label: "Barcha topshiriqlar" },
              { key: "my", label: "Mening topshiriqlarim" },
            ]}
            style={{ minWidth: 120, marginLeft: 8 }}
          />
        </div>
        <div className="table_wrapper">
          <Table
            columns={columns}
            dataSource={Array.isArray(allAssignments) ? allAssignments.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isAssignmentsLoading ? customLoader : false}
            pagination={false}
            onChange={handleTableChange}
            onRow={(record) => ({
              onClick: () => navigate(`/assignments/detail/${record.id}`),
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
      </div>
      <DeleteConfirmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDelete}
        isLoading={isAssignmentDeleteLoading}
      />
    </section>
  );
}

export default Assignments;

