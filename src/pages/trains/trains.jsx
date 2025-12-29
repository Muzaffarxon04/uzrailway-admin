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

function Trains() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useFetchQuery, useDeleteMutation } = useUniversalFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  
  const showNotification = useNotification();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 50;
  const searchValue = searchParams.get("name") || "";
  const { t } = useLocalization();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTrain, setCurrentTrain] = useState(null);
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedTrainsData,
    isPending: isTrainsLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "train",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `train/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allTrains = fetchedTrainsData?.data || [];

  const {
    data: trainDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: trainDelete,
    isPending: isTrainDeleteLoading,
    error: trainDeleteError,
    isError: isTrainDeleteError,
  } = useDeleteMutation({
    url: `trains`,
    method: "DELETE",
    token: accessToken,
  });

  const handleDelete = () => {
    trainDelete({
      id: currentTrain,
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
        trainDeleteData?.message || t("messages").success
      );
      setCurrentTrain(null);
      setModalVisible(false);
    } else if (isTrainDeleteError) {
      showNotification(
        "error",
        t("messages").error_2,
        trainDeleteError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, trainDeleteError, isTrainDeleteError]);

  useEffect(() => {
    if (fetchedTrainsData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedTrainsData?.total_elements || fetchedTrainsData?.total || 0,
      }));
    }
  }, [fetchedTrainsData]);

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
      title: "Poyezd raqami",
      dataIndex: "train_number",
      minWidth: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.train_number || "-"}</p>
        </span>
      ),
    },
    {
      title: "Poyezd nomi",
      dataIndex: "train_name",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.train_name || "-"}</p>
        </span>
      ),
    },
    {
      title: "Poyezd turi",
      dataIndex: "train_type",
      width: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.train_type || "-"}</p>
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.status || "-"}</p>
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
            icon="ic_info"
            className="icon info"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trains/detail/${record.id}`);
            }}
          />
          <Icon
            icon="ic_edit"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trains/${record.id}`);
            }}
          />
          {/* <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(true);
              setCurrentTrain(record.id);
            }}
          /> */}
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
            <h2>Poyezdlar</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Poyezdlar ro'yxati",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Link to="/trains/add">
              <Button type="primary">Poyezd qo'shish</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
            <Input
              placeholder="Poyezd raqami yoki nomi bo'yicha qidirish"
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
            dataSource={Array.isArray(allTrains) ? allTrains.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isTrainsLoading ? customLoader : false}
            pagination={false}
            onChange={handleTableChange}
            onRow={(record) => ({
              onClick: () => {
                navigate(`/trains/detail/${record.id}`);
              },
              style: { cursor: "pointer" },
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
        <DeleteConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          isLoading={isTrainDeleteLoading}
          onConfirm={handleDelete}
          title="Poyezdni o'chirish?"
          message="Bu poyezdni o'chirmoqchimisiz?"
          dangerMessage="Barcha poyezd ma'lumotlari qayta tiklanmaydi."
        />
      </div>
    </section>
  );
}

export default Trains;

