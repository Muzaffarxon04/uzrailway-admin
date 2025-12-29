// import { useState, useEffect } from "react";
import { Card, Table, Descriptions, Breadcrumb, Button, Spin, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
// import { BASE_URL } from "../../../consts/variables";
import useUniversalFetch from "../../../Hooks/useApi";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { useFetchQuery } = useUniversalFetch();

  const {
    data: tripData,
    isPending: isTripLoading,
  } = useFetchQuery({
    queryKey: [`trip-detail`, id],
    url: `trips/detail/${id}/`,
    token: accessToken,
  });

  const trip = tripData?.data || tripData || {};

  // const getStatusLabel = (status) => {
  //   const statusLabels = {
  //     scheduled: "Rejalashtirilgan",
  //     boarding: "O'tirish",
  //     departed: "Jo'nab ketgan",
  //     in_transit: "Yo'lda",
  //     arrived: "Yetib kelgan",
  //     delayed: "Kechikkan",
  //     cancelled: "Bekor qilingan",
  //     completed: "Yakunlangan",
  //   };
  //   return statusLabels[status] || status;
  // };

  // const getStatusColor = (status) => {
  //   const statusColors = {
  //     scheduled: "blue",
  //     boarding: "orange",
  //     departed: "cyan",
  //     in_transit: "purple",
  //     arrived: "green",
  //     delayed: "gold",
  //     cancelled: "red",
  //     completed: "green",
  //   };
  //   return statusColors[status] || "default";
  // };

  const intermediateStationsColumns = [
    {
      title: "№",
      dataIndex: "index",
      width: 60,
      render: (_, record, index) => (
        <span>{index + 1}</span>
      ),
    },
    {
      title: "Stanstiya nomi",
      dataIndex: "name",
      minWidth: 200,
      render: (_, record) => (
        <span>{record?.name || "-"}</span>
      ),
    },
    {
      title: "Kelish vaqti",
      dataIndex: "arrival",
      width: 150,
      render: (_, record) => (
        <span>{record?.arrival || "-"}</span>
      ),
    },
    {
      title: "Jo'nash vaqti",
      dataIndex: "departure",
      width: 150,
      render: (_, record) => (
        <span>{record?.departure || "-"}</span>
      ),
    },
  ];

  if (isTripLoading) {
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
    <section className="page partners flights-detail">
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
                    title: trip?.trip_number || "Reys ma'lumotlari",
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
        
      
    
        

          <Descriptions.Item label="Jo'nash stanstiyasi">
            {trip?.departure_station?.name || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Etib borish stanstiyasi">
            {trip?.arrival_station?.name || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Rejalashtirilgan jo'nash vaqti">
            {trip?.scheduled_departure 
              ? dayjs(trip.scheduled_departure).format("DD.MM.YYYY HH:mm") 
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Rejalashtirilgan etib borish vaqti">
            {trip?.scheduled_arrival 
              ? dayjs(trip.scheduled_arrival).format("DD.MM.YYYY HH:mm") 
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Poyezd raqami">
            {trip?.train?.train_number || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Faol">
            {trip?.is_active !== undefined ? (
              <Tag color={trip.is_active ? "green" : "red"}>
                {trip.is_active ? "Ha" : "Yo'q"}
              </Tag>
            ) : "-"}
          </Descriptions.Item>

        

      
        </Descriptions>

        {Array.isArray(trip?.intermediate_stations) && trip.intermediate_stations.length > 0 ? (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
              O'rta stanstiyalar ({trip.intermediate_stations.length})
            </h3>
            <Table
              dataSource={trip.intermediate_stations.map((item, index) => ({
                ...item,
                key: index,
              }))}
              columns={intermediateStationsColumns}
              rowKey="key"
              pagination={false}
              bordered
              locale={{
                emptyText: "O'rta stanstiyalar mavjud emas",
              }}
            />
          </div>
        ) : null}

        {Array.isArray(trip?.assigned_employees) && trip.assigned_employees.length > 0 ? (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
              Tayinlangan xodimlar ({trip.assigned_employees.length})
            </h3>
            <Table
              dataSource={trip.assigned_employees.map((item, index) => ({
                ...item,
                key: item?.id || index,
              }))}
              columns={[
                {
                  title: "№",
                  dataIndex: "index",
                  width: 60,
                  render: (_, record, index) => <span>{index + 1}</span>,
                },
                // {
                //   title: "ID",
                //   dataIndex: "id",
                //   width: 80,
                //   render: (_, record) => <span>#{record?.id || "-"}</span>,
                // },
                // {
                //   title: "Xodim ID",
                //   dataIndex: "employee_id",
                //   width: 100,
                //   render: (_, record) => <span>{record?.employee_id || "-"}</span>,
                // },
                {
                  title: "Ism",
                  dataIndex: "name",
                  minWidth: 200,
                  render: (_, record) => {
                    const name = `${record?.firstName || ""} ${record?.lastName || ""}`.trim();
                    return <span>{name || "-"}</span>;
                  },
                },
                {
                  title: "Lavozim ID",
                  dataIndex: "position",
                  width: 100,
                  render: (_, record) => <span>{record?.position || "-"}</span>,
                },
             
                {
                  title: "Kelish vaqti",
                  dataIndex: "attendance",
                  width: 170,
                  render: (_, record) => {
                    const checkInTime = record?.attendance?.check_in_time;
                    return checkInTime 
                      ? dayjs(checkInTime).format("DD.MM.YYYY HH:mm")
                      : "-";
                  },
                },
                {
                  title: "Ketish vaqti",
                  dataIndex: "attendance",
                  width: 170,
                  render: (_, record) => {
                    const checkOutTime = record?.attendance?.check_out_time;
                    return checkOutTime 
                      ? dayjs(checkOutTime).format("DD.MM.YYYY HH:mm")
                      : "-";
                  },
                },
                // {
                //   title: "Tekshirish usuli",
                //   dataIndex: "attendance",
                //   width: 130,
                //   render: (_, record) => {
                //     const method = record?.attendance?.check_method;
                //     const methodLabels = {
                //       faceid: "Face ID",
                //       manual: "Qo'lda",
                //       qrcode: "QR kod",
                //     };
                //     return method ? (methodLabels[method] || method) : "-";
                //   },
                // },
                {
                  title: "Kelish joyi",
                  dataIndex: "attendance",
                  minWidth: 150,
                  render: (_, record) => {
                    return record?.attendance?.check_in_location || "-";
                  },
                },
                {
                  title: "Ketish joyi",
                  dataIndex: "attendance",
                  minWidth: 150,
                  render: (_, record) => {
                    return record?.attendance_status?.check_out_location || "-";
                  },
                },
                {
                  title: "Davomat statusi",
                  dataIndex: "attendance",
                  width: 150,
                  render: (_, record) => {
                    const attendance = record?.attendance;
                    if (!attendance) {
                      return <Tag color="default">Kelmadi</Tag>;
                    }
                    const statusColors = {
                      check_in: "green",
                      absent: "red",
                      late: "orange",
                      pending: "blue",
                      check_out: "cyan",
                    };
                    const statusLabels = {
                      check_in: "Keldi",
                      absent: "Kelmadi",
                      late: "Kechikdi",
                      pending: "Kutilmoqda",
                      check_out: "Ketdi",
                    };
                    return (
                      <Tag color={statusColors[attendance.status] || "default"}>
                        {statusLabels[attendance.status] || attendance.status}
                      </Tag>
                    );
                  },
                },
                {
                  title: "Kechikish",
                  dataIndex: "attendance",
                  width: 120,
                  render: (_, record) => {
                    const attendance = record?.attendance;
                    if (!attendance) return "-";
                    return attendance.is_late ? (
                      <div>
                        <Tag color="orange">Ha</Tag>
                        {attendance.late_duration_minutes && (
                          <div style={{ fontSize: 12, marginTop: 4 }}>
                            {attendance.late_duration_minutes} daq
                          </div>
                        )}
                      </div>
                    ) : (
                      <Tag color="green">Yo'q</Tag>
                    );
                  },
                },
                {
                  title: "Тасдиқлаш.",
                  dataIndex: "attendance",
                  width: 100,
                  render: (_, record) => {
                    const attendance = record?.attendance;
                    const isConfirmed = attendance?.status === "check_out";

                    const icon = isConfirmed ? (
                      <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 18 }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />
                    );

                    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>;
                  },
                },
               
              ]}
              rowKey="key"
              pagination={false}
              bordered
              scroll={{ x: "max-content" }}
              locale={{
                emptyText: "Tayinlangan xodimlar mavjud emas",
              }}
            />
          </div>
        ) : null}
      </Card>
    </section>
  );
}

export default FlightDetail;

