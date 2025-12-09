import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Pagination,
  Breadcrumb,
} from "antd";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import { BASE_URL } from "../../consts/variables";
import useUniversalFetch from "../../Hooks/useApi";
import DeleteConfirmModal from "../../components/modals/deleteConfirm";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import { useNotification } from "../../components/notification";

function Employees() {
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
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedEmployeesData,
    isPending: isEmployeesLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "employees",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `${BASE_URL}/employee`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      search: searchValue,
    },
    token: accessToken,
  });

  const allEmployees = fetchedEmployeesData?.data?.data || fetchedEmployeesData?.data || fetchedEmployeesData || [];

  const {
    data: employeeDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: employeeDelete,
    isPending: isEmployeeDeleteLoading,
    error: employeeDeleteError,
    isError: isEmployeeDeleteError,
  } = useDeleteMutation({
    url: `${BASE_URL}/employee`,
    method: "DELETE",
    token: accessToken,
  });

  const handleDelete = () => {
    employeeDelete({
      id: currentEmployee,
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
        employeeDeleteData?.message || t("messages").success
      );
      setCurrentEmployee(null);
      setModalVisible(false);
    } else if (isEmployeeDeleteError) {
      showNotification(
        "error",
        t("messages").error_2,
        employeeDeleteError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, employeeDeleteError, isEmployeeDeleteError]);

  useEffect(() => {
    if (fetchedEmployeesData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedEmployeesData?.total || fetchedEmployeesData?.data?.total || fetchedEmployeesData?.data?.length || fetchedEmployeesData?.length || 0,
      }));
    }
  }, [fetchedEmployeesData]);

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
      title: "To'liq ism",
      dataIndex: "fullname",
      minWidth: 250,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.fullname}</p>
        </span>
      ),
    },
    {
      title: "Telefon raqami",
      dataIndex: "phone",
      width: 180,
      render: (_, record) => (
        <span className="table_phone_number">
          <a href={`tel:${record?.phone}`}>{record?.phone}</a>
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
            icon="ic_edit"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/employees/${record.id}`);
            }}
          />
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(true);
              setCurrentEmployee(record.id);
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
            <h2>Xodimlar</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Xodimlar ro'yxati",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Link to="/employees/add">
              <Button type="primary">Xodim qo'shish</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
            <Input
              placeholder="Ism bo'yicha qidirish"
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
            dataSource={Array.isArray(allEmployees) ? allEmployees.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isEmployeesLoading ? customLoader : false}
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
        <DeleteConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          isLoading={isEmployeeDeleteLoading}
          onConfirm={handleDelete}
          title="Xodimni o'chirish?"
          message="Bu xodimni o'chirmoqchimisiz?"
          dangerMessage="Barcha xodim ma'lumotlari qayta tiklanmaydi."
        />
      </div>
    </section>
  );
}

export default Employees;
