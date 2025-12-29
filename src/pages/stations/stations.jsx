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
import { Tag } from "antd";
import dayjs from "dayjs";

function Stations() {
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
  const [currentStation, setCurrentStation] = useState(null);
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedStationsData,
    isPending: isStationsLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "stations",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `stations/list/`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      ...(searchValue ? { search: searchValue } : {}),
    },
    token: accessToken,
  });

  const allStations = fetchedStationsData?.data || (Array.isArray(fetchedStationsData) ? fetchedStationsData : []);

  const {
    data: stationDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: stationDelete,
    isPending: isStationDeleteLoading,
    error: stationDeleteError,
    isError: isStationDeleteError,
  } = useDeleteMutation({
    url: `stations/delete/`,
    token: accessToken,
  });

  const handleDelete = () => {
    stationDelete({
      id: currentStation,
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
        stationDeleteData?.message || t("messages").success
      );
      setCurrentStation(null);
      setModalVisible(false);
    } else if (isStationDeleteError) {
      showNotification(
        "error",
        t("messages").error_2,
        stationDeleteError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, stationDeleteError, isStationDeleteError]);

  useEffect(() => {
    if (fetchedStationsData) {
      setPagination((prev) => ({
        ...prev,
        total: fetchedStationsData?.total_elements || fetchedStationsData?.total || (Array.isArray(fetchedStationsData) ? fetchedStationsData.length : 0),
      }));
    }
  }, [fetchedStationsData]);

  // Fetch regions for mapping region ID to name
  const {
    data: regionsData,
  } = useFetchQuery({
    queryKey: ["regions-select"],
    url: `regions/list/`,
    params: { page: 1, page_size: 1000 },
    token: accessToken,
  });

  const regions = regionsData?.data || (Array.isArray(regionsData) ? regionsData : []);
  const regionMap = new Map(regions.map(region => [region.id, region.name || region.region_name]));

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
      title: "Stansiya nomi",
      dataIndex: "name",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.name || "-"}</p>
        </span>
      ),
    },
    {
      title: "Manzil",
      dataIndex: "address",
      minWidth: 200,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.address || "-"}</p>
        </span>
      ),
    },
    {
      title: "Telefon raqami",
      dataIndex: "phone_number",
      width: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{record?.phone_number || "-"}</p>
        </span>
      ),
    },
    {
      title: "Viloyat",
      dataIndex: "region",
      width: 150,
      render: (_, record) => (
        <span className="table_name">
          <p>{regionMap.get(record?.region) || record?.region || "-"}</p>
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      width: 100,
      render: (_, record) => (
        <Tag color={record?.is_active ? "green" : "red"}>
          {record?.is_active ? "Faol" : "Nofaol"}
        </Tag>
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
      width: 120,
      align: "right",
      render: (_, record) => (
        <span className="action_wrapper">
          <Icon
            icon="ic_edit"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/stations/${record.id}`);
            }}
          />
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              setModalVisible(true);
              setCurrentStation(record.id);
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
            <h2>Stansiyalar</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Stansiyalar ro'yxati",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Link to="/stations/add">
              <Button type="primary">Stansiya qo'shish</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
            <Input
              placeholder="Stansiya nomi bo'yicha qidirish"
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
            dataSource={Array.isArray(allStations) ? allStations.map((item) => ({
              ...item,
              key: item?.id,
            })) : []}
            loading={isStationsLoading ? customLoader : false}
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
          isLoading={isStationDeleteLoading}
          onConfirm={handleDelete}
          title="Stansiyani o'chirish?"
          message="Bu stansiyani o'chirmoqchimisiz?"
          dangerMessage="Barcha stansiya ma'lumotlari qayta tiklanmaydi."
        />
      </div>
    </section>
  );
}

export default Stations;

