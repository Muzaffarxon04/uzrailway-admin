import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Pagination,
  Breadcrumb,
  Modal,
  Upload,
  message,
  Select,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import useUniversalFetch from "../../Hooks/useApi";
import DeleteConfirmModal from "../../components/modals/deleteConfirm";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import { useNotification } from "../../components/notification";
import dayjs from "dayjs";

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
  const [faceIdModalVisible, setFaceIdModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [accessModalVisible, setAccessModalVisible] = useState(false);
  const [selectedAccessEmployee, setSelectedAccessEmployee] = useState(null);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState(null);
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
    url: `auth/employee/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allEmployees = fetchedEmployeesData?.data || (Array.isArray(fetchedEmployeesData) ? fetchedEmployeesData : []);

  const {
    data: employeeDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: employeeDelete,
    isPending: isEmployeeDeleteLoading,
    error: employeeDeleteError,
    isError: isEmployeeDeleteError,
  } = useDeleteMutation({
    url: `auth/employee/`,
    token: accessToken,
    invalidateKey: "employees",
  });

  const { useFetchMutation } = useUniversalFetch();

  const {
    mutate: uploadFaceIdPicture,
    isPending: isFaceIdUploadLoading,
    isSuccess: isFaceIdUploadSuccess,
    isError: isFaceIdUploadError,
    error: faceIdUploadError,
  } = useFetchMutation({
    url: `auth/employee/picture/create/`,
    invalidateKey: ["employees"],
    method: "POST",
    token: accessToken,
  });

  // Fetch access levels
  const {
    data: accessLevelsData,
    isPending: isAccessLevelsLoading,
  } = useFetchQuery({
    queryKey: ["access-levels"],
    url: `auth/employee/access/level/list/`,
    token: accessToken,
    config: {
      queryOptions: {
        enabled: accessModalVisible, // Only fetch when modal is open
      },
    },
  });

  const accessLevels = accessLevelsData?.data || (Array.isArray(accessLevelsData) ? accessLevelsData : []);
console.log(accessLevelsData);

  const {
    mutate: createEmployeeAccess,
    isPending: isCreateAccessLoading,
    isSuccess: isCreateAccessSuccess,
    isError: isCreateAccessError,
    error: createAccessError,
  } = useFetchMutation({
    url: `auth/employee/access-level/person/create/`,
    invalidateKey: ["employees"],
    method: "POST",
    token: accessToken,
  });

  const handleDelete = () => {
    employeeDelete({
      id: currentEmployee,
    });
  };

  const handleFaceIdClick = (record) => {
    setSelectedEmployee(record);
    setFaceIdModalVisible(true);
    setFileList([]);
  };

  const handleFaceIdUpload = async () => {
    if (!fileList.length) {
      message.error("Iltimos, rasm tanlang");
      return;
    }

    if (!selectedEmployee?.personId) {
      message.error("Xodimning personId mavjud emas");
      return;
    }

    const file = fileList[0].originFileObj || fileList[0];
    if (!file) {
      message.error("Rasm fayli topilmadi");
      return;
    }

    const formData = new FormData();
    formData.append("picture", file);
    formData.append("personId", selectedEmployee.personId);

    try {
      uploadFaceIdPicture(formData);
    } catch (error) {
      message.error("Rasm yuklashda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    if (isFaceIdUploadSuccess) {
      message.success("Rasm muvaffaqiyatli yuklandi");
      setFaceIdModalVisible(false);
      setFileList([]);
      setSelectedEmployee(null);
      refetchData();
    } else if (isFaceIdUploadError) {
      message.error(faceIdUploadError?.message || "Rasm yuklashda xatolik yuz berdi");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFaceIdUploadSuccess, isFaceIdUploadError]);

  const handleAccessClick = (record) => {
    setSelectedAccessEmployee(record);
    setAccessModalVisible(true);
    setSelectedAccessLevel(null);
  };

  const handleAccessSubmit = () => {
    if (!selectedAccessLevel) {
      message.error("Iltimos, access level tanlang");
      return;
    }

    if (!selectedAccessEmployee?.personId) {
      message.error("Xodimning personId mavjud emas");
      return;
    }

    const body = {
      personId: selectedAccessEmployee.personId,
      accessLevelIdList: selectedAccessLevel,
    };

    createEmployeeAccess(body);
  };

  useEffect(() => {
    if (isCreateAccessSuccess) {
      message.success("Access muvaffaqiyatli berildi");
      setAccessModalVisible(false);
      setSelectedAccessLevel(null);
      setSelectedAccessEmployee(null);
      refetchData();
    } else if (isCreateAccessError) {
      message.error(createAccessError?.message || "Access berishda xatolik yuz berdi");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateAccessSuccess, isCreateAccessError]);

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
        total: fetchedEmployeesData?.total_elements || fetchedEmployeesData?.total || (Array.isArray(fetchedEmployeesData) ? fetchedEmployeesData.length : 0),
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
      title: "Ism",
      dataIndex: "firstName",
      minWidth: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.firstName || record?.first_name || "-"}</p>
        </span>
      ),
    },
    {
      title: "Familiya",
      dataIndex: "lastName",
      minWidth: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.lastName || record?.last_name || "-"}</p>
        </span>
      ),
    },
    {
      title: "Telefon raqami",
      dataIndex: "phone",
      width: 150,
      render: (_, record) => {
        const phone = record?.phone || record?.phone_number;
        return (
          <span className="table_phone_number">
            <a href={`tel:${phone}`}>{phone || "-"}</a>
          </span>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.email || "-"}</p>
        </span>
      ),
    },
    {
      title: "Yaratilgan vaqti",
      dataIndex: "created_at",
      width: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.created_at ? dayjs(record.created_at).format("DD.MM.YYYY HH:mm") : "-"}</p>
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      width: 180,
      align: "right",
      render: (_, record) => (
        <span className="action_wrapper">
          <Button
            type="link"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleFaceIdClick(record);
            }}
            style={{ padding: 0, height: "auto", marginRight: 8 }}
          >
            FaceID
          </Button>
          <Button
            type="link"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleAccessClick(record);
            }}
            style={{ padding: 0, height: "auto", marginRight: 8 }}
          >
            Access
          </Button>
          <Icon
            icon="ic_info"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/employees/detail/${record.id}`);
            }}
          />
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
    <section className="page partners employees">
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
              placeholder="Xodim ismi bo'yicha qidirish"
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
            scroll={{ x: 'max-content' }}
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

        <Modal
          title="FaceID rasm qo'shish"
          open={faceIdModalVisible}
          onCancel={() => {
            setFaceIdModalVisible(false);
            setFileList([]);
            setSelectedEmployee(null);
          }}
          onOk={handleFaceIdUpload}
          confirmLoading={isFaceIdUploadLoading}
          okText="Yuklash"
          cancelText="Bekor qilish"
        >
          <div style={{ marginBottom: 16 }}>
            <p>
              <strong>Xodim:</strong> {selectedEmployee?.firstName || selectedEmployee?.first_name || ""}{" "}
              {selectedEmployee?.lastName || selectedEmployee?.last_name || ""}
            </p>
            {selectedEmployee?.personId && (
              <p>
                <strong>Person ID:</strong> {selectedEmployee.personId}
              </p>
            )}
          </div>
          <Upload
            fileList={fileList}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("Faqat rasm fayllari yuklash mumkin!");
                return false;
              }
              const isLt10M = file.size / 1024 / 1024 < 10;
              if (!isLt10M) {
                message.error("Rasm hajmi 10MB dan kichik bo'lishi kerak!");
                return false;
              }
              // Save file with originFileObj property for proper file access
              setFileList([{
                uid: file.uid || `-${Date.now()}`,
                name: file.name,
                status: 'done',
                originFileObj: file,
              }]);
              return false;
            }}
            onRemove={() => {
              setFileList([]);
            }}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Rasm tanlash</Button>
          </Upload>
          {!selectedEmployee?.personId && (
            <p style={{ color: "red", marginTop: 8 }}>
              Ushbu xodimning personId mavjud emas. Iltimos, avval personId ni qo'shing.
            </p>
          )}
        </Modal>

        <Modal
          title="Access berish"
          open={accessModalVisible}
          onCancel={() => {
            setAccessModalVisible(false);
            setSelectedAccessLevel(null);
            setSelectedAccessEmployee(null);
          }}
          onOk={handleAccessSubmit}
          confirmLoading={isCreateAccessLoading}
          okText="Saqlash"
          cancelText="Bekor qilish"
        >
          <div style={{ marginBottom: 16 }}>
            <p>
              <strong>Xodim:</strong> {selectedAccessEmployee?.firstName || selectedAccessEmployee?.first_name || ""}{" "}
              {selectedAccessEmployee?.lastName || selectedAccessEmployee?.last_name || ""}
            </p>
            {selectedAccessEmployee?.personId && (
              <p>
                <strong>Person ID:</strong> {selectedAccessEmployee.personId}
              </p>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
              Access Level tanlang:
            </label>
            {isAccessLevelsLoading ? (
              <Spin />
            ) : (
              <Select
                style={{ width: "100%" }}
                placeholder="Access level tanlang"
                value={selectedAccessLevel}
                onChange={setSelectedAccessLevel}
                options={Array.isArray(accessLevels) ? accessLevels.map((level) => ({
                  label: level.name || level.level_name || `Access Level ${level.id}`,
                  value: level.id,
                })) : []}
                loading={isAccessLevelsLoading}
              />
            )}
          </div>
          {!selectedAccessEmployee?.personId && (
            <p style={{ color: "red", marginTop: 8 }}>
              Ushbu xodimning personId mavjud emas. Iltimos, avval personId ni qo'shing.
            </p>
          )}
        </Modal>
      </div>
    </section>
  );
}

export default Employees;

