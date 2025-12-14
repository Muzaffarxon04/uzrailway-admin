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

function Positions() {
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
  const [currentPosition, setCurrentPosition] = useState(null);
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedPositionsData,
    isPending: isPositionsLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "positions",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `settings/position/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allPositions = fetchedPositionsData?.data || (Array.isArray(fetchedPositionsData) ? fetchedPositionsData : []);

  const {
    data: positionDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: positionDelete,
    isPending: isPositionDeleteLoading,
    error: positionDeleteError,
    isError: isPositionDeleteError,
  } = useDeleteMutation({
    url: `settings/position/`,
    token: accessToken,
    invalidateKey: "positions",
  });

  const handleDelete = () => {
    positionDelete({
      id: currentPosition,
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
        positionDeleteData?.message || t("messages").success
      );
      setCurrentPosition(null);
      setModalVisible(false);
    } else if (isPositionDeleteError) {
      showNotification(
        "error",
        t("messages").error_2,
        positionDeleteError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, positionDeleteError, isPositionDeleteError]);

  useEffect(() => {
    if (fetchedPositionsData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedPositionsData?.total_elements || fetchedPositionsData?.total || (Array.isArray(fetchedPositionsData) ? fetchedPositionsData.length : 0),
      }));
    }
  }, [fetchedPositionsData]);

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
      title: "Lavozim nomi",
      dataIndex: "name",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.name || record?.position_name || "-"}</p>
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
              navigate(`/positions/${record.id}`);
            }}
          />
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(true);
              setCurrentPosition(record.id);
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
    <section className="page partners positions">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Lavozimlar</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Lavozimlar ro'yxati",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Link to="/positions/add">
              <Button type="primary">Lavozim qo'shish</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
            <Input
              placeholder="Lavozim nomi bo'yicha qidirish"
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
            dataSource={Array.isArray(allPositions) ? allPositions.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isPositionsLoading ? customLoader : false}
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
          isLoading={isPositionDeleteLoading}
          onConfirm={handleDelete}
          title="Lavozimni o'chirish?"
          message="Bu lavozimni o'chirmoqchimisiz?"
          dangerMessage="Barcha lavozim ma'lumotlari qayta tiklanmaydi."
        />
      </div>
    </section>
  );
}

export default Positions;

