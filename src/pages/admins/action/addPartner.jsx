import { Form, Button, Spin, Breadcrumb } from "antd";
import PhoneNumberInput from "../../../components/inputs/phoneInput";
import CustomInput from "../../../components/inputs/customInput";
import CustomSelect from "../../../components/inputs/customSelect";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { BASE_URL } from "../../../consts/variables";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useNotification } from "../../../components/notification";
import { useParams } from "react-router-dom";
import { useLocalization } from "../../../LocalizationContext";



function AddPartner() {
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
  const [isInner] = useState(false);

  const {
    data: partnerDatas,
    isPending: isPartnerLoading,
    isSuccess: isSuccessPartnerData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `${BASE_URL}/executer`,
    queryKey: [`executer`, id],
    id: id,
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`executer`, id],
      },
    },
    token: accessToken,
  });

  const partnerData = partnerDatas?.data || [];

  const {
    mutate: CreatePartner,
    isPending: isPatnerCreateLoading,
    isSuccess: isSuccessPartnerCreated,
    data: partnerCreateData,
    isError: isPartnerCreateError,
    error: partnerCreateError,
  } = useFetchMutation({
    url: `${BASE_URL}/executer${is_edit ? `/${partnerData.id}` : ""}`,
    invalidateKey: ["executer"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });


  useEffect(() => {
    if (is_edit && partnerData) {
      form.setFieldsValue({
        phone: partnerData.phone_number,
        name: partnerData.full_name,
        username: partnerData.username,
        // password: partnerData.password,
        role: partnerData.role,
      });
    
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerData, is_edit]);





  const onFinish = (values) => {
    const body = {
      "full_name": values.name,
      "phone_number": values.phone,
      "role":values.role
    }
    if (values.password) {
      body.password=values.password
    }
if (values.username !==  partnerData.username) {
  
  body.username= values.username
}

    CreatePartner(body);
  };

  useEffect(() => {
    if (isSuccessPartnerCreated) {
      refetchData();
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        partnerCreateData?.message || t("messages").create_success
      );

      navigate("/admins");

      // replace(window.location);
    } else if (isPartnerCreateError) {
      showNotification(
        "error",
        t("messages").error_2,
        partnerCreateError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessPartnerCreated, isPartnerCreateError, is_edit]);

  useEffect(() => {
    if (is_edit) {
      // partnerData?.status === "ARCHIVE" ? setIsInner(true) : setIsInner(false);
      if (!isPartnerLoading && partnerData && isSuccessPartnerData && is_edit) {
        setLoader("0");
        setOpacity("1");
      } else {
        setLoader("1");
        setOpacity("0");
      }
    } else {
      setLoader("0");
      setOpacity("1");
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPartnerLoading, partnerData, is_edit]);

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
                {isInner
                  ? "View Partner"
                  : is_edit
                  ? `${t("Pages").action?.edit_partner}`
                  : `${t("Pages").action?.add_partner}`}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: `${t("Partner_infos").partners_list}`,
                      href: "/admins",
                    },
                    {
                      title: is_edit
                        ? partnerData?.name
                        : `${t("Pages").action?.add_partner}`,
                      href: "",
                    },
                  ]}
                />
              </span>
            </div>
          </div>
        </div>

        <div
          className={
            isInner ? "partner_action partner_inner" : "partner_action"
          }
        >
          <Form
            name="normal_login"
            className="action_form"
            form={form}
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <div className="action_wrapper">
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>{t("Common").info}</h3>
                  </div>
              
                  <div className="drap_area_wrapper">   
                    <div className="form_items">
                      <div className="input_item">
                        <CustomInput
                          disabled={isInner}
                          isEdit={is_edit}
                          form={form}
                          label={t("Partner_infos").name}
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: t("Common").name_required,
                            },
                          ]}
                        />
                      </div>
                   
                         <div className="input_item">
                      <PhoneNumberInput
                        isEdit={is_edit}
                        form={form}
                        label={t("Auth").phone_number}
                        name="phone"
                        disabled={isInner}
                        rules={[
                          {
                            required: true,
                            message: t("Common").phone_required,
                          },
                          {
                            // pattern: phoneNumberRegex,
                            // message: "+998 ** *** ** **",
                          },
                        ]}
                      />
                    </div>
                       <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          disabled={isInner}
                          form={form}
                          label={t("Partner_infos").username}
                          name="username"
                          rules={[
                            {
                              required: true,
                              message: t("Common").address_required,
                            },
                          ]}
                        />
                      </div>
     <div className="input_item">
                      <CustomInput
                        isEdit={is_edit}
                        disabled={isInner}
                        form={form}
                        label={t("Common").password}
                        name="password"
                        // type="number"
                        rules={[
                          {
                            required:is_edit ? false : true,
                            message: t("Partner_infos").card_required,
                          },
                          // {
                          //   pattern: /^[0-9]+$/, // Ensures only digits
                          //   message: "Only numbers are allowed",
                          // },
                        ]}
                      />
                    </div>

                         <div className="input_item">
                       <CustomSelect
                         label={t("Common").card_label}

  name="role"
  form={form}
      disabled={isInner}
      defaultValue={"dispatcher"}
 rules={[
                          {
                            required: true,
                            message: t("Partner_infos").card_required,
                          },
                        
                        ]}
  options={[
    { label: "dispatcher", value: "dispatcher" },
    { label: "fueler", value: "fueler" },
  ]}
/>
        
                    </div>

                  
                    </div>
                  </div>
                </div>
              </div>
           
            </div>
          </Form>
        </div>

        {!isInner && (
          <div className="footer">
            <div className="footer_wrapper">
              <div className="footer_buttons">
                {/* {is_edit && (
                  <div
                    className="delete_btn"
                    onClick={() => setModalVisible(true)}
                  >
                    <Icon icon="ic_trash" />
                    <span>Delete partner</span>
                  </div>
                )} */}
                <Button
                  loading={isPatnerCreateLoading}
                  onClick={() => form.submit()}
                  type="primary"
                >
                  {is_edit
                    ? t("Partner_infos").save_partner
                    : t("Partner_infos").add_partner}
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
export default AddPartner;
