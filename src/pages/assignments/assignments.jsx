import { useState, useEffect } from "react";
import {
  Input,
  Table,
  Pagination,
  Breadcrumb,
} from "antd";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import { BASE_URL } from "../../consts/variables";
import useUniversalFetch from "../../Hooks/useApi";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import { useNotification } from "../../components/notification";
import dayjs from "dayjs";

function Assignments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useFetchQuery } = useUniversalFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  
  const showNotification = useNotification();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 50;
  const searchValue = searchParams.get("search") || "";
  const { t } = useLocalization();
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedAssignmentsData,
    isPending: isAssignmentsLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "assignments",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `assignments/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allAssignments = fetchedAssignmentsData?.data || [];

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
        total: fetchedAssignmentsData?.total_elements || fetchedAssignmentsData?.total || 0,
      }));
    }
  }, [fetchedAssignmentsData]);

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
      title: "Xodim",
      dataIndex: "employee",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.employee?.fullname || record?.employee_name || "-"}</p>
        </span>
      ),
    },
    {
      title: "Reys",
      dataIndex: "trip",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.trip?.trip_number || record?.trip_number || "-"}</p>
        </span>
      ),
    },
    {
      title: "Rol",
      dataIndex: "role",
      width: 150,
      render: (_, record) => {
        const roleLabels = {
          train_chief: "Poyezd boshlig'i",
          wagon_supervisor: "Vagon nazoratchisi",
          conductor: "Konduktor",
        };
        return (
          <span className="table_name">
            <p>{roleLabels[record?.role] || record?.role || "-"}</p>
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
            {record?.date 
              ? dayjs(record.date).format("DD.MM.YYYY") 
              : record?.created_at 
              ? dayjs(record.created_at).format("DD.MM.YYYY")
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
          cancelled: "Bekor qilingan",
          completed: "Yakunlangan",
        };
        const statusColors = {
          assigned: "blue",
          confirmed: "green",
          cancelled: "red",
          completed: "default",
        };
        return (
          <span className="table_name">
            <p style={{ 
              color: statusColors[record?.status] || "default",
              fontWeight: 500 
            }}>
              {statusLabels[record?.status] || record?.status || "-"}
            </p>
          </span>
        );
      },
    },
    {
      title: "Yaratilgan vaqti",
      dataIndex: "created_at",
      width: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>
            {record?.created_at 
              ? dayjs(record.created_at).format("DD.MM.YYYY HH:mm") 
              : "-"}
          </p>
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
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
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
    </section>
  );
}

export default Assignments;

