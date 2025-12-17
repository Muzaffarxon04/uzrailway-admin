import { Form, Button, Spin, Breadcrumb } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../components/notification";
import { useLocalization } from "../../../LocalizationContext";

function AddRegion() {
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
    data: regionData,
    isPending: isRegionLoading,
    isSuccess: isSuccessRegionData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `regions/detail/${id}/`,
    queryKey: [`region-detail`, id],
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`region-detail`, id],
      },
    },
    token: accessToken,
  });

  const region = useMemo(() => regionData?.data || regionData || {}, [regionData]);

  const {
    mutate: handleRegionMutation,
    isPending: isRegionMutationLoading,
    isSuccess: isSuccessRegionMutation,
    data: regionMutationData,
    isError: isRegionMutationError,
    error: regionMutationError,
  } = useFetchMutation({
    url: is_edit ? `regions/update/${id}/` : `regions/create/`,
    invalidateKey: ["regions"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && region && Object.keys(region).length > 0) {
      form.setFieldsValue({
        name: region.name || region.region_name,
      });
    }
  }, [region, is_edit, form]);

  const onFinish = (values) => {
    const body = {
      name: values.name,
    };
    handleRegionMutation(body);
  };

  useEffect(() => {
    if (isSuccessRegionMutation) {
      refetchData();
      showNotification(
        "success",
        is_edit ? "Viloyat yangilandi" : "Viloyat qo'shildi",
        regionMutationData?.message || (is_edit ? "Viloyat muvaffaqiyatli yangilandi" : "Viloyat muvaffaqiyatli qo'shildi")
      );
      navigate("/regions");
    } else if (isRegionMutationError) {
      showNotification(
        "error",
        t("messages").error_2,
        regionMutationError?.message || t("messages").error
      );
    }
  }, [isSuccessRegionMutation, isRegionMutationError, is_edit, navigate, refetchData, showNotification, t, regionMutationData?.message, regionMutationError?.message]);

  useEffect(() => {
    if (is_edit) {
      if (!isRegionLoading && region && isSuccessRegionData && is_edit) {
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
  }, [isRegionLoading, region, is_edit, isSuccessRegionData]);

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
                {is_edit ? "Viloyatni tahrirlash" : "Yangi viloyat qo'shish"}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: "Viloyatlar ro'yxati",
                      href: "/regions",
                    },
                    {
                      title: is_edit
                        ? region?.name || region?.region_name || "Tahrirlash"
                        : "Yangi viloyat",
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
            name="region_form"
            className="action_form"
            form={form}
            onFinish={onFinish}
            initialValues={{}}
          >
            <div className="action_wrapper">
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>Viloyat ma'lumotlari</h3>
                  </div>

                  <div className="drap_area_wrapper">
                    <div className="form_items">
                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Viloyat nomi"
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Viloyat nomi kiritilishi shart",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form_actions">
                    <div className="footer_buttons">
                      <Button
                        loading={isRegionMutationLoading}
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

export default AddRegion;

