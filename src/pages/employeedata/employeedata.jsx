import { useState, useEffect } from "react";
import {
  Input,
  Table,
  Pagination,
  Breadcrumb,
  DatePicker,
} from "antd";
import { useSearchParams, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import { BASE_URL } from "../../consts/variables";
import useUniversalFetch from "../../Hooks/useApi";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import { useNotification } from "../../components/notification";
import dayjs from "dayjs";
import "./_employeedata.scss";

function EmployeeData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useFetchQuery } = useUniversalFetch();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  
  const showNotification = useNotification();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 50;
  const searchValue = searchParams.get("search") || "";
  const dateParam = searchParams.get("date") || dayjs().format("YYYY-MM-DD");
  const { t } = useLocalization();
  const [selectedDate, setSelectedDate] = useState(dayjs(dateParam));
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedEmployeeData,
    isPending: isEmployeeDataLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "employee-data",
      pagination.current,
      pagination.pageSize,
      searchValue,
      dateParam,
    ],
    url: `${BASE_URL}/data/employee`,
    params: {
      date: dateParam,
      page_size: pagination.pageSize,
      page: pagination.current,
      search: searchValue,
    },
    token: accessToken,
  });

  const allEmployeeData = fetchedEmployeeData?.data?.data || fetchedEmployeeData?.data || fetchedEmployeeData || [];

  useEffect(() => {
    if (location.pathname) {
      refetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (fetchedEmployeeData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedEmployeeData?.total || fetchedEmployeeData?.data?.total || fetchedEmployeeData?.length || 0,
      }));
    }
  }, [fetchedEmployeeData]);

  const handleTableChange = (pagination) => {
    if (pagination) {
      setPagination((prev) => ({
        ...prev,
        current: pagination.current,
        pageSize: pagination.pageSize,
      }));

      setSearchParams({
        page: pagination.current,
        pageSize: pagination.pageSize,
        search: searchValue || "",
        date: dateParam,
      });
    }
  };

  const onSearch = (value) => {
    setPagination((prev) => ({ ...prev, current: 1 }));

    setSearchParams({
      page: 1,
      pageSize: pagination.pageSize,
      search: value.trim() || "",
      date: dateParam,
    });
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");
    setSelectedDate(date || dayjs());
    setPagination((prev) => ({ ...prev, current: 1 }));
    
    setSearchParams({
      page: 1,
      pageSize: pagination.pageSize,
      search: searchValue || "",
      date: formattedDate,
    });
  };

  // Determine columns based on data structure
  const getColumns = () => {
    if (!allEmployeeData || allEmployeeData.length === 0) {
      return [];
    }

    const firstItem = allEmployeeData[0];
    const keys = Object.keys(firstItem || {});
    
    // Filter out internal/technical keys
    const displayKeys = keys.filter(key => 
      !['key', 'isFirstRow', 'currentSupervisor', 'flightGroupId'].includes(key)
    );

    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        width: 80,
        render: (_, record) => (
          <span className="table_id">
            <p>#{record?.id || "-"}</p>
          </span>
        ),
      },
    ];

    // Add dynamic columns based on data
    displayKeys.forEach((key) => {
      if (key !== 'id') {
        columns.push({
          title: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          dataIndex: key,
          minWidth: 150,
          render: (_, record) => {
            const value = record?.[key];
            if (value === null || value === undefined) {
              return <span className="table_name"><p>-</p></span>;
            }
            if (typeof value === 'object') {
              return <span className="table_name"><p>{JSON.stringify(value)}</p></span>;
            }
            if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time') || key.toLowerCase().includes('at')) {
              return (
                <span className="table_name">
                  <p>
                    {value}
                  </p>
                </span>
              );
            }
            return (
              <span className="table_name">
                <p>{String(value)}</p>
              </span>
            );
          },
        });
      }
    });

    return columns;
  };

  const columns = getColumns();

  const customLoader = {
    spinning: true,
    indicator: <LoadingOutlined style={{ fontSize: 40 }} spin />,
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
    handleTableChange({ current: page, pageSize });
  };

  return (
    <section className="page partners employeedata">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Xodimlar ma'lumotlari</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Xodimlar ma'lumotlari ro'yxati",
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
            <DatePicker
              placeholder="Sana tanlang"
              value={selectedDate}
              onChange={handleDateChange}
              format="DD.MM.YYYY"
              size="large"
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </div>
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
                  search: e.target.value || "",
                  date: dateParam,
                });
              }}
            />
          </div>
        </div>
        <div className="table_wrapper">
          <Table
            columns={columns}
            dataSource={Array.isArray(allEmployeeData) ? allEmployeeData.map((item, index) => ({
              ...item,
              key: item?.id || `employee-${index}`,
            })) : []}
            loading={isEmployeeDataLoading ? customLoader : false}
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

export default EmployeeData;

