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
import useUniversalFetch from "../../Hooks/useApi";
import DeleteConfirmModal from "../../components/modals/deleteConfirm";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import { useNotification } from "../../components/notification";

function Departments() {
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
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedDepartmentsData,
    isPending: isDepartmentsLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "departments",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `settings/department/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allDepartments = fetchedDepartmentsData?.data || (Array.isArray(fetchedDepartmentsData) ? fetchedDepartmentsData : []);

  const {
    data: departmentDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: departmentDelete,
    isPending: isDepartmentDeleteLoading,
    error: departmentDeleteError,
    isError: isDepartmentDeleteError,
  } = useDeleteMutation({
    url: `settings/department/`,
    token: accessToken,
    invalidateKey: "departments",
  });

  const handleDelete = () => {
    departmentDelete({
      id: currentDepartment,
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
        departmentDeleteData?.message || t("messages").success
      );
      setCurrentDepartment(null);
      setModalVisible(false);
    } else if (isDepartmentDeleteError) {
      showNotification(
        "error",
        t("messages").error_2,
        departmentDeleteError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, departmentDeleteError, isDepartmentDeleteError]);

  useEffect(() => {
    if (fetchedDepartmentsData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedDepartmentsData?.total_elements || fetchedDepartmentsData?.total || (Array.isArray(fetchedDepartmentsData) ? fetchedDepartmentsData.length : 0),
      }));
    }
  }, [fetchedDepartmentsData]);

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
      title: "Bo'lim nomi",
      dataIndex: "name",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.name || record?.department_name || "-"}</p>
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      width: 120,
      align: "right",
      render: (_, record) => (
        <span className="action_wrapper">
          <Icon
            icon="ic_edit"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/departments/${record.id}`);
            }}
          />
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(true);
              setCurrentDepartment(record.id);
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
    <section className="page partners departments">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Bo'limlar</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Bo'limlar ro'yxati",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Link to="/departments/add">
              <Button type="primary">Bo'lim qo'shish</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
            <Input
              placeholder="Bo'lim nomi bo'yicha qidirish"
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
            dataSource={Array.isArray(allDepartments) ? allDepartments.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isDepartmentsLoading ? customLoader : false}
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
          isLoading={isDepartmentDeleteLoading}
          onConfirm={handleDelete}
          title="Bo'limni o'chirish?"
          message="Bu bo'limni o'chirmoqchimisiz?"
          dangerMessage="Barcha bo'lim ma'lumotlari qayta tiklanmaydi."
        />
      </div>
    </section>
  );
}

export default Departments;









