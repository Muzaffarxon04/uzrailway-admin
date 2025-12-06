import { useEffect, useState } from "react";
import { Spin, Breadcrumb, Tag, Descriptions } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import Icon from "../../../components/Icon";
import { BASE_URL } from "../../../consts/variables";
import useUniversalFetch from "../../../Hooks/useApi";
import dayjs from "dayjs";

function FaceLogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { useFetchQuery } = useUniversalFetch();
  const [opacity, setOpacity] = useState("0");
  const [loader, setLoader] = useState("1");

  const {
    data: faceLogData,
    isPending: isFaceLogLoading,
    isSuccess: isSuccessFaceLogData,
  } = useFetchQuery({
    url: `${BASE_URL}/face-logs/${id}`,
    queryKey: [`face-logs`, id],
    token: accessToken,
  });

  const faceLog = faceLogData?.data || {};

  useEffect(() => {
    if (!isFaceLogLoading && faceLog && isSuccessFaceLogData) {
      setLoader("0");
      setOpacity("1");
    } else {
      setLoader("1");
      setOpacity("0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFaceLogLoading, faceLog, isSuccessFaceLogData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "recognized":
        return "green";
      case "unknown":
        return "red";
      case "pending":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "recognized":
        return "Tanishgan";
      case "unknown":
        return "Noma'lum";
      case "pending":
        return "Kutilmoqda";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="loader" style={{ opacity: loader }}>
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 44,
              }}
              spin
            />
          }
        />
      </div>

      <section className="page partners" style={{ opacity: opacity }}>
        <div className="header">
          <div className="header_wrapper">
            <div className="page_info">
              <h2>Keldi-ketdi ma'lumotlari</h2>
              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: "Keldi-ketdilar ro'yxati",
                      href: "/facelogs",
                    },
                    {
                      title: faceLog?.fullname || "Ma'lumotlar",
                      href: "",
                    },
                  ]}
                />
              </span>
            </div>
          </div>
        </div>

        <div className="partner_action">
          <div className="action_wrapper">
            <div className="action_item company_info">
              <div className="item_wrapper">
                <div className="item_title">
                  <h3>Asosiy ma'lumotlar</h3>
                </div>

                <div className="drap_area_wrapper">
                  <Descriptions bordered column={1} size="middle">
                    <Descriptions.Item label="ID">
                      #{faceLog?.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="To'liq ism">
                      {faceLog?.fullname || "Noma'lum"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={getStatusColor(faceLog?.status)}>
                        {getStatusText(faceLog?.status)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Qurilma IP">
                      {faceLog?.deviceIp || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Vaqt">
                      {faceLog?.operatedAt
                        ? dayjs(faceLog.operatedAt).format("DD.MM.YYYY HH:mm:ss")
                        : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Yaratilgan vaqti">
                      {faceLog?.createdAt
                        ? dayjs(faceLog.createdAt).format("DD.MM.YYYY HH:mm:ss")
                        : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Yangilangan vaqti">
                      {faceLog?.updatedAt
                        ? dayjs(faceLog.updatedAt).format("DD.MM.YYYY HH:mm:ss")
                        : "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            </div>

            {faceLog?.employee && (
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>Xodim ma'lumotlari</h3>
                  </div>

                  <div className="drap_area_wrapper">
                    <Descriptions bordered column={1} size="middle">
                      <Descriptions.Item label="ID">
                        #{faceLog.employee.id}
                      </Descriptions.Item>
                      <Descriptions.Item label="To'liq ism">
                        {faceLog.employee.fullname || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Telefon raqami">
                        {faceLog.employee.phone || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Bo'lim">
                        {faceLog.employee.department || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Lavozim">
                        {faceLog.employee.lavozim || "-"}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </div>
              </div>
            )}

            {faceLog?.station && (
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>Stansiya ma'lumotlari</h3>
                  </div>

                  <div className="drap_area_wrapper">
                    <Descriptions bordered column={1} size="middle">
                      <Descriptions.Item label="ID">
                        #{faceLog.station.id}
                      </Descriptions.Item>
                      <Descriptions.Item label="Nomi">
                        {faceLog.station.name || "-"}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default FaceLogDetail;




