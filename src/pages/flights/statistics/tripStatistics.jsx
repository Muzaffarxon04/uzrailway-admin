import { useState, useEffect } from "react";
import {
  Card,
  Breadcrumb,
  Button,
  Spin,
  Descriptions,
  Tag,
  Row,
  Col,
  Statistic,
  Progress,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import useUniversalFetch from "../../../Hooks/useApi";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function TripStatistics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { useFetchQuery } = useUniversalFetch();

  const {
    data: statisticsData,
    isPending: isStatisticsLoading,
  } = useFetchQuery({
    queryKey: [`trip-statistics`, id],
    url: `trips/${id}/statistics/`,
    token: accessToken,
  });

  const statistics = statisticsData?.data || statisticsData || {};
  const tripInfo = statistics?.trip_info || {};
  const assignments = statistics?.assignments || {};
  const attendance = statistics?.attendance || {};

  if (isStatisticsLoading) {
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
            <h2>Reys statistikasi</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Reyslar ro'yxati",
                    href: "/flights",
                  },
                  {
                    title: tripInfo?.trip_number || "Statistika",
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
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Trip Info Card */}
        <Col xs={24} lg={12}>
          <Card title="Reys ma'lumotlari" style={{ borderRadius: 8, height: "100%" }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Reys raqami">
                <strong>{tripInfo?.trip_number || "-"}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  tripInfo?.status === "scheduled" ? "blue" :
                  tripInfo?.status === "departed" ? "orange" :
                  tripInfo?.status === "arrived" ? "green" :
                  tripInfo?.status === "cancelled" ? "red" : "default"
                }>
                  {tripInfo?.status || "-"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Rejalashtirilgan jo'nash">
                {tripInfo?.scheduled_departure ? dayjs(tripInfo.scheduled_departure).format("DD.MM.YYYY HH:mm") : "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Assignments Card */}
        <Col xs={24} lg={12}>
          <Card title="Topshiriqlar statistikasi" style={{ borderRadius: 8, height: "100%" }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Jami"
                  value={assignments?.total || 0}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Tasdiqlangan"
                  value={assignments?.confirmed || 0}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Tayinlangan"
                  value={assignments?.assigned || 0}
                  valueStyle={{ color: "#faad14" }}
                />
              </Col>
            </Row>
            {assignments?.total > 0 && (
              <div style={{ marginTop: 24 }}>
                <Progress
                  percent={assignments?.confirmed ? Math.round((assignments.confirmed / assignments.total) * 100) : 0}
                  strokeColor="#52c41a"
                  format={(percent) => `Tasdiqlangan: ${percent}%`}
                />
              </div>
            )}
          </Card>
        </Col>

        {/* Attendance Card */}
        <Col xs={24} lg={12}>
          <Card title="Davomat statistikasi" style={{ borderRadius: 8, height: "100%" }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Jami"
                  value={attendance?.total || 0}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Keldi"
                  value={attendance?.present || 0}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Kelmadi"
                  value={attendance?.absent || 0}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Col>
              <Col span={8} style={{ marginTop: 16 }}>
                <Statistic
                  title="Kechikdi"
                  value={attendance?.late || 0}
                  valueStyle={{ color: "#faad14" }}
                />
              </Col>
              <Col span={8} style={{ marginTop: 16 }}>
                <Statistic
                  title="Davomat foizi"
                  value={attendance?.attendance_rate || 0}
                  suffix="%"
                  valueStyle={{ color: "#722ed1" }}
                />
              </Col>
            </Row>
            {attendance?.total > 0 && (
              <div style={{ marginTop: 24 }}>
                <Progress
                  percent={attendance?.attendance_rate || 0}
                  strokeColor={{
                    '0%': '#ff4d4f',
                    '100%': '#52c41a',
                  }}
                  format={(percent) => `Davomat: ${percent}%`}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </section>
  );
}

export default TripStatistics;

