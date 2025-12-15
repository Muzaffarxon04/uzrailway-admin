import { Form, Button, Spin, Breadcrumb } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../components/notification";
import { useLocalization } from "../../../LocalizationContext";

function AddPosition() {
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
    data: positionData,
    isPending: isPositionLoading,
    isSuccess: isSuccessPositionData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `settings/position/detail/${id}/`,
    queryKey: [`position-detail`, id],
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`position-detail`, id],
      },
    },
    token: accessToken,
  });

  const position = useMemo(() => positionData?.data || positionData || {}, [positionData]);

  const {
    mutate: handlePositionMutation,
    isPending: isPositionMutationLoading,
    isSuccess: isSuccessPositionMutation,
    data: positionMutationData,
    isError: isPositionMutationError,
    error: positionMutationError,
  } = useFetchMutation({
    url: is_edit ? `settings/position/update/${id}/` : `settings/position/create/`,
    invalidateKey: ["positions"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && position && Object.keys(position).length > 0) {
      form.setFieldsValue({
        name: position.name || position.position_name,
      });
    }
  }, [position, is_edit, form]);

  const onFinish = (values) => {
    const body = {
      name: values.name,
    };
    handlePositionMutation(body);
  };

  useEffect(() => {
    if (isSuccessPositionMutation) {
      refetchData();
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        positionMutationData?.message || t("messages").create_success
      );
      navigate("/positions");
    } else if (isPositionMutationError) {
      showNotification(
        "error",
        t("messages").error_2,
        positionMutationError?.message || t("messages").error
      );
    }
  }, [isSuccessPositionMutation, isPositionMutationError, is_edit, navigate, refetchData, showNotification, t, positionMutationData?.message, positionMutationError?.message]);

  useEffect(() => {
    if (is_edit) {
      if (!isPositionLoading && position && isSuccessPositionData && is_edit) {
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
  }, [isPositionLoading, position, is_edit, isSuccessPositionData]);

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
                {is_edit ? "Lavozimni tahrirlash" : "Yangi lavozim qo'shish"}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: "Lavozimlar ro'yxati",
                      href: "/positions",
                    },
                    {
                      title: is_edit
                        ? position?.name || position?.position_name || "Tahrirlash"
                        : "Yangi lavozim",
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
            name="position_form"
            className="action_form"
            form={form}
            onFinish={onFinish}
            initialValues={{}}
          >
            <div className="action_wrapper">
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>Lavozim ma'lumotlari</h3>
                  </div>

                  <div className="drap_area_wrapper">
                    <div className="form_items">
                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Lavozim nomi"
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Lavozim nomi kiritilishi shart",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form_actions">
                    <div className="footer_buttons">
                      <Button
                        loading={isPositionMutationLoading}
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

export default AddPosition;



