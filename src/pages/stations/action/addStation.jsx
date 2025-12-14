import { Form, Button, Spin, Breadcrumb, Switch } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import CustomSelect from "../../../components/inputs/customSelect";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { useEffect, useState, useMemo } from "react";
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

  // Fetch regions for select
  const {
    data: regionsData,
    isPending: isRegionsLoading,
  } = useFetchQuery({
    queryKey: ["regions-select"],
    url: `regions/list/`,
    params: { page: 1, page_size: 1000 },
    token: accessToken,
  });

  const regions = regionsData || [];

  const {
    data: stationData,
    isPending: isStationLoading,
    isSuccess: isSuccessStationData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `stations/detail/${id}/`,
    queryKey: [`station-detail`, id],
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`station-detail`, id],
      },
    },
    token: accessToken,
  });

  const station = useMemo(() => stationData?.data || stationData || {}, [stationData]);

  const {
    mutate: handleStationMutation,
    isPending: isStationMutationLoading,
    isSuccess: isSuccessStationMutation,
    data: stationMutationData,
    isError: isStationMutationError,
    error: stationMutationError,
  } = useFetchMutation({
    url: is_edit ? `stations/update/${id}/` : `stations/create/`,
    invalidateKey: ["stations"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && station && Object.keys(station).length > 0) {
      form.setFieldsValue({
        name: station.name,
        address: station.address,
        phone_number: station.phone_number,
        is_active: station.is_active !== undefined ? station.is_active : true,
        region: station.region || station.regionId || station.region?.id,
      });
    }
  }, [station, is_edit, form]);

  const onFinish = (values) => {
    const body = {
      name: values.name,
      address: values.address || "",
      is_active: values.is_active !== undefined ? values.is_active : true,
      phone_number: values.phone_number || "",
      region: parseInt(values.region),
    };
    handleStationMutation(body);
  };

  useEffect(() => {
    if (isSuccessStationMutation) {
      refetchData();
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        stationMutationData?.message || t("messages").create_success
      );
      navigate("/stations");
    } else if (isStationMutationError) {
      showNotification(
        "error",
        t("messages").error_2,
        stationMutationError?.message || t("messages").error
      );
    }
  }, [isSuccessStationMutation, isStationMutationError, is_edit, navigate, refetchData, showNotification, t, stationMutationData?.message, stationMutationError?.message]);

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
  }, [isStationLoading, station, is_edit, isSuccessStationData]);

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
            initialValues={{
              is_active: true,
            }}
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

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Manzil"
                          name="address"
                          rules={[
                            {
                              required: true,
                              message: "Manzil kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Telefon raqami"
                          name="phone_number"
                        //   placeholder="+998951432344"
                          rules={[
                            {
                              required: true,
                              message: "Telefon raqami kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Viloyat"
                          name="region"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Viloyat tanlanishi shart",
                            },
                          ]}
                          options={Array.isArray(regions) ? regions.map((region) => ({
                            label: region.name || region.region_name,
                            value: region.id,
                          })) : []}
                          loading={isRegionsLoading}
                        />
                      </div>

                      <div className="input_item">
                        <div className="switch_input_item">
                          <p className="switch_label">Faol</p>
                          <Form.Item name="is_active" valuePropName="checked">
                            <Switch />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form_actions">
                    <div className="footer_buttons">
                      <Button
                        loading={isStationMutationLoading}
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

