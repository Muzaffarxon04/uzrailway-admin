import { useState, useEffect } from "react";
import {
  Input,
  Table,
  Pagination,
  Breadcrumb,
} from "antd";
import { useSearchParams, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import useUniversalFetch from "../../Hooks/useApi";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";

function HikiList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useFetchQuery } = useUniversalFetch();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 50;
  const searchValue = searchParams.get("name") || "";
  const { t } = useLocalization();
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedHikiData,
    isPending: isHikiLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "hiki-list",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `devices/hiki-list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { name: searchValue } : {}),
    },
    token: accessToken,
  });

  const allHikiData = fetchedHikiData?.devices || (Array.isArray(fetchedHikiData) ? fetchedHikiData : []);

  useEffect(() => {
    if (location.pathname) {
      refetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (fetchedHikiData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedHikiData?.totalCount || 0,
        current: fetchedHikiData?.pageIndex || 1,
        pageSize: fetchedHikiData?.pageSize || 20,
      }));
    }
  }, [fetchedHikiData]);

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));

    setSearchParams({
      page: pagination.current,
      pageSize: pagination.pageSize,
      name: searchValue || "",
    });
  };

  const onSearch = (value) => {
    setPagination((prev) => ({ ...prev, current: 1 }));

    setSearchParams({
      page: 1,
      pageSize: pagination.pageSize,
                  name: value.trim() || "",
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 200,
      render: (_, record) => (
        <span className="table_id">
          <p>{record?.id || "-"}</p>
        </span>
      ),
    },
    {
      title: "Qurilma nomi",
      dataIndex: "name",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.name || "-"}</p>
        </span>
      ),
    },
    {
      title: "Kategoriya",
      dataIndex: "category",
      width: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.category || "-"}</p>
        </span>
      ),
    },
    {
      title: "Turi",
      dataIndex: "type",
      width: 120,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.type || "-"}</p>
        </span>
      ),
    },
    {
      title: "Seriya raqami",
      dataIndex: "serialNo",
      minWidth: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.serialNo || "-"}</p>
        </span>
      ),
    },
    {
      title: "Versiya",
      dataIndex: "version",
      minWidth: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.version || "-"}</p>
        </span>
      ),
    },
    {
      title: "Onlayn status",
      dataIndex: "onlineStatus",
      width: 120,
      render: (_, record) => {
        const status = record?.onlineStatus;
        return (
          <span className={`status ${status === 1 ? 'active' : 'inactive'}`}>
            <p>{status === 1 ? "Onlayn" : "Oflayn"}</p>
          </span>
        );
      },
    },
    {
      title: "Qo'shilgan vaqt",
      dataIndex: "addTime",
      width: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.addTime || "-"}</p>
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
            <h2>Hiki ro'yxati</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Hiki ro'yxati",
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
              placeholder="Qidirish"
              allowClear
              size="large"
              onSearch={onSearch}
              prefix={<Icon className="icon icon_prefix" icon="ic_search" />}
              onChange={(e) => {
                setPagination((prev) => ({ ...prev, current: 1 }));
                setSearchParams({
                  page: 1,
                  pageSize: pagination.pageSize,
                  name: e.target.value || "",
                });
              }}
            />
          </div>
        </div>
        <div className="table_wrapper">
          <Table
            columns={columns}
            dataSource={Array.isArray(allHikiData) ? allHikiData.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isHikiLoading ? customLoader : false}
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

export default HikiList;

