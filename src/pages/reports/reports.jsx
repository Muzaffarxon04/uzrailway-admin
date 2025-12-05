import { useState, useEffect } from "react";
import {Breadcrumb, Pagination, Table, Button } from "antd";
import Icon from "../../components/Icon";
import { useLocalization } from "../../LocalizationContext";
import useUniversalFetch from "../../Hooks/useApi";
import { BASE_URL } from "../../consts/variables";
import { useSearchParams, Link } from "react-router-dom";
import LoadingOutlined from "@ant-design/icons";
import { useNotification } from "../../components/notification";

import dayjs from "dayjs";
import DeleteConfirmModal from "../../components/modals/deleteConfirm";

function Cashback() {

  const { t } = useLocalization();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentClient, setCurrentClient] = useState([]);
  const showNotification = useNotification();
 
  
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ Hook to manage URL parameters
  const { useFetchQuery, useFetchMutation } = useUniversalFetch();
  
  const accessToken = localStorage.getItem("access_token");
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 100;
  const searchValue = searchParams.get("search") || "";
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
      "reports-conflict",
      pagination.current,
      pagination.pageSize,
      searchValue,
    ],
    url: `${BASE_URL}/admin/reports/conflict/pagination`,
    params: {
      page_size: pagination.pageSize,
      page: pagination.current,
      search: searchValue,
    },
    token: accessToken,
  });
  const {
    data: clientDeleteData,
    isSuccess: isSuccessDeleted,
    mutate: clientDelete,
    isPending: isClientDeleteLoading,
    error: clientDeleteError,
    isError: isClientDeleteError,
  } = useFetchMutation({
    url: `${BASE_URL}/admin/reports/conflict`,
    method: "DELETE",
    token: accessToken,
  });

  const allPartners = fetchedPartnersData?.data || [];

  const handleDelete = () => {
    const body = {
      ids: currentClient,
    };
    clientDelete(JSON.stringify(body));
  };



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

    useEffect(() => {
      if (isSuccessDeleted) {
        refetchData();
        showNotification(
          "success",
          t("messages").delete_success,
          clientDeleteData?.message || t("messages").success
        );
        setCurrentClient([]);
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


 const columns = [
        {
         title: `${t("Partner_infos").file_name}`,
         dataIndex: "file_name",
         width: 200,
         render: (_, record) => (
           <Link to={`/reports/${record?.id}`} className="table_name">
             <p>{record?.file_name}</p>
           </Link>
         ),
       },
       
//        {
//          title: `${t("Partner_infos").message
// }`,
//          dataIndex: "message",
//          minWidth: 100,
//          render: (_, record) => (
 
//             <span className="table_name">
//           <Popover placement="bottom" content={record?.message}>
//             <p>{record?.message}</p>
//           </Popover>
//         </span>
//          ),
//        },

   
         {
         title: `${t("Partner_infos").date}`,
         dataIndex: "created_at",
         width: 300,
         render: (_, record) => (
           <span className="table_mfo">
             <p>{dayjs(+record?.created_at).format("MM/DD/YYYY")}</p>
           </span>
         ),
       },

           {
      title: `${t("Partner_infos").action}`,
      dataIndex: "action",
      render: (_, record) => (
        <span className="action_wrapper" >
       
          <Icon
            icon="ic_trash"
            className="icon trash"
            onClick={(e) => {
              e.stopPropagation();
              // your delete logic here
              setModalVisible(true);
              setCurrentClient([record.id]);
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
            <h2>{t("Pages").reports}</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: `${t("Partner_infos").reports_list}`,
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
    
               <Button onClick={() => setModalVisible(true)} disabled={currentClient.length < 1 } icon={ <Icon
              icon="ic_trash"
              className="icon trash"
              
            />} type="primary">{t("Pages").action?.delete_report}</Button>
        
     
        </div>
            
      </div>
      <div className="main">
   
        <div className="table_wrapper">
          <Table
            rowKey="id"
  rowSelection={{
    selectedRowKeys: currentClient,
    onChange: (selectedRowKeys) => {
      setCurrentClient(selectedRowKeys);
    },
  }}
  
            columns={columns}
            dataSource={allPartners}
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
          onChange={handlePaginationChange}
          style={{ marginTop: 20, textAlign: "center" }}
          locale={{ items_per_page: `/ ${t("Common").page}` }}
        />     <DeleteConfirmModal
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

export default Cashback;
