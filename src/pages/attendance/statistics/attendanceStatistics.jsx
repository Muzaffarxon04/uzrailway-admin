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
import { useNavigate } from "react-router-dom";
import useUniversalFetch from "../../../Hooks/useApi";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocalization } from "../../../LocalizationContext";

function AttendanceStatistics() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { useFetchQuery } = useUniversalFetch();
  const { t } = useLocalization();

  const {
    data: statisticsData,
    isPending: isStatisticsLoading,
  } = useFetchQuery({
    queryKey: ["attendance-statistics"],
    url: `attendance/statistics/`,
    token: accessToken,
  });

  const statistics = statisticsData?.data || statisticsData || {};

  // Response directly contains: total, present, absent, late, attendance_rate, punctuality_rate
  const {
    total = 0,
    present = 0,
    absent = 0,
    late = 0,
    attendance_rate = 0,
    punctuality_rate = 0,
  } = statistics;

  if (isStatisticsLoading) {
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

  return (
    <section className="page partners">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Davomat statistikasi</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Davomat ro'yxati",
                    href: "/attendance",
                  },
                  {
                    title: "Statistika",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Button
              type="default"
              onClick={() => navigate("/attendance")}
              style={{ marginRight: 8 }}
            >
              Orqaga
            </Button>
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={6}>
          <Card
            title="Jami davomatlar"
            style={{ borderRadius: 8, height: "100%" }}
          >
            <Statistic
              title="Jami"
              value={total}
              valueStyle={{ color: "#1890ff", fontSize: 24 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card
            title="Hozir"
            style={{ borderRadius: 8, height: "100%" }}
          >
            <Statistic
              title="Keldi"
              value={present}
              valueStyle={{ color: "#52c41a", fontSize: 24 }}
            />
            {total > 0 && (
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={Math.round((present / total) * 100)}
                  strokeColor="#52c41a"
                  size="small"
                  showInfo={false}
                />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card
            title="Yo'q"
            style={{ borderRadius: 8, height: "100%" }}
          >
            <Statistic
              title="Kelmadi"
              value={absent}
              valueStyle={{ color: "#ff4d4f", fontSize: 24 }}
            />
            {total > 0 && (
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={Math.round((absent / total) * 100)}
                  strokeColor="#ff4d4f"
                  size="small"
                  showInfo={false}
                />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card
            title="Kechikkan"
            style={{ borderRadius: 8, height: "100%" }}
          >
            <Statistic
              title="Kechikdi"
              value={late}
              valueStyle={{ color: "#faad14", fontSize: 24 }}
            />
            {total > 0 && (
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={Math.round((late / total) * 100)}
                  strokeColor="#faad14"
                  size="small"
                  showInfo={false}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Attendance Rate and Punctuality Rate Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Davomat foizi"
            style={{ borderRadius: 8 }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Statistic
                  title="Davomat foizi"
                  value={attendance_rate}
                  suffix="%"
                  valueStyle={{
                    color:
                      attendance_rate >= 90
                        ? "#52c41a"
                        : attendance_rate >= 70
                        ? "#faad14"
                        : "#ff4d4f",
                    fontSize: 32,
                  }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginTop: 16 }}>
                  <Progress
                    percent={attendance_rate}
                    strokeColor={{
                      "0%": "#ff4d4f",
                      "50%": "#faad14",
                      "100%": "#52c41a",
                    }}
                    format={(percent) => `${percent}%`}
                    strokeWidth={20}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Vaqtida kelish foizi"
            style={{ borderRadius: 8 }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Statistic
                  title="Vaqtida kelish foizi"
                  value={punctuality_rate}
                  suffix="%"
                  valueStyle={{
                    color:
                      punctuality_rate >= 90
                        ? "#52c41a"
                        : punctuality_rate >= 70
                        ? "#faad14"
                        : "#ff4d4f",
                    fontSize: 32,
                  }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginTop: 16 }}>
                  <Progress
                    percent={punctuality_rate}
                    strokeColor={{
                      "0%": "#ff4d4f",
                      "50%": "#faad14",
                      "100%": "#52c41a",
                    }}
                    format={(percent) => `${percent}%`}
                    strokeWidth={20}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Detailed Statistics */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* By Status */}
        <Col xs={24} lg={12}>
          <Card
            title="Status bo'yicha taqsimot"
            style={{ borderRadius: 8, height: "100%" }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Hozir">
                <Tag color="green">{present}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Yo'q">
                <Tag color="red">{absent}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Kechikkan">
                <Tag color="orange">{late}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Summary Card */}
        <Col xs={24} lg={12}>
          <Card
            title="Umumiy ma'lumotlar"
            style={{ borderRadius: 8, height: "100%" }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Jami davomatlar">
                <strong>{total}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Davomat foizi">
                <strong style={{ color: "#1890ff" }}>{attendance_rate}%</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Vaqtida kelish foizi">
                <strong style={{ color: "#722ed1" }}>{punctuality_rate}%</strong>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </section>
  );
}

export default AttendanceStatistics;

