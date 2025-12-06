// import { useState, useEffect } from "react";
import { Card, Table, Descriptions, Breadcrumb, Button, Spin, Tag } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../consts/variables";
import useUniversalFetch from "../../../Hooks/useApi";
import { useLocalization } from "../../../LocalizationContext";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { t } = useLocalization();
  const { useFetchQuery } = useUniversalFetch();

  const {
    data: flightData,
    isPending: isFlightLoading,
  } = useFetchQuery({
    queryKey: [`train-schedule-detail`, id],
    url: `${BASE_URL}/train-schedule`,
    id: id,
    token: accessToken,
  });

  const flight = flightData?.data || flightData || {};

  const staffColumns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      render: (_, record, index) => (
        <span>{index + 1}</span>
      ),
    },
    {
      title: "Xodim",
      dataIndex: "employee",
      minWidth: 200,
      render: (_, record) => (
        <span>
          {record?.employee?.fullname || `ID: ${record?.employeeId}`}
        </span>
      ),
    },
    {
      title: "Telefon",
      dataIndex: "employee",
      width: 150,
      render: (_, record) => (
        <span>
         <a href={`tel:${record?.employee?.phone}`}>{record?.employee?.phone}</a>
        </span>
      ),
    },
    {
      title: "Rol",
      dataIndex: "role",
      width: 200,
      render: (_, record) => {
        const roleLabels = {
          train_chief: "Poyezd boshlig'i",
          wagon_supervisor: "Vagon nazoratchisi",
        };
        return <span>{roleLabels[record?.role] || record?.role}</span>;
      },
    },
    {
      title: "Ketish vaqti",
      dataIndex: "departureTime",
      width: 150,
      render: (_, record) => (
        <span>
          {record?.departureTime 
            ? dayjs(record.departureTime).format("DD.MM.YYYY HH:mm") 
            : "-"}
        </span>
      ),
    },
    {
      title: "Kelish vaqti",
      dataIndex: "arrivalTime",
      width: 150,
      render: (_, record) => (
        <span>
          {record?.arrivalTime 
            ? dayjs(record.arrivalTime).format("DD.MM.YYYY HH:mm") 
            : "-"}
        </span>
      ),
    },
    {
      title: "Ketish holati",
      dataIndex: "departureStatus",
      width: 150,
      render: (_, record) => {
        const statusLabels = {
          arrived: "Keldi",
          expected: "Kutilmoqda",
        };
        const statusColors = {
          arrived: "green",
          expected: "orange",
        };
        return record?.departureStatus ? (
          <Tag color={statusColors[record.departureStatus] || "default"}>
            {statusLabels[record.departureStatus] || record.departureStatus}
          </Tag>
        ) : "-";
      },
    },
    {
      title: "Kelish holati",
      dataIndex: "arrivalStatus",
      width: 150,
      render: (_, record) => {
        const statusLabels = {
          arrived: "Keldi",
          expected: "Kutilmoqda",
        };
        const statusColors = {
          arrived: "green",
          expected: "orange",
        };
        return record?.arrivalStatus ? (
          <Tag color={statusColors[record.arrivalStatus] || "default"}>
            {statusLabels[record.arrivalStatus] || record.arrivalStatus}
          </Tag>
        ) : "-";
      },
    },
  ];

  if (isFlightLoading) {
    return (
      <section className="page partners">
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "400px" 
        }}>
          <Spin 
            indicator={
              <LoadingOutlined 
                style={{ fontSize: 44 }} 
                spin 
              />
            } 
          />
        </div>
      </section>
    );
  }

  return (
    <section className="page partners">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Reys ma'lumotlari</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Reyslar ro'yxati",
                    href: "/flights",
                  },
                  {
                    title: flight?.trainNumber || "Reys ma'lumotlari",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Button 
              type="default" 
              onClick={() => navigate("/flights")}
              style={{ marginRight: 8 }}
            >
              Orqaga
            </Button>
            <Button 
              type="primary" 
              onClick={() => navigate(`/flights/${id}`)}
            >
              Tahrirlash
            </Button>
          </div>
        </div>
      </div>

      <Card style={{ marginTop: 16, borderRadius: 8 }}>
        <Descriptions 
          bordered 
          column={2} 
          style={{ marginBottom: 24 }}
          labelStyle={{ fontWeight: 600, width: "200px" }}
        >
          <Descriptions.Item label="ID">
            {flight?.id || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Poyezd raqami">
            {flight?.trainNumber || "-"}
          </Descriptions.Item>
          
          <Descriptions.Item label="Ketish stansiyasi">
            {flight?.departureStation?.name || `ID: ${flight?.departureStationId}` || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Kelish stansiyasi">
            {flight?.arrivalStation?.name || `ID: ${flight?.arrivalStationId}` || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Ketish vaqti">
            {flight?.departureTime || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Kelish vaqti">
            {flight?.arrivalTime || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Ketish sanasi">
            {flight?.departureDate 
              ? dayjs(flight.departureDate).format("DD.MM.YYYY") 
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Kelish sanasi">
            {flight?.arrivalDate 
              ? dayjs(flight.arrivalDate).format("DD.MM.YYYY") 
              : "-"}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
            Xodimlar ({flight?.staff?.length || 0})
          </h3>
          <Table
            dataSource={Array.isArray(flight?.staff) ? flight.staff.map((item, index) => ({
              ...item,
              key: item?.id || index,
            })) : []}
            columns={staffColumns}
            rowKey="key"
            pagination={false}
            bordered
            locale={{
              emptyText: "Xodimlar mavjud emas",
            }}
          />
        </div>
      </Card>
    </section>
  );
}

export default FlightDetail;

