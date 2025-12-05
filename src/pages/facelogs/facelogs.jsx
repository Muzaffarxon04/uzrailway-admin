import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Pagination,
  Breadcrumb,
  Tag,
} from "antd";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import { BASE_URL } from "../../consts/variables";
import useUniversalFetch from "../../Hooks/useApi";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import { useNotification } from "../../components/notification";
import dayjs from "dayjs";

function FaceLogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useFetchQuery } = useUniversalFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  
  const showNotification = useNotification();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 10;
  const searchValue = searchParams.get("search") || "";
  const { t } = useLocalization();
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedFaceLogsData,
    isPending: isFaceLogsLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "face-logs",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `${BASE_URL}/face-logs`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      search: searchValue,
    },
    token: accessToken,
  });

  const allFaceLogs = fetchedFaceLogsData?.data?.data || fetchedFaceLogsData?.data || fetchedFaceLogsData || [];

  useEffect(() => {
    if (location.pathname) {
      refetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (fetchedFaceLogsData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedFaceLogsData?.total || fetchedFaceLogsData?.data?.total || fetchedFaceLogsData?.length || 0,
      }));
    }
  }, [fetchedFaceLogsData]);

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
      case "recognized":
        return "green";
      case "unknown":
        return "red";
      case "pending":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "recognized":
        return "Tanishgan";
      case "unknown":
        return "Noma'lum";
      case "pending":
        return "Kutilmoqda";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      sorter: true,
      render: (_, record) => (
        <span className="table_id">
          <p>#{record?.id}</p>
        </span>
      ),
    },
    {
      title: "To'liq ism",
      dataIndex: "fullname",
      minWidth: 200,
      sorter: true,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.fullname || "Noma'lum"}</p>
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      sorter: true,
      render: (_, record) => (
        <Tag color={getStatusColor(record?.status)}>
          {getStatusText(record?.status)}
        </Tag>
      ),
    },
    {
      title: "Qurilma IP",
      dataIndex: "deviceIp",
      width: 150,
      sorter: true,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.deviceIp || "-"}</p>
        </span>
      ),
    },
    {
      title: "Vaqt",
      dataIndex: "operatedAt",
      width: 200,
      sorter: true,
      render: (_, record) => (
        <span className="table_name">
          <p>
            {record?.operatedAt
              ? dayjs(record.operatedAt).format("DD.MM.YYYY HH:mm")
              : "-"}
          </p>
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
            icon="ic_info"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/facelogs/detail/${record.id}`);
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
            <h2>Keldi-ketdilar</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Keldi-ketdilar ro'yxati",
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
              placeholder="To'liq ism bo'yicha qidirish"
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
            dataSource={Array.isArray(allFaceLogs) ? allFaceLogs.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isFaceLogsLoading ? customLoader : false}
            pagination={false}
            onChange={handleTableChange}
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
      </div>
    </section>
  );
}

export default FaceLogs;

