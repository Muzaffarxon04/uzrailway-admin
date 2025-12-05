import { Form, Button, Spin, Breadcrumb } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { BASE_URL } from "../../../consts/variables";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../components/notification";
import { useLocalization } from "../../../LocalizationContext";

function AddStation() {
  const [form] = Form.useForm();
  const { t } = useLocalization();
  const { useFetchMutation, useFetchQuery } = useUniversalFetch();
  const accessToken = localStorage.getItem("access_token");
  const { id } = useParams();

  const showNotification = useNotification();
  const is_edit = id !== "add";
  const [opacity, setOpacity] = useState("0");
  const [loader, setLoader] = useState("1");
  const navigate = useNavigate();

  const {
    data: stationData,
    isPending: isStationLoading,
    isSuccess: isSuccessStationData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `${BASE_URL}/station`,
    queryKey: [`station`, id],
    id: is_edit ? id : undefined,
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`station`, id],
      },
    },
    token: accessToken,
  });

  const station = stationData?.data || stationData || {};

  const {
    mutate: CreateStation,
    isPending: isStationCreateLoading,
    isSuccess: isSuccessStationCreated,
    data: stationCreateData,
    isError: isStationCreateError,
    error: stationCreateError,
  } = useFetchMutation({
    url: is_edit ? `${BASE_URL}/station/${id}` : `${BASE_URL}/station`,
    invalidateKey: ["stations"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && station) {
      form.setFieldsValue({
        name: station.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station, is_edit]);

  const onFinish = (values) => {
    const body = {
      name: values.name,
    };
    CreateStation(body);
  };

  useEffect(() => {
    if (isSuccessStationCreated) {
      refetchData();
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        stationCreateData?.message || t("messages").create_success
      );
      navigate("/stations");
    } else if (isStationCreateError) {
      showNotification(
        "error",
        t("messages").error_2,
        stationCreateError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessStationCreated, isStationCreateError, is_edit]);

  useEffect(() => {
    if (is_edit) {
      if (!isStationLoading && station && isSuccessStationData && is_edit) {
        setLoader("0");
        setOpacity("1");
      } else {
        setLoader("1");
        setOpacity("0");
      }
    } else {
      setLoader("0");
      setOpacity("1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStationLoading, station, is_edit]);

  return (
    <>
      {is_edit && (
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
      )}

      <section className="page partners" style={{ opacity: opacity }}>
        <div className="header">
          <div className="header_wrapper">
            <div className="page_info">
              <h2>
                {is_edit ? "Stansiyani tahrirlash" : "Yangi stansiya qo'shish"}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: "Stansiyalar ro'yxati",
                      href: "/stations",
                    },
                    {
                      title: is_edit
                        ? station?.name || "Tahrirlash"
                        : "Yangi stansiya",
                      href: "",
                    },
                  ]}
                />
              </span>
            </div>
          </div>
        </div>

        <div className="partner_action">
          <Form
            name="station_form"
            className="action_form"
            form={form}
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <div className="action_wrapper">
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>Stansiya ma'lumotlari</h3>
                  </div>

                  <div className="drap_area_wrapper">
                    <div className="form_items">
                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Stansiya nomi"
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Stansiya nomi kiritilishi shart",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form_actions">
                    <div className="footer_buttons">
                      <Button
                        loading={isStationCreateLoading}
                        onClick={() => form.submit()}
                        type="primary"
                      >
                        {is_edit ? "Saqlash" : "Qo'shish"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </section>
    </>
  );
}

export default AddStation;

