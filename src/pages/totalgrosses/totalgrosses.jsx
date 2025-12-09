import { useState, useEffect } from "react";
import { Input, Table, Pagination, Breadcrumb, Button, DatePicker } from "antd";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import { BASE_URL } from "../../consts/variables";
import useUniversalFetch from "../../Hooks/useApi";
import DeleteConfirmModal from "../../components/modals/deleteConfirm";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../LocalizationContext";
import { useNotification } from "../../components/notification";
import dayjs from "dayjs";

function Cashback() {
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ Hook to manage URL parameters
  const { useFetchQuery, useDeleteMutation } = useUniversalFetch();
        const navigate = useNavigate();
    const [dates, setDates] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  const showNotification = useNotification();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 50;
  const searchValue = searchParams.get("search") || "";
  const { t } = useLocalization();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: pageSize,
    total: 0,
  });

  // ✅ Fetch partners with dynamic pagination & search params
  const {
    data: fetchedPartnersData,
    isPending: isPartnersLoading,
    refetch: refetchData,
  } = useFetchQuery({
    queryKey: [
      "total-grosses",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `${BASE_URL}/total-grosses/pagination`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      search: searchValue,
       from: dates[0] || "", // Start date timestamp
      to: dates[1] || "", // End date timestamp
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
    url: `${BASE_URL}/total-grosses`,
    method: "DELETE",
    token: accessToken,
  });

  const handleDelete = () => {
    clientDelete({
      id: currentClient,
    });
  };


   const handleDateChange = (dates, dateStrings) => {
    if (dates) {
      const startTimestamp = dates[0].valueOf(); // milliseconds
      const endTimestamp = dates[1].valueOf();   // milliseconds

      setDates([startTimestamp, endTimestamp]);
    } else {
      setDates([]);
      console.log('No dates selected');
    }
  };

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

  // ✅ Search logic with URL params update
  const onSearch = (value) => {
    // searchParams.append("search", value);
    setPagination((prev) => ({ ...prev, current: 1 }));

    setSearchParams({
      page: 1,
      pageSize: pagination.pageSize,
      search: value.trim() || "",
    });
  };

 const columns = [
        {
         title: `${t("Partner_infos").driver_fullname}`,
         dataIndex: "driver_fullname",
         width: 200,
         render: (_, record) => (
           <span className="table_name">
             <p>{record?.driver_fullname}</p>
           </span>
         ),
       },
       
       {
         title: `${t("Partner_infos").load_number}`,
         dataIndex: "load_number",
         minWidth: 100,
         render: (_, record) => (
           <span className="table_name">
            
               <p>{record?.load_number}</p>
         
           </span>
         ),
       },
            {
         title: `${t("Partner_infos").loaded_miles}`,
         dataIndex: "loaded_miles",
         minWidth: 100,
         render: (_, record) => (
           <span className="table_name">
            
               <p>{record?.loaded_miles}</p>
         
           </span>
         ),
       },
            {
         title: `${t("Partner_infos").pu}`,
         dataIndex: "pu",
         minWidth: 100,
         render: (_, record) => (
           <span className="table_name">
            
               <p>{record?.pu}</p>
         
           </span>
         ),
       },
                {
         title: `${t("Partner_infos").total_miles}`,
         dataIndex: "total_miles",
         minWidth: 100,
         render: (_, record) => (
           <span className="table_name">
            
               <p>{record?.total_miles}</p>
         
           </span>
         ),
       },
   
            {
         title: `${t("Partner_infos").empty_miles}`,
         dataIndex: "empty_miles",
         width: 200,
         render: (_, record) => (
           <span className="table_mfo">
             <p>{record?.empty_miles}</p>
           </span>
         ),
       },
         {
         title: `${t("Partner_infos").del}`,
         dataIndex: "del",
         width: 200,
         render: (_, record) => (
           <span className="table_mfo">
             <p>{record?.del}</p>
           </span>
         ),
       },

           {
         title: `${t("Partner_infos").gross}`,
         dataIndex: "gross",
         width: 200,
         render: (_, record) => (
           <span className="table_mfo">
             <p>{record?.gross}</p>
           </span>
         ),
       },
      
           {
      title: `${t("Partner_infos").truck_id}`,
      dataIndex: "truck_id",
      width: 200,
      render: (_, record) => (
        <span className="table_mfo">
          <p>{record?.truck_id}</p>
        </span>
      ),
    },
     
         {
         title: `${t("Partner_infos").date}`,
         dataIndex: "mfo",
         width: 300,
         render: (_, record) => (
           <span className="table_mfo">
             <p>{dayjs(+record?.del_date).format("MM/DD/YYYY")}</p>
           </span>
         ),
       },
   

    {
      title: `${t("Partner_infos").action}`,
      dataIndex: "action",
      width: 60,

      render: (_, record) => (
        <span className="action_wrapper">
                 <Icon
            icon="ic_edit"
            className="icon edit"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/totalgrosses/${record.id}`);
            }}
          />
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
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
            <h2>{t("Pages").totalgrosses}</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: `${t("Partner_infos").totalgross_list}`,
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
             <div className="filter">
            <Link to={`/totalgrosses/add`}>
              <Button type="primary">{t("Partner_infos")?.add_total_grosses}</Button>

            </Link>
          </div>
        </div>
      </div>
      <div className="main partners_table">
        <div className="filters_area">
          <div className="item">
            <Input
                         placeholder={t("Common").search_placeholder + ", load_number"}

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
                 <div className="item">

            <DatePicker.RangePicker       format="MM/DD/YYYY" style={{height:40}} onChange={handleDateChange}/>
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
          total={fetchedPartnersData?.total_count || 0}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100', '200']}
          onChange={handlePaginationChange}
          style={{ marginTop: 20, textAlign: "center" }}
          locale={{ items_per_page: `/ ${t("Common").page}` }}
        />
        <DeleteConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          isLoading={isClientDeleteLoading}
          onConfirm={handleDelete}
          title={t("messages").delete_payment}
          message={t("messages").delete_9}
          dangerMessage={t("messages").delete_8}
        />
      </div>
    </section>
  );
}

export default Cashback;
