import { Form, Button, Spin, Breadcrumb } from "antd";
// import PhoneNumberInput from "../../../components/inputs/phoneInput";
import CustomInput from "../../../components/inputs/customInput";
// import CustomSelect from "../../../components/inputs/customSelect";
import CustomDatePicker from "../../../components/inputs/customDatePicker";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { BASE_URL } from "../../../consts/variables";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useNotification } from "../../../components/notification";
import { useParams } from "react-router-dom";
import { useLocalization } from "../../../LocalizationContext";
import dayjs from "dayjs";


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
    url: `${BASE_URL}/total-grosses`,
    queryKey: [`total-grosses`, id],
    id: id,
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`total-grosses`, id],
      },
    },
    token: accessToken,
  });

  const partnerData = partnerDatas?.data || [];

  const {
    mutate: CreateLoad,
    isPending: isPatnerCreateLoading,
    isSuccess: isSuccessPartnerCreated,
    data: partnerCreateData,
    isError: isPartnerCreateError,
    error: partnerCreateError,
  } = useFetchMutation({
    url: `${BASE_URL}/total-grosses${is_edit ? `/${partnerData.id}` : ""}`,
    invalidateKey: ["total-grosses"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });


 useEffect(() => {
  if (is_edit && partnerData) {
    form.setFieldsValue({
      driver_fullname: partnerData.driver_fullname,
      truck_id: partnerData.truck_id,
      load_number: partnerData.load_number,
      pu: partnerData.pu,
      del: partnerData.del,
      del_date: partnerData.del_date ? dayjs(+partnerData.del_date) : null,
      loaded_miles: partnerData.loaded_miles,
      empty_miles: partnerData.empty_miles,
      total_miles: partnerData.total_miles,
      gross: partnerData.gross,
      // payment: partnerData.payment,
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [partnerData, is_edit]);





const onFinish = (values) => {
  const body = {
    driver_fullname: values.driver_fullname,
    truck_id: values.truck_id,
    load_number: values.load_number,
    pu: values.pu,
    del: values.del,
    del_date: values.del_date ? values.del_date.valueOf() : null, // DatePicker dan timestamp formatida
    loaded_miles: parseFloat(values.loaded_miles),
    empty_miles: parseFloat(values.empty_miles),
    total_miles: parseFloat(values.total_miles),
    gross: parseFloat(values.gross),
    // payment: parseFloat(values.payment),
  };

  CreateLoad(body); // Yoki kerakli API funksiyasini chaqiring
};

  useEffect(() => {
    if (isSuccessPartnerCreated) {
      refetchData();
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        partnerCreateData?.message || t("messages").create_success
      );

      navigate("/totalgrosses");

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
                  ? `${t("Partner_infos").edit_total_grosses}`
                  : `${t("Partner_infos").add_total_grosses}`}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: `${t("Partner_infos").totalgross_list}`,
                      href: "/totalgrosses",
                    },
                    {
                      title: is_edit
                        ? partnerData?.driver_fullname
                        : `${t("Partner_infos").add_total_grosses}`,
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
                    <h3>{t("Partner_infos").total_grosses_info}</h3>
                  </div>
              
                  <div className="drap_area_wrapper">   
              <div className="form_items">
  <div className="input_item">
    <CustomInput
      form={form}
          isEdit={is_edit}
      label="Driver Fullname"
      name="driver_fullname"
      rules={[{ required: true, message: "Driver fullname is required" }]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      form={form}
          isEdit={is_edit}
      label="Truck ID"
      name="truck_id"
      rules={[{ required: true, message: "Truck ID is required" }]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      form={form}
          isEdit={is_edit}
      label="Load Number"
      name="load_number"
      rules={[{ required: true, message: "Load number is required" }]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      form={form}
          isEdit={is_edit}
      label="Pick-up Location (PU)"
      name="pu"
      rules={[{ required: true, message: "Pick-up location is required" }]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      form={form}
          isEdit={is_edit}
      label="Delivery Location (DEL)"
      name="del"
      rules={[{ required: true, message: "Delivery location is required" }]}
    />
  </div>

  <div className="input_item">
    <CustomDatePicker
     format="MM/DD/YYYY"
form={form}

      placeholder=""
          isEdit={is_edit}
      label="Delivery Date"
      name="del_date"
      rules={[{ required: true, message: "Delivery date is required" }]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      form={form}
          isEdit={is_edit}
      label="Loaded Miles"
      name="loaded_miles"
      type="number"
      rules={[{ required: true, message: "Loaded miles is required" }]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      form={form}
          isEdit={is_edit}
      label="Empty Miles"
      name="empty_miles"
      type="number"
      rules={[{ required: true, message: "Empty miles is required" }]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      form={form}
          isEdit={is_edit}
      label="Total Miles"
      name="total_miles"
      type="number"
      rules={[{ required: true, message: "Total miles is required" }]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      form={form}
          isEdit={is_edit}
      label="Gross"
      name="gross"
      type="number"
      rules={[{ required: true, message: "Gross is required" }]}
    />
  </div>

  {/* <div className="input_item">
    <CustomInput
      form={form}
          isEdit={is_edit}
      label="Payment"
      name="payment"
      type="number"
      rules={[{ required: true, message: "Payment is required" }]}
    />
  </div> */}
</div>

                  </div>
                  
                  {!isInner && (
                    <div className="form_actions">
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
                  )}
                </div>
              </div>
           
            </div>
          </Form>
        </div>
      </section>
    </>
  );
}
export default AddPartner;
