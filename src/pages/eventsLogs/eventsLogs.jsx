import { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Input, Pagination, Table, Tag } from "antd";
import { useSearchParams, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import useUniversalFetch from "../../Hooks/useApi";
import dayjs from "dayjs";

function EventsLogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useFetchQuery } = useUniversalFetch();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  const { t } = useLocalization();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 50;
  const searchValue = searchParams.get("search") || "";

  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize,
    total: 0,
  });

  const {
    data: fetchedLogs,
    isPending: isLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: ["events-logs", pagination.current, pagination.pageSize, searchValue],
    url: `events/logs/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allLogs = useMemo(() => {
    if (!fetchedLogs) return [];
    if (Array.isArray(fetchedLogs)) return fetchedLogs;
    if (Array.isArray(fetchedLogs?.results)) return fetchedLogs.results;
    if (Array.isArray(fetchedLogs?.data)) return fetchedLogs.data;
    return [];
  }, [fetchedLogs]);

  useEffect(() => {
    if (location.pathname) {
      refetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (fetchedLogs) {
      setPagination((prev) => ({
        ...prev,
        total:
          fetchedLogs?.total_elements ||
          fetchedLogs?.total ||
          fetchedLogs?.count ||
          allLogs.length,
      }));
    }
  }, [fetchedLogs, allLogs.length]);

  const handleTableChange = (tablePagination) => {
    setPagination((prev) => ({
      ...prev,
      current: tablePagination.current,
      pageSize: tablePagination.pageSize,
    }));

    setSearchParams({
      page: tablePagination.current,
      pageSize: tablePagination.pageSize,
      search: searchValue || "",
    });
  };

  const handlePaginationChange = (page, size) => {
    setPagination({ current: page, pageSize: size });
    handleTableChange({ current: page, pageSize: size });
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
    const full = [employee.firstName, employee.lastName].filter(Boolean).join(" ").trim();
    return full || employee.username || "-";
  };

  const getEventTitle = (record) =>
    record?.event?.name ||
    record?.event?.title ||
    record?.event_name ||
    record?.assignment?.event?.name ||
    "-";

  const formatDate = (value, withTime = false) =>
    value ? dayjs(value).format(withTime ? "DD.MM.YYYY HH:mm" : "DD.MM.YYYY") : "-";

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
      minWidth: 130,
      render: (_, record) => (
        <span className="table_name">
          <p>{getEmployeeName(record?.employee) || "-"}</p>
        </span>
      ),
    },
    {
      title: "Kirish stansiya",
      dataIndex: "entered_station",
      minWidth: 160,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.entered_station || "-"}</p>
        </span>
      ),
    },
    {
      title: "Kirish vaqti",
      dataIndex: "enter_dateTime",
      width: 170,
      render: (_, record) => (
        <span className="table_name">
          <p>{formatDate(record?.enter_dateTime, true)}</p>
        </span>
      ),
    },
    {
      title: "Kirish IP / MAC",
      dataIndex: "entered_ipAddress",
      width: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.entered_ipAddress || "-"}</p>
          <p style={{ marginBottom: 0 }}>{record?.enterd_macAddress || record?.entered_macAddress || "-"}</p>
        </span>
      ),
    },
    {
      title: "Chiqish stansiya",
      dataIndex: "leaved_station",
      minWidth: 160,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.leaved_station || "-"}</p>
        </span>
      ),
    },
    {
      title: "Chiqish vaqti",
      dataIndex: "leave_dateTime",
      width: 170,
      render: (_, record) => (
        <span className="table_name">
          <p>{formatDate(record?.leave_dateTime, true)}</p>
        </span>
      ),
    },
    {
      title: "Chiqish IP / MAC",
      dataIndex: "leaved_ipAddress",
      width: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.leaved_ipAddress || "-"}</p>
          <p style={{ marginBottom: 0 }}>{record?.leaved_macAddress || record?.leave_macAddress || "-"}</p>
        </span>
      ),
    },
    {
      title: "Sub event type",
      dataIndex: "subEventType",
      width: 140,
      render: (_, record) => (
        <Tag color="blue">{record?.subEventType ?? "-"}</Tag>
      ),
    },
    {
      title: "Tadbir",
      dataIndex: "event",
      minWidth: 160,
      render: (_, record) => (
        <span className="table_name">
          <p>{getEventTitle(record)}</p>
        </span>
      ),
    },
  ];

  const customLoader = {
    spinning: true,
    indicator: <LoadingOutlined style={{ fontSize: 40 }} spin />,
  };

  return (
    <section className="page partners">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Tadbir loglari</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Loglar",
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
          <div className="item" style={{ width: 320 }}>
            <Input
              placeholder="Xodim yoki tadbir bo'yicha qidirish"
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
            dataSource={
              Array.isArray(allLogs)
                ? allLogs.map((item) => ({
                    ...item,
                    key: item?.id,
                  }))
                : []
            }
            loading={isLoading ? customLoader : false}
            pagination={false}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
          />
        </div>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={["10", "20", "50", "100", "200"]}
          onChange={handlePaginationChange}
          style={{ marginTop: 20, textAlign: "center" }}
          locale={{ items_per_page: `/ ${t("Common").page}` }}
        />
      </div>
    </section>
  );
}

export default EventsLogs;


