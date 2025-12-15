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

function Devices() {
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
  const [currentDevice, setCurrentDevice] = useState(null);
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedDevicesData,
    isPending: isDevicesLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "devices",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `devices/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allDevices = fetchedDevicesData?.data || [];

  const {
    data: deviceDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: deviceDelete,
    isPending: isDeviceDeleteLoading,
    error: deviceDeleteError,
    isError: isDeviceDeleteError,
  } = useDeleteMutation({
    url: `devices/delete/`,
    token: accessToken,
  });

  const handleDelete = () => {
    deviceDelete({
      id: currentDevice,
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
        deviceDeleteData?.message || t("messages").success
      );
      setCurrentDevice(null);
      setModalVisible(false);
    } else if (isDeviceDeleteError) {
      showNotification(
        "error",
        t("messages").error_2,
        deviceDeleteError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, deviceDeleteError, isDeviceDeleteError]);

  useEffect(() => {
    if (fetchedDevicesData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedDevicesData?.total_elements || fetchedDevicesData?.total || 0,
      }));
    }
  }, [fetchedDevicesData]);

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
      title: "Qurilma nomi",
      dataIndex: "deviceName",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.deviceName || record?.name || "-"}</p>
        </span>
      ),
    },
    {
      title: "MAC manzil",
      dataIndex: "macAddress",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.macAddress || "-"}</p>
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
      title: "IP manzil",
      dataIndex: "ipAddress",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.ipAddress || record?.ip || "-"}</p>
        </span>
      ),
    },
    {
      title: "Stansiya",
      dataIndex: "station",
      width: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.station?.name || record?.stationName || "-"}</p>
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
              navigate(`/devices/${record.id}`);
            }}
          />
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(true);
              setCurrentDevice(record.id);
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
            <h2>Qurilmalar</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Qurilmalar ro'yxati",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Link to="/devices/add">
              <Button type="primary">Qurilma qo'shish</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
            <Input
              placeholder="Qurilma nomi bo'yicha qidirish"
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
            dataSource={Array.isArray(allDevices) ? allDevices.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isDevicesLoading ? customLoader : false}
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
          isLoading={isDeviceDeleteLoading}
          onConfirm={handleDelete}
          title="Qurilmani o'chirish?"
          message="Bu qurilmani o'chirmoqchimisiz?"
          dangerMessage="Barcha qurilma ma'lumotlari qayta tiklanmaydi."
        />
      </div>
    </section>
  );
}

export default Devices;

