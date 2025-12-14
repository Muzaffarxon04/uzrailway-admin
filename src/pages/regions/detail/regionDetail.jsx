import { Card, Descriptions, Breadcrumb, Button, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import useUniversalFetch from "../../../Hooks/useApi";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function RegionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { useFetchQuery } = useUniversalFetch();

  const {
    data: regionData,
    isPending: isRegionLoading,
  } = useFetchQuery({
    queryKey: [`region-detail`, id],
    url: `regions/detail/${id}/`,
    token: accessToken,
  });

  const region = regionData?.data || regionData || {};

  if (isRegionLoading) {
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
            <h2>Viloyat ma'lumotlari</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Viloyatlar ro'yxati",
                    href: "/regions",
                  },
                  {
                    title: region?.name || region?.region_name || "Viloyat ma'lumotlari",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Button
              type="default"
              onClick={() => navigate("/regions")}
              style={{ marginRight: 8 }}
            >
              Orqaga
            </Button>
            <Button
              type="primary"
              onClick={() => navigate(`/regions/${id}`)}
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
            {region?.id || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Viloyat nomi">
            {region?.name || region?.region_name || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Yaratilgan vaqti">
            {region?.created_at ? dayjs(region.created_at).format("DD.MM.YYYY HH:mm") : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Yangilangan vaqti">
            {region?.updated_at ? dayjs(region.updated_at).format("DD.MM.YYYY HH:mm") : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
}

export default RegionDetail;


