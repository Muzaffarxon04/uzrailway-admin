import React from 'react';
import { Card, Table, Descriptions, Breadcrumb } from 'antd';
import { BASE_URL } from '../../consts/variables';
import useUniversalFetch from '../../Hooks/useApi';
import { useLocation } from 'react-router-dom';
import { useLocalization } from '../../LocalizationContext';
import Icon from '../../components/Icon';
import dayjs from 'dayjs';
const InnerPage = () => {
  const accessToken = localStorage.getItem("access_token");
  const location = useLocation()
  const { t } = useLocalization();


  const {useFetchQuery} = useUniversalFetch();
    const {
      data: fetchedPartnersData,
      // isPending: isPartnersLoading,
      // refetch: refetchData,
    } = useFetchQuery({
      queryKey: [
        "reports-conflict",
      ],
      url: `${BASE_URL}/admin/reports/conflict/pagination`,
      token: accessToken,
    });
    
    
    const fileDataInital = fetchedPartnersData?.data;
    const fileData = fileDataInital?.find(item => item.id === location.pathname.split('/').pop());

  const columns = [
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    }
  ];

  return (
    <section >
        <div className="header">
          <div className="header_wrapper">
            <div className="page_info">
              <h2>
     PDF Discrepancy Details
                 
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: `${t("Pages").reports}`,
                      href: "/fueltransaction",
                    },
                    {
                      title:fileData?.file_name
                       ,
                      href: "",
                    },
                  ]}
                />
              </span>
            </div>
          </div>
        </div>
    <Card style={{ marginTop: '8px', borderRadius: 8 }}>

      <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="File Name">{fileData?.file_name}</Descriptions.Item>
        <Descriptions.Item label="Created at">{dayjs(+fileData?.created_at).format("MM/DD/YYYY")}</Descriptions.Item>
       
      </Descriptions>

      <Table
        dataSource={fileData?.items}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
      />
    </Card>
    </section>

  );
};

export default InnerPage;
