import { Form, Button, Spin, Breadcrumb, Switch } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import CustomSelect from "../../../components/inputs/customSelect";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../components/notification";
import { useLocalization } from "../../../LocalizationContext";

function AddTrain() {
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
    data: trainData,
    isPending: isTrainLoading,
    isSuccess: isSuccessTrainData,
    refetch: refetchData,
  } = useFetchQuery({
    url: is_edit ? `train/detail/${id}/` : undefined,
    queryKey: [`train-detail`, id],
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`train-detail`, id],
      },
    },
    token: accessToken,
  });

  const train = trainData?.data || trainData || {};

  const {
    mutate: CreateTrain,
    isPending: isTrainCreateLoading,
    isSuccess: isSuccessTrainCreated,
    data: trainCreateData,
    isError: isTrainCreateError,
    error: trainCreateError,
  } = useFetchMutation({
    url: is_edit ? `train/update/${id}/` : `train/create/`,
    invalidateKey: ["train"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && train && Object.keys(train).length > 0) {
      form.setFieldsValue({
        train_number: train.train_number,
        train_name: train.train_name,
        train_type: train.train_type,
        status: train.status,
        is_active: train.is_active !== undefined ? train.is_active : true,
      });
      
      // Force form to update all fields
      setTimeout(() => {
        form.validateFields();
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [train, is_edit]);

  const onFinish = (values) => {
    const body = {
      train_number: values.train_number,
      train_name: values.train_name,
      train_type: values.train_type,
      status: values.status,
      is_active: values.is_active !== undefined ? values.is_active : true,
    };
    CreateTrain(body);
  };

  useEffect(() => {
    if (isSuccessTrainCreated) {
      refetchData();
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        trainCreateData?.message || t("messages").create_success
      );
      navigate("/trains");
    } else if (isTrainCreateError) {
      showNotification(
        "error",
        t("messages").error_2,
        trainCreateError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessTrainCreated, isTrainCreateError, is_edit]);

  useEffect(() => {
    if (is_edit) {
      if (!isTrainLoading && train && isSuccessTrainData && is_edit) {
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
  }, [isTrainLoading, train, is_edit]);

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
                {is_edit ? "Poyezdni tahrirlash" : "Yangi poyezd qo'shish"}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: "Poyezdlar ro'yxati",
                      href: "/trains",
                    },
                    {
                      title: is_edit
                        ? train?.train_name || "Tahrirlash"
                        : "Yangi poyezd",
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
            name="train_form"
            className="action_form"
            form={form}
            onFinish={onFinish}
            initialValues={{ 
              remember: true,
              is_active: true,
            }}
          >
            <div className="action_wrapper">
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>Poyezd ma'lumotlari</h3>
                  </div>

                  <div className="drap_area_wrapper">
                    <div className="form_items">
                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Poyezd raqami"
                          name="train_number"
                          rules={[
                            {
                              required: true,
                              message: "Poyezd raqami kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Poyezd nomi"
                          name="train_name"
                          rules={[
                            {
                              required: true,
                              message: "Poyezd nomi kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Poyezd turi"
                          name="train_type"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Poyezd turi tanlanishi shart",
                            },
                          ]}
                          options={[
                            { label: "Express", value: "express" },
                            { label: "Passenger", value: "passenger" },
                            { label: "Suburban", value: "suburban" },
                            { label: "Freight", value: "freight" },
                            { label: "High Speed", value: "high_speed" },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Status"
                          name="status"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Status tanlanishi shart",
                            },
                          ]}
                          options={[
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                            { label: "Maintenance", value: "maintenance" },
                            { label: "Retired", value: "retired" },
                          ]}
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
                        loading={isTrainCreateLoading}
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

export default AddTrain;

