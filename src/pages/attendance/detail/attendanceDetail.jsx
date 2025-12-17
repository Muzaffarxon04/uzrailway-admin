import React from "react";
import { Breadcrumb, Button, Card, Descriptions, Spin, Tag } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../../components/Icon";
import useUniversalFetch from "../../../Hooks/useApi";
import dayjs from "dayjs";

function AttendanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useFetchQuery } = useUniversalFetch();
  const accessToken = localStorage.getItem("access_token");

  const {
    data: attendanceData,
    isPending: isLoading,
  } = useFetchQuery({
    queryKey: ["attendance-detail", id],
    url: `attendance/detail/${id}/`,
    token: accessToken,
  });

  const attendance = attendanceData?.data || attendanceData || {};
  const assignment = attendance?.assignment || {};
  const trip = attendance?.trip || assignment?.trip || attendance?.trip_info || {};
  const employee = attendance?.employee || assignment?.employee || {};
  const verifiedBy = attendance?.verified_by || {};

  const statusLabels = {
    present: "Hozir",
    absent: "Yo'q",
    late: "Kechikkan",
    on_time: "Vaqtida",
  };

  const statusColors = {
    present: "green",
    absent: "red",
    late: "orange",
    on_time: "blue",
  };

  const assignmentStatusLabels = {
    assigned: "Tayinlangan",
    confirmed: "Tasdiqlangan",
    declined: "Rad etilgan",
    completed: "Yakunlangan",
    cancelled: "Bekor qilingan",
  };

  const assignmentStatusColors = {
    assigned: "blue",
    confirmed: "green",
    declined: "orange",
    completed: "default",
    cancelled: "red",
  };

  const formatDate = (value, withTime = false) =>
    value ? dayjs(value).format(withTime ? "DD.MM.YYYY HH:mm" : "DD.MM.YYYY") : "-";

  const getEmployeeName = (emp) => {
    if (!emp) return "-";
    if (emp.full_name) return emp.full_name;
    if (emp.fullname) return emp.fullname;
    const full = [emp.firstName, emp.lastName].filter(Boolean).join(" ").trim();
    return full || emp.username || "-";
  };

  const formatStation = (station) => {
    if (!station) return "-";
    if (typeof station === "object") {
      return station.name || station.address || `ID: ${station.id ?? "-"}`;
    }
    return station;
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      driver: "Haydovchi",
      assistant_driver: "Yordamchi haydovchi",
      conductor: "Konduktor",
      senior_conductor: "Katta konduktor",
      engineer: "Muhandis",
      attendant: "Kuzatuvchi",
      security: "Xavfsizlik",
    };
    return roleLabels[role] || role || "-";
  };

  const getCheckMethodLabel = (method) => {
    const methodLabels = {
      faceid: "Face ID",
      manual: "Qo'lda",
      qrcode: "QR kod",
    };
    return methodLabels[method] || method || "-";
  };

  if (isLoading) {
    return (
      <section className="page partners">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 44 }} spin />} />
        </div>
      </section>
    );
  }

  return (
    <section className="page partners">
      <div className="header" style={{ minHeight: "100px" }}>
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Davomat ma'lumotlari</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Davomat ro'yxati",
                    href: "/attendance",
                  },
                  {
                    title: `#${attendance?.id || id}`,
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Button onClick={() => navigate("/attendance")} style={{ marginRight: 8 }}>
              Orqaga
            </Button>
            
          </div>
        </div>
      </div>

      <div className="main">
        <Card style={{ marginTop: 16, borderRadius: 8 }}>
          <Descriptions
            title="Asosiy ma'lumotlar"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            labelStyle={{ fontWeight: 600 }}
          >
            <Descriptions.Item label="ID">#{attendance?.id || "-"}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {attendance?.status ? (
                <Tag color={statusColors[attendance.status] || "default"}>
                  {statusLabels[attendance.status] || attendance.status}
                </Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Tekshirish usuli">
              {getCheckMethodLabel(attendance?.check_method)}
            </Descriptions.Item>
            <Descriptions.Item label="Kechikish">
              <Tag color={attendance?.is_late ? "orange" : "green"}>
                {attendance?.is_late ? "Kechikkan" : "Vaqtida"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Kechikish (daq)">
              {attendance?.late_duration_minutes ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="FaceID ishonchliligi">
              {attendance?.faceid_confidence ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Kelish vaqti">
              {formatDate(attendance?.check_in_time, true)}
            </Descriptions.Item>
            <Descriptions.Item label="Ketish vaqti">
              {formatDate(attendance?.check_out_time, true)}
            </Descriptions.Item>

            <Descriptions.Item label="Kelish joyi">
              {attendance?.check_in_location || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Koordinatalar">
              {attendance?.check_in_coordinates 
                ? typeof attendance.check_in_coordinates === 'string'
                  ? attendance.check_in_coordinates
                  : Array.isArray(attendance.check_in_coordinates)
                  ? attendance.check_in_coordinates.join(", ")
                  : JSON.stringify(attendance.check_in_coordinates)
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Yo'qlik sababi" span={2}>
              {attendance?.absence_reason || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Izoh" span={2}>
              {attendance?.notes || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tasdiqlangan vaqti">
              {formatDate(attendance?.verified_at, true)}
            </Descriptions.Item>
            <Descriptions.Item label="Tasdiqlagan">
              {getEmployeeName(verifiedBy)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginTop: 16, borderRadius: 8 }}>
          <Descriptions
            title="Xodim"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            labelStyle={{ fontWeight: 600 }}
          >
            <Descriptions.Item label="Xodim">
              {getEmployeeName(employee)}
            </Descriptions.Item>
            <Descriptions.Item label="Telefon">
              {employee?.phone_number || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {employee?.email || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Lavozim">
              {employee?.position_name || employee?.position || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Bo'lim">
              {employee?.department?.name || employee?.department_name || (typeof employee?.department === 'string' ? employee.department : "-")}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {employee?.username || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginTop: 16, borderRadius: 8 }}>
          <Descriptions
            title="Topshiriq"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            labelStyle={{ fontWeight: 600 }}
          >
            <Descriptions.Item label="Topshiriq ID">
              {assignment?.id || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {assignment?.status ? (
                <Tag color={assignmentStatusColors[assignment.status] || "default"}>
                  {assignmentStatusLabels[assignment.status] || assignment.status}
                </Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Rol">
              {getRoleLabel(assignment?.role)}
            </Descriptions.Item>
            <Descriptions.Item label="Vagon">
              {assignment?.wagon_number ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tayinlangan vaqti">
              {formatDate(assignment?.assignment_date, true)}
            </Descriptions.Item>
            <Descriptions.Item label="Tasdiqlangan vaqti">
              {formatDate(assignment?.confirmed_at, true)}
            </Descriptions.Item>
            <Descriptions.Item label="Izoh">
              {assignment?.notes || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Maxsus ko'rsatmalar">
              {assignment?.special_instructions || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tayinlagan">
              {getEmployeeName(assignment?.assigned_by)}
            </Descriptions.Item>
            <Descriptions.Item label="Davomat ma'lumotlari">
              {assignment?.attendance ? (
                <div>
                  <Tag color={statusColors[assignment.attendance.status] || "default"}>
                    {statusLabels[assignment.attendance.status] || assignment.attendance.status}
                  </Tag>
                  {assignment.attendance.check_in_time && (
                    <div style={{ marginTop: 4, fontSize: 12 }}>
                      Kelish: {formatDate(assignment.attendance.check_in_time, true)}
                    </div>
                  )}
                </div>
              ) : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginTop: 16, borderRadius: 8, marginBottom: 12 }}>
          <Descriptions
            title="Reys"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            labelStyle={{ fontWeight: 600 }}
          >
            <Descriptions.Item label="Reys raqami">
              {trip?.trip_number || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Marshrut">
              {trip?.route_name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Jo'nash stansiyasi">
              {trip?.departure_station?.name || formatStation(trip?.departure_station)}
            </Descriptions.Item>
            <Descriptions.Item label="Etib borish stansiyasi">
              {trip?.arrival_station?.name || formatStation(trip?.arrival_station)}
            </Descriptions.Item>
            <Descriptions.Item label="Jo'nash vaqti">
              {formatDate(trip?.scheduled_departure, true)}
            </Descriptions.Item>
            <Descriptions.Item label="Etib borish vaqti">
              {formatDate(trip?.scheduled_arrival, true)}
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
            <Descriptions.Item label="Holat">
              <Tag color={
                trip?.status === "scheduled" ? "blue" :
                trip?.status === "departed" ? "orange" :
                trip?.status === "arrived" ? "green" :
                trip?.status === "cancelled" ? "red" : "default"
              }>
              {trip?.status || "-"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Reys sanasi">
              {formatDate(trip?.trip_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Davomiyligi">
              {trip?.duration_hours ? `${trip.duration_hours} soat` : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Asosiy narx">
              {trip?.base_price ? `${parseFloat(trip.base_price).toLocaleString()} so'm` : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Bandlik foizi">
              {trip?.occupancy_percentage ? `${trip.occupancy_percentage}%` : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Haqiqiy jo'nash vaqti">
              {formatDate(trip?.actual_departure, true)}
            </Descriptions.Item>
            <Descriptions.Item label="Haqiqiy etib borish vaqti">
              {formatDate(trip?.actual_arrival, true)}
            </Descriptions.Item>
            {trip?.notes && (
              <Descriptions.Item label="Izoh" span={2}>
                {trip.notes}
              </Descriptions.Item>
            )}
            {trip?.cancellation_reason && (
              <Descriptions.Item label="Bekor qilish sababi" span={2}>
                {trip.cancellation_reason}
              </Descriptions.Item>
            )}
            {trip?.created_by && (
              <Descriptions.Item label="Yaratuvchi" span={2}>
                {getEmployeeName(trip.created_by)}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {Array.isArray(trip?.intermediate_stations) && trip.intermediate_stations.length > 0 && (
          <Card style={{ marginTop: 16, borderRadius: 8, marginBottom: 12 }}>
            <Descriptions
              title="O'rta stanstiyalar"
              bordered
              column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
              labelStyle={{ fontWeight: 600 }}
            >
              {trip.intermediate_stations.map((station, index) => (
                <React.Fragment key={index}>
                  <Descriptions.Item label={`${index + 1}. Stanstiya`}>
                    {station?.name || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kelish vaqti">
                    {station?.arrival || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jo'nash vaqti">
                    {station?.departure || "-"}
                  </Descriptions.Item>
                </React.Fragment>
              ))}
            </Descriptions>
          </Card>
        )}
      </div>
    </section>
  );
}

export default AttendanceDetail;


