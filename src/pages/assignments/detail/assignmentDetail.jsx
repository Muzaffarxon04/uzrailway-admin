import { Breadcrumb, Button, Card, Descriptions, Spin, Tag } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../../components/Icon";
import useUniversalFetch from "../../../Hooks/useApi";
import dayjs from "dayjs";

function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useFetchQuery } = useUniversalFetch();
  const accessToken = localStorage.getItem("access_token");

  const {
    data: assignmentData,
    isPending: isLoading,
  } = useFetchQuery({
    queryKey: ["assignment-detail", id],
    url: `assignments/detail/${id}/`,
    token: accessToken,
  });

  const assignment = assignmentData?.data || assignmentData || {};

  const roleLabels = {
    driver: "Haydovchi",
    assistant_driver: "Yordamchi haydovchi",
    conductor: "Konduktor",
    senior_conductor: "Katta konduktor",
    engineer: "Muhandis",
    attendant: "Kuzatuvchi",
    security: "Xavfsizlik",
  };

  const statusLabels = {
    assigned: "Tayinlangan",
    confirmed: "Tasdiqlangan",
    declined: "Rad etilgan",
    completed: "Yakunlangan",
    cancelled: "Bekor qilingan",
  };

  const statusColors = {
    assigned: "blue",
    confirmed: "green",
    declined: "orange",
    completed: "default",
    cancelled: "red",
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
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 44 }} spin />}
          />
        </div>
      </section>
    );
  }

  const employeeFullName =
    assignment?.employee?.full_name ||
    assignment?.employee?.fullname ||
    `${assignment?.employee?.firstName || ""} ${
      assignment?.employee?.lastName || ""
    }`.trim() ||
    `${assignment?.employee?.firstName || ""} ${
      assignment?.employee?.lastName || ""
    }`.trim() ||
    assignment?.employee_name ||
    "-";

  const assignedByFullName =
    assignment?.assigned_by?.full_name ||
    assignment?.assigned_by?.fullname ||
    `${assignment?.assigned_by?.firstName || ""} ${
      assignment?.assigned_by?.lastName || ""
    }`.trim() ||
    `${assignment?.assigned_by?.firstName || ""} ${
      assignment?.assigned_by?.lastName || ""
    }`.trim() ||
    assignment?.assigned_by?.username ||
    "-";

  return (
    <section className="page partners">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Topshiriq ma'lumotlari</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Topshiriqlar ro'yxati",
                    href: "/assignments",
                  },
                  {
                    title: `#${assignment?.id || id}`,
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Button onClick={() => navigate("/assignments")} style={{ marginRight: 8 }}>
              Orqaga
            </Button>
            <Button type="primary" onClick={() => navigate("/assignments/add")}>
              Yangi topshiriq
            </Button>
          </div>
        </div>
      </div>

      <Card style={{ marginTop: 16, borderRadius: 8 }}>
        <Descriptions
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="ID">#{assignment?.id || "-"}</Descriptions.Item>
          <Descriptions.Item label="Status">
            {assignment?.status ? (
              <Tag color={statusColors[assignment.status] || "default"}>
                {statusLabels[assignment.status] || assignment.status}
              </Tag>
            ) : (
              "-"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Rol">
            {roleLabels[assignment?.role] || assignment?.role || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Vagon raqami">
            {assignment?.wagon_number || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Reys">
            {assignment?.trip?.trip_number || assignment?.trip_number || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Reys sanasi">
            {assignment?.trip?.trip_date
              ? dayjs(assignment.trip.trip_date).format("DD.MM.YYYY")
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Poyezd">
            {assignment?.trip?.train
              ? `${assignment.trip.train.train_number} - ${assignment.trip.train.train_name}`
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Jo'nash stansiyasi">
            {assignment?.trip?.departure_station?.name || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Etib borish stansiyasi">
            {assignment?.trip?.arrival_station?.name || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Jo'nash vaqti">
            {assignment?.trip?.scheduled_departure
              ? dayjs(assignment.trip.scheduled_departure).format("DD.MM.YYYY HH:mm")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Etib borish vaqti">
            {assignment?.trip?.scheduled_arrival
              ? dayjs(assignment.trip.scheduled_arrival).format("DD.MM.YYYY HH:mm")
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Xodim">{employeeFullName}</Descriptions.Item>
          <Descriptions.Item label="Telefon">
            {assignment?.employee?.phone || assignment?.employee?.phone_number || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {assignment?.employee?.email || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Tayinlangan vaqti">
            {assignment?.assignment_date
              ? dayjs(assignment.assignment_date).format("DD.MM.YYYY HH:mm")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Tasdiqlangan vaqti">
            {assignment?.confirmed_at
              ? dayjs(assignment.confirmed_at).format("DD.MM.YYYY HH:mm")
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Tayinlagan">
            {assignedByFullName}
          </Descriptions.Item>
          <Descriptions.Item label="Tayinlagan (email)">
            {assignment?.assigned_by?.email || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Davomat">
            {assignment?.attendance ? (
              <Tag color={assignment.attendance.status === "present" ? "green" : "red"}>
                {assignment.attendance.status === "present" ? "Keldi" : "Kelmadi"}
              </Tag>
            ) : (
              "-"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Xodim lavozimi">
            {assignment?.employee?.position?.name || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Xodim bo'limi">
            {assignment?.employee?.department?.name || "-"}
          </Descriptions.Item>

          {assignment?.notes ? (
            <Descriptions.Item label="Izoh" span={2}>
              {assignment.notes}
            </Descriptions.Item>
          ) : null}

          {assignment?.special_instructions ? (
            <Descriptions.Item label="Maxsus ko'rsatmalar" span={2}>
              {assignment.special_instructions}
            </Descriptions.Item>
          ) : null}

          {Array.isArray(assignment?.trip?.intermediate_stations) &&
            assignment.trip.intermediate_stations.length > 0 && (
              <Descriptions.Item label="O'rta stansiyalar" span={2}>
                {assignment.trip.intermediate_stations.map((st, idx) => (
                  <div key={idx} style={{ marginBottom: 6 }}>
                    <strong>{st.name}</strong>{" "}
                    {st.arrival ? `| Kelish: ${st.arrival}` : ""}{" "}
                    {st.departure ? `| Jo'nash: ${st.departure}` : ""}
                  </div>
                ))}
              </Descriptions.Item>
            )}
        </Descriptions>
      </Card>
    </section>
  );
}

export default AssignmentDetail;

