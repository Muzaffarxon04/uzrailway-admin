import { Card, Descriptions, Breadcrumb, Button, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import useUniversalFetch from "../../../Hooks/useApi";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function StationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { useFetchQuery } = useUniversalFetch();

  const {
    data: stationData,
    isPending: isStationLoading,
  } = useFetchQuery({
    queryKey: [`station-detail`, id],
    url: `stations/detail/${id}/`,
    token: accessToken,
  });

  const station = stationData?.data || stationData || {};

  if (isStationLoading) {
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
            <h2>Stansiya ma'lumotlari</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Stansiyalar ro'yxati",
                    href: "/stations",
                  },
                  {
                    title: station?.name || "Stansiya ma'lumotlari",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Button
              type="default"
              onClick={() => navigate("/stations")}
              style={{ marginRight: 8 }}
            >
              Orqaga
            </Button>
            <Button
              type="primary"
              onClick={() => navigate(`/stations/${id}`)}
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
            {station?.id || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Stansiya nomi">
            {station?.name || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Yaratilgan vaqti">
            {station?.created_at ? dayjs(station.created_at).format("DD.MM.YYYY HH:mm") : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Yangilangan vaqti">
            {station?.updated_at ? dayjs(station.updated_at).format("DD.MM.YYYY HH:mm") : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
}

export default StationDetail;





