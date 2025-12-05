import { useLocalization } from "../../LocalizationContext";
import { Row, Col, Card, Statistic, Spin } from "antd";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import useUniversalFetch from "../../Hooks/useApi";
import { BASE_URL } from "../../consts/variables";

const Dashboard = () => {
  const { useFetchQuery } = useUniversalFetch();
  const { t } = useLocalization();
  const accessToken = localStorage.getItem("access_token");

  const { data: dashboardData, isPending: isDashboardLoading } = useFetchQuery({
    url: `${BASE_URL}admin/dashboard`,
    queryKey: [`dashboard`],
    token: accessToken,
  });

  const data = dashboardData?.data
    ? dashboardData?.data
    : {
        totalPayedCashbacks: 0,
        totalCashbacks: 0,
        totalTrades: 0,
        totalReturnTrades: 0,
        clients: 0,
      };

  const cashbackChart = {
    options: {
      chart: {
        type: "donut",
        fontFamily: "Arial, sans-serif",
      },
      labels: [t("Common").given, t("Common").not_given],
      colors: ["#52c41a", "#faad14"],
      legend: {
        position: "right",
        formatter: (label, opts) => {
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${label}: $${value.toLocaleString("en-US")}`;
        },
      },
      dataLabels: {
        formatter: (val) => `${val.toFixed(1)}%`,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `$${val.toLocaleString("en-US")}`,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "55%",
            labels: {
              show: true,
              total: {
                show: true,
                label: t("Common").total,
                color: "#777",

                fontSize: "16px",
                fontWeight: 600,
                formatter: () => {
                  const total =
                    data.totalPayedCashbacks +
                    data.totalCashbacks -
                    data.totalPayedCashbacks;
                  return `$${total.toLocaleString("en-US")}`;
                },
                style: {
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#00FFCC", // <-- this changes the number color
                },
              },
            },
          },
        },
      },
    },
    series: [
      data.totalPayedCashbacks,
      data.totalCashbacks - data.totalPayedCashbacks,
    ],
  };

  const salesReturnChart = {
    options: {
      chart: {
        type: "donut",
        fontFamily: "Arial, sans-serif",
      },
      labels: [t("Partner_infos").sales, t("Partner_infos").return],
      colors: ["#1890ff", "#ff4d4f"],
      legend: {
        position: "right",
        formatter: (label, opts) => {
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${label}: $${value.toLocaleString("en-US")}`;
        },
      },
      dataLabels: {
        formatter: (val) => `${val.toFixed(1)}%`,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `$${val.toLocaleString("en-US")}`,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "55%",
            labels: {
              show: true,
              total: {
                color: "#777",

                show: true,
                label: t("Common").total,
                fontSize: "16px",
                fontWeight: 600,
                formatter: () => {
                  const total = data.totalTrades;
                  return `$${total.toLocaleString("en-US")}`;
                },
                style: {
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#00FFCC", // <-- this changes the number color
                },
              },
            },
          },
        },
      },
    },
    series: [data.totalTrades, data.totalReturnTrades],
  };

  return (
    <section className="dashboard-page page">
      <header className="header">
        <h2>{t("Pages").dashboard}</h2>
        <p>{t("Common").dashboard_title}</p>
      </header>

      <main className="main dashboard_content">
        <Row gutter={[24, 24]} className="stats-grid">
          <Col span={6}>
            <Card className="stat-card">
              <Statistic
                title={t("Partner_infos").client_amount}
                valueRender={() => (
                  <CountUp end={data?.clients} duration={1.2} />
                )}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card">
              <Statistic
                title={t("Partner_infos").sales_amount}
                valueRender={() => (
                  <CountUp end={data?.totalTrades} prefix="$" duration={1.2} />
                )}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card">
              <Statistic
                title={t("Partner_infos").return_amount}
                valueRender={() => (
                  <CountUp
                    end={data?.totalReturnTrades}
                    prefix="$"
                    duration={1.2}
                  />
                )}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card">
              <Statistic
                title={t("Partner_infos").cashback_amount}
                valueRender={() => (
                  <CountUp
                    end={data?.totalCashbacks}
                    prefix="$"
                    duration={1.2}
                  />
                )}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} className="charts-grid">
          <Col span={12}>
            <Card title={t("Common").chart_2} className="chart-card">
              {isDashboardLoading ? (
                <Spin />
              ) : (
                <ReactApexChart
                  options={salesReturnChart.options}
                  series={salesReturnChart.series}
                  type="donut"
                  height={300}
                />
              )}
            </Card>
          </Col>

          <Col span={12}>
            <Card title={t("Common").chart_1} className="chart-card">
              {isDashboardLoading ? (
                <Spin />
              ) : (
                <ReactApexChart
                  options={cashbackChart.options}
                  series={cashbackChart.series}
                  type="donut"
                  height={300}
                />
              )}
            </Card>
          </Col>
        </Row>
      </main>
    </section>
  );
};

export default Dashboard;
