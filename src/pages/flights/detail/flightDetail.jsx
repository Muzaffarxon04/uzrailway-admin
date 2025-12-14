// import { useState, useEffect } from "react";
import { Card, Table, Descriptions, Breadcrumb, Button, Spin, Tag } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../consts/variables";
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

  const getStatusLabel = (status) => {
    const statusLabels = {
      scheduled: "Rejalashtirilgan",
      boarding: "O'tirish",
      departed: "Jo'nab ketgan",
      in_transit: "Yo'lda",
      arrived: "Yetib kelgan",
      delayed: "Kechikkan",
      cancelled: "Bekor qilingan",
      completed: "Yakunlangan",
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      scheduled: "blue",
      boarding: "orange",
      departed: "cyan",
      in_transit: "purple",
      arrived: "green",
      delayed: "gold",
      cancelled: "red",
      completed: "green",
    };
    return statusColors[status] || "default";
  };

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
          <Descriptions.Item label="ID">
            {trip?.id || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Reys raqami">
            {trip?.trip_number || "-"}
          </Descriptions.Item>
          
          <Descriptions.Item label="Reys sanasi">
            {trip?.trip_date 
              ? dayjs(trip.trip_date).format("DD.MM.YYYY") 
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {trip?.status ? (
              <Tag color={getStatusColor(trip.status)}>
                {getStatusLabel(trip.status)}
              </Tag>
            ) : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Poyezd raqami">
            {trip?.train?.train_number || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Poyezd nomi">
            {trip?.train?.train_name || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Poyezd turi">
            {trip?.train?.train_type || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Vagonlar soni">
            {trip?.train?.wagon_count || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Jami sig'im">
            {trip?.train?.total_capacity || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Marshrut nomi">
            {trip?.route_name || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Jo'nash stanstiyasi">
            {trip?.departure_station || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Etib borish stanstiyasi">
            {trip?.arrival_station || "-"}
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

          <Descriptions.Item label="Haqiqiy jo'nash vaqti">
            {trip?.actual_departure 
              ? dayjs(trip.actual_departure).format("DD.MM.YYYY HH:mm") 
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Haqiqiy etib borish vaqti">
            {trip?.actual_arrival 
              ? dayjs(trip.actual_arrival).format("DD.MM.YYYY HH:mm") 
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Davomiyligi">
            {trip?.duration_hours ? `${trip.duration_hours} soat` : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Asosiy narx">
            {trip?.base_price ? `${parseFloat(trip.base_price).toLocaleString()} so'm` : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Bo'sh o'rindiqlar">
            {trip?.available_seats ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Band qilingan o'rindiqlar">
            {trip?.booked_seats ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Bandlik foizi">
            {trip?.occupancy_percentage ? `${trip.occupancy_percentage}%` : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Faol">
            {trip?.is_active !== undefined ? (
              <Tag color={trip.is_active ? "green" : "red"}>
                {trip.is_active ? "Ha" : "Yo'q"}
              </Tag>
            ) : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Yaratuvchi">
            {trip?.created_by?.full_name || trip?.created_by?.username || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Topshiriqlar soni">
            {trip?.assignments_count ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Yaratilgan vaqti" span={2}>
            {trip?.created_at 
              ? dayjs(trip.created_at).format("DD.MM.YYYY HH:mm") 
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Yangilangan vaqti" span={2}>
            {trip?.updated_at 
              ? dayjs(trip.updated_at).format("DD.MM.YYYY HH:mm") 
              : "-"}
          </Descriptions.Item>

          {trip?.notes && (
            <Descriptions.Item label="Qo'shimcha ma'lumotlar" span={2}>
              {trip.notes}
            </Descriptions.Item>
          )}

          {trip?.cancellation_reason && (
            <Descriptions.Item label="Bekor qilish sababi" span={2}>
              {trip.cancellation_reason}
            </Descriptions.Item>
          )}
        </Descriptions>

        {trip?.attendance_stats && (
          <div style={{ marginTop: 24, marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
              Davomat statistikasi
            </h3>
            <Descriptions 
              bordered 
              column={2}
              labelStyle={{ fontWeight: 600, width: "200px" }}
            >
              <Descriptions.Item label="Jami">
                {trip.attendance_stats?.total || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Hozir">
                {trip.attendance_stats?.present || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Yo'q">
                {trip.attendance_stats?.absent || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Kechikkan">
                {trip.attendance_stats?.late || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Davomat foizi" span={2}>
                {trip.attendance_stats?.attendance_rate 
                  ? `${trip.attendance_stats.attendance_rate}%` 
                  : "0%"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}

        {Array.isArray(trip?.intermediate_stations) && trip.intermediate_stations.length > 0 && (
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
        )}
      </Card>
    </section>
  );
}

export default FlightDetail;

