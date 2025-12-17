import { Form, Button, Spin, Breadcrumb } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import CustomSelect from "../../../components/inputs/customSelect";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../components/notification";
import { useLocalization } from "../../../LocalizationContext";

function AddDevice() {
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

  // Fetch stations for select
  const {
    data: stationsData,
    isPending: isStationsLoading,
  } = useFetchQuery({
    queryKey: ["stations-select"],
    url: `stations/list/`,
    params: { page: 1, page_size: 1000 },
    token: accessToken,
  });

  const stations = stationsData?.data || [];

  const {
    data: deviceData,
    isPending: isDeviceLoading,
    isSuccess: isSuccessDeviceData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `devices/detail/${id}/`,
    queryKey: [`device-detail`, id],
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`device-detail`, id],
      },
    },
    token: accessToken,
  });

  const device = useMemo(() => deviceData?.data || deviceData || {}, [deviceData]);

  const {
    mutate: CreateDevice,
    isPending: isDeviceCreateLoading,
    isSuccess: isSuccessDeviceCreated,
    data: deviceCreateData,
    isError: isDeviceCreateError,
    error: deviceCreateError,
  } = useFetchMutation({
    url: is_edit ? `devices/update/${id}/` : `devices/create/`,
    invalidateKey: ["devices"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && device && Object.keys(device).length > 0) {
      form.setFieldsValue({
        name: device.name || device.deviceName,
        type: device.type,
        ipAddress: device.ipAddress || device.ip,
        station: device.station || device.stationId || device.station?.id,
        ezvizVerifyCode: device.ezvizVerifyCode,
        userName: device.userName,
        password: device.password,
        ezvizSerialNo: device.ezvizSerialNo,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device, is_edit, form]);

  const onFinish = (values) => {
    const body = {
      name: values.name || null,
      ezvizVerifyCode: values.ezvizVerifyCode || null,
      userName: values.userName || null,
      password: values.password || null,
      // macAddress: values.macAddress || null,
      ipAddress: values.ipAddress || null,
      ezvizSerialNo: values.ezvizSerialNo || null,
      type: values.type,
      timezone_id: '26',
      applyToDevice: '1',
      station: values.station ? parseInt(values.station) : null,
    };
    CreateDevice(body);
  };

  useEffect(() => {
    if (isSuccessDeviceCreated) {
      refetchData();
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        deviceCreateData?.message || t("messages").create_success
      );
      navigate("/devices");
    } else if (isDeviceCreateError) {
      showNotification(
        "error",
        t("messages").error_2,
        deviceCreateError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeviceCreated, isDeviceCreateError, is_edit]);

  useEffect(() => {
    if (is_edit) {
      if (!isDeviceLoading && device && isSuccessDeviceData && is_edit) {
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
  }, [isDeviceLoading, device, is_edit]);

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
                {is_edit ? "Qurilmani tahrirlash" : "Yangi qurilma qo'shish"}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: "Qurilmalar ro'yxati",
                      href: "/devices",
                    },
                    {
                      title: is_edit
                        ? device?.name || "Tahrirlash"
                        : "Yangi qurilma",
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
            name="device_form"
            className="action_form"
            form={form}
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <div className="action_wrapper">
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>Qurilma ma'lumotlari</h3>
                  </div>

                  <div className="drap_area_wrapper">
                    <div className="form_items">
                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Name"
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Name kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Turi"
                          name="type"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Turi tanlanishi shart",
                            },
                          ]}
                          options={[
                            { label: "Kirish (IN)", value: "IN" },
                            { label: "Chiqish (OUT)", value: "OUT" },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="IP manzil"
                          name="ipAddress"
                          rules={[
                            {
                              required: true,
                              message: "IP manzil kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Qurilma Seriya Raqami"
                          name="ezvizSerialNo"
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Qurilma Tasdiqlash Kodi"
                          name="ezvizVerifyCode"
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Username"
                          name="userName"
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Password"
                          name="password"
                          type="password"
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Stansiya"
                          name="station"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Stansiya tanlanishi shart",
                            },
                          ]}
                          options={Array.isArray(stations) ? stations.map((station) => ({
                            label: station.name,
                            value: station.id,
                          })) : []}
                          loading={isStationsLoading}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form_actions">
                    <div className="footer_buttons">
                      <Button
                        loading={isDeviceCreateLoading}
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

export default AddDevice;
















