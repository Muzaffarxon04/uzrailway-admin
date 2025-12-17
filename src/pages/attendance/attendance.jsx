import { useState, useEffect } from "react";
import {
  Input,
  Table,
  Pagination,
  Breadcrumb,
} from "antd";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import useUniversalFetch from "../../Hooks/useApi";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import dayjs from "dayjs";

function Attendance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useFetchQuery } = useUniversalFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");

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
    data: fetchedAttendanceData,
    isPending: isAttendanceLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "attendance",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `attendance/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allAttendance = fetchedAttendanceData?.data || [];

  useEffect(() => {
    if (location.pathname) {
      refetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (fetchedAttendanceData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedAttendanceData?.total_elements || fetchedAttendanceData?.total || 0,
      }));
    }
  }, [fetchedAttendanceData]);

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

  const getEmployeeName = (employee) => {
    if (!employee) return "-";
    if (employee.full_name) return employee.full_name;
    if (employee.fullname) return employee.fullname;
    const full =
      [employee.firstName, employee.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();
    return full || employee.username || "-";
  };

  const getTripNumber = (record) =>
    record?.trip_info?.trip_number ||
    record?.assignment?.trip?.trip_number ||
    record?.trip?.trip_number ||
    record?.trip_number ||
    "-";

  const formatDateOnly = (value) =>
    value ? dayjs(value).format("DD.MM.YYYY") : "-";

  const formatDateTime = (value) =>
    value ? dayjs(value).format("DD.MM.YYYY HH:mm") : "-";

  const getAttendanceDate = (record) =>
    record?.date ||
    record?.assignment?.assignment_date ||
    record?.created_at ||
    null;

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
          <p>{getEmployeeName(record?.employee) || record?.employee_name || "-"}</p>
        </span>
      ),
    },
    {
      title: "Reys",
      dataIndex: "trip",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{getTripNumber(record)}</p>
        </span>
      ),
    },
    {
      title: "Sana",
      dataIndex: "date",
      width: 130,
      render: (_, record) => (
        <span className="table_name">
          <p>
            {formatDateOnly(getAttendanceDate(record))}
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
          present: "Hozir",
          absent: "Yo'q",
          late: "Kechikkan",
          on_time: "Vaqtida",
        };
        const statusColors = {
          present: "green",
          absent: "red",
          late: "orange",
          on_time: "blue",
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
      title: "Kelish vaqti",
      dataIndex: "check_in_time",
      width: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>
            {record?.check_in_time
              ? formatDateTime(record.check_in_time)
              : record?.arrival_time
              ? formatDateTime(record.arrival_time)
              : "-"}
          </p>
        </span>
      ),
    },
    {
      title: "Ketish vaqti",
      dataIndex: "check_out_time",
      width: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>
            {record?.check_out_time
              ? formatDateTime(record.check_out_time)
              : record?.departure_time
              ? formatDateTime(record.departure_time)
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
            <h2>Davomat</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Davomat ro'yxati",
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
            dataSource={Array.isArray(allAttendance) ? allAttendance.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isAttendanceLoading ? customLoader : false}
            pagination={false}
            onChange={handleTableChange}
            onRow={(record) => ({
              onClick: () => {
                if (record?.id) {
                  navigate(`/attendance/detail/${record.id}`);
                }
              },
              style: { cursor: record?.id ? "pointer" : "default" },
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
    </section>
  );
}

export default Attendance;






