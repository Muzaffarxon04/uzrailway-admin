import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Pagination,
  Breadcrumb,
  Popover,
} from "antd";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import { BASE_URL } from "../../consts/variables";
import useUniversalFetch from "../../Hooks/useApi";
import DeleteConfirmModal from "../../components/modals/deleteConfirm";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import { useNotification } from "../../components/notification";

function Partners() {
  
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ Hook to manage URL parameters
  const { useFetchQuery, useDeleteMutation } = useUniversalFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  

  
  const showNotification = useNotification();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 100;

  const searchValue = searchParams.get("search") || "";
  const { t } = useLocalization();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  const {
    data: fetchedPartnersData,
    isPending: isPartnersLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "admins",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `${BASE_URL}/executer/pagination`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      search: searchValue,
    },
    token: accessToken,
  });

 

  const allPartners = fetchedPartnersData?.data || [];

  const {
    data: clientDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: clientDelete,
    isPending: isClientDeleteLoading,
    error: clientDeleteError,
    isError: isClientDeleteError,
  } = useDeleteMutation({
    url: `${BASE_URL}/executer`,
    method: "DELETE",
    token: accessToken,
  });

  const handleDelete = () => {
    clientDelete({
      id: currentClient,
    });
  };

useEffect(()=> {
if (location.pathname) {
  refetchData()
}
// eslint-disable-next-line react-hooks/exhaustive-deps
},[location.pathname])

  useEffect(() => {
    if (isSuccessDeleted) {
      refetchData();
      showNotification(
        "success",
        t("messages").delete_success,
        clientDeleteData?.message || t("messages").success
      );
      setCurrentClient(null);
      setModalVisible(false);
    } else if (isClientDeleteError) {
      showNotification(
        "error",
        t("messages").error_2,
        clientDeleteError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, clientDeleteError, isClientDeleteError]);

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
      title: `${t("Partner_infos").client_name}`,
      dataIndex: "name",
      minWidth: 100,
      render: (_, record) => (
        <span className="table_name">
          <Popover placement="bottom" content={record?.full_name}>
            <p>{record?.full_name}</p>
          </Popover>
        </span>
      ),
    },
    {
      title: `${t("Partner_infos").phone_number}`,
      dataIndex: "number",
      width: 150,
      render: (_, record) => (
        <span className="table_phone_number">
          <a href={`tel:${record?.phone_number}`}>{record?.phone_number}</a>
        </span>
      ),
    },
    // {
    //   title: `${t("Partner_infos").email}`,
    //   dataIndex: "mfo",
    //   // width: 90,
    //   render: (_, record) => (
    //     <span className="table_mfo">
    //       <p>{record?.email}</p>
    //     </span>
    //   ),
    // },
        {
      title: `${t("Partner_infos").role}`,
      dataIndex: "mfo",
      // width: 90,
      render: (_, record) => (
        <span className="table_mfo">
          <p>{record?.role}</p>
        </span>
      ),
    },
        {
      title: `${t("Partner_infos").username}`,
      dataIndex: "mfo",
      // width: 90,
      render: (_, record) => (
        <span className="table_mfo">
          <p>{record?.username}</p>
        </span>
      ),
    },

    {
      title: `${t("Partner_infos").action}`,
      dataIndex: "action",
      render: (_, record) => (
        <span className="action_wrapper">
          <Icon
            icon="ic_edit"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admins/${record.id}`);
            }}
          />
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              // your delete logic here
              setModalVisible(true);
              setCurrentClient(record.id);
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
    handleTableChange({ current: page, pageSize }); // Fetch new data if needed
  };

  return (
    <section className="page partners">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>{t("Pages").admins}</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: `${t("Partner_infos").partners_list}`,
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Link to={`/admins/add`}>
              <Button type="primary">{t("Pages").action?.add_client}</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
            <Input
              placeholder={t("Common").search_placeholder}
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
                // refetchData();
              }}
            />
          </div>
         
        </div>
        <div className="table_wrapper">
          <Table
            columns={columns}
            dataSource={allPartners.map((item) => ({
              ...item,
              key: item?.id,
            }))}
            loading={isPartnersLoading ? customLoader : false}
            pagination={false}
            onChange={handleTableChange}
          />
        </div>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={fetchedPartnersData?.total_elements || 0}
          showSizeChanger
          onChange={handlePaginationChange}
          style={{ marginTop: 20, textAlign: "center" }}
          locale={{ items_per_page: `/ ${t("Common").page}` }}
        />
        <DeleteConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          isLoading={isClientDeleteLoading}
          onConfirm={handleDelete}
          title={t("messages").delete_client}
          message={t("messages").delete_4}
          dangerMessage={t("messages").delete_5}
        />
      
      </div>
    </section>
  );
}

export default Partners;
