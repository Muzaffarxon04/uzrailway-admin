import { Card, Descriptions, Breadcrumb, Button, Spin, Tag } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../consts/variables";
import useUniversalFetch from "../../../Hooks/useApi";
import { useLocalization } from "../../../LocalizationContext";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function TrainDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { t } = useLocalization();
  const { useFetchQuery } = useUniversalFetch();

  const {
    data: trainData,
    isPending: isTrainLoading,
  } = useFetchQuery({
    queryKey: [`train-detail`, id],
    url: `train/detail/${id}/`,
    token: accessToken,
  });

  const train = trainData?.data || trainData || {};

  if (isTrainLoading) {
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

  const getStatusColor = (status) => {
    const statusColors = {
      active: "green",
      inactive: "default",
      maintenance: "orange",
      retired: "red",
    };
    return statusColors[status] || "default";
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      active: "Faol",
      inactive: "Nofaol",
      maintenance: "Ta'mirlashda",
      retired: "Nafaqaga chiqqan",
    };
    return statusLabels[status] || status;
  };

  const getTrainTypeLabel = (type) => {
    const typeLabels = {
      express: "Express",
      passenger: "Yo'lovchi",
      suburban: "Shahar atrofi",
      freight: "Yuk",
      high_speed: "Yuqori tezlik",
    };
    return typeLabels[type] || type;
  };

  return (
    <section className="page partners">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Poyezd ma'lumotlari</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Poyezdlar ro'yxati",
                    href: "/trains",
                  },
                  {
                    title: train?.train_name || "Poyezd ma'lumotlari",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Button 
              type="default" 
              onClick={() => navigate("/trains")}
              style={{ marginRight: 8 }}
            >
              Orqaga
            </Button>
            <Button 
              type="primary" 
              onClick={() => navigate(`/trains/${id}`)}
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
            {train?.id || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Poyezd raqami">
            {train?.train_number || "-"}
          </Descriptions.Item>
          
          <Descriptions.Item label="Poyezd nomi">
            {train?.train_name || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Poyezd turi">
            {getTrainTypeLabel(train?.train_type) || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Vagonlar soni">
            {train?.wagon_count || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Jami sig'im">
            {train?.total_capacity || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Ishlab chiqaruvchi">
            {train?.manufacturer || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ishlab chiqarilgan yil">
            {train?.manufacture_year || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {train?.status ? (
              <Tag color={getStatusColor(train.status)}>
                {getStatusLabel(train.status)}
              </Tag>
            ) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Faol">
            {train?.is_active !== undefined ? (
              <Tag color={train.is_active ? "green" : "red"}>
                {train.is_active ? "Ha" : "Yo'q"}
              </Tag>
            ) : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="WiFi mavjud">
            {train?.has_wifi !== undefined ? (
              <Tag color={train.has_wifi ? "green" : "default"}>
                {train.has_wifi ? "Ha" : "Yo'q"}
              </Tag>
            ) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Konditsioner mavjud">
            {train?.has_ac !== undefined ? (
              <Tag color={train.has_ac ? "green" : "default"}>
                {train.has_ac ? "Ha" : "Yo'q"}
              </Tag>
            ) : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Restoran mavjud">
            {train?.has_restaurant !== undefined ? (
              <Tag color={train.has_restaurant ? "green" : "default"}>
                {train.has_restaurant ? "Ha" : "Yo'q"}
              </Tag>
            ) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Zaryadlash mavjud">
            {train?.has_charging !== undefined ? (
              <Tag color={train.has_charging ? "green" : "default"}>
                {train.has_charging ? "Ha" : "Yo'q"}
              </Tag>
            ) : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Yaratilgan vaqti" span={2}>
            {train?.created_at 
              ? dayjs(train.created_at).format("DD.MM.YYYY HH:mm") 
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Yangilangan vaqti" span={2}>
            {train?.updated_at 
              ? dayjs(train.updated_at).format("DD.MM.YYYY HH:mm") 
              : "-"}
          </Descriptions.Item>

          {train?.description && (
            <Descriptions.Item label="Tavsif" span={2}>
              {train.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </section>
  );
}

export default TrainDetail;












