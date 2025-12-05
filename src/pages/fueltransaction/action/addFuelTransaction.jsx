import { Form, Button, Spin, Breadcrumb } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import CustomDatePicker from "../../../components/inputs/customDatePicker";
// import CustomSelect from "../../../components/inputs/customSelect";
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
    url: `${BASE_URL}/fuel-transactions`,
    queryKey: [`fuel-transactions`, id],
    id: id,
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`fuel-transactions`, id],
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
    url: `${BASE_URL}/fuel-transactions${is_edit ? `/${partnerData.id}` : ""}`,
    invalidateKey: ["fuel-transactions"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });


useEffect(() => {
  if (is_edit && partnerData) {
    form.setFieldsValue({
      driver_fullname: partnerData.driver_fullname,
      // type: partnerData.type,
      quantity: partnerData.quantity,
      description: partnerData.description,
      product: partnerData.product,
      city: partnerData.city,
      state: partnerData.state,
      total_invoice_amount: partnerData.total_invoice_amount,
      created_at: partnerData.created_at ? dayjs(+partnerData.created_at) : null,
      
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [partnerData, is_edit]);





const onFinish = (values) => {
  const body = {
    driver_fullname: values.driver_fullname,
    type: "Fuel",
    // || values.type,
    created_at: values.created_at ? values.created_at.valueOf() : null, // DatePicker dan timestamp formatida
    quantity: parseFloat(values.quantity),
    description: values.description,
    product: values.product,
    city: values.city,
    state: values.state,
    truck_id: values.truck_id,
    total_invoice_amount: parseFloat(values.total_invoice_amount),
  };

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

      navigate("/fueltransaction");

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
                  ? `${t("Partner_infos")?.edit_fuel_transaction}`
                  : `${t("Partner_infos")?.add_fuel_transaction}`}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: `${t("Partner_infos").fueltransaction_list}`,
                      href: "/fueltransaction",
                    },
                    {
                      title: is_edit
                        ? partnerData?.driver_fullname
                        : `${t("Partner_infos")?.add_fuel_transaction}`,
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
                    <h3>{t("Partner_infos").fuel_transaction_info}</h3>
                  </div>
              
                  <div className="drap_area_wrapper">   
             <div className="form_items">
  <div className="input_item">
    <CustomInput
      disabled={isInner}
      isEdit={is_edit}
      form={form}
      label="Driver Fullname"
      name="driver_fullname"
      rules={[
        { required: true, message: "Driver name is required" },
      ]}
    />
  </div>

  {/* <div className="input_item">
    <CustomSelect
      label="Fuel Type"
      name="type"
      form={form}
      disabled={isInner}
      defaultValue={"fuel"}
      rules={[
        { required: true, message: "Fuel type is required" },
      ]}
      options={[
        { label: "Fuel", value: "Fuel" },
        { label: "Gas", value: "Gas" },
        { label: "Diesel", value: "Diesel" },
        { label: "Electric", value: "Electric" },
      ]}
    />
  </div> */}

  <div className="input_item">
    <CustomInput
      isEdit={is_edit}
      disabled={isInner}
      form={form}
      
      label="Truck ID"
      name="truck_id"
      rules={[
        { required: true, message: "Truck ID is required" },
      ]}
    />
  </div>
  <div className="input_item">
    <CustomInput
      disabled={isInner}
      isEdit={is_edit}
      form={form}
      label="Quantity"
      name="quantity"
      type="number"
      rules={[
        { required: true, message: "Quantity is required" },
      ]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      disabled={isInner}
      isEdit={is_edit}
      form={form}
      label="Description"
      name="description"
      rules={[
        { required: true, message: "Description is required" },
      ]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      disabled={isInner}
      isEdit={is_edit}
      form={form}
      label="Product"
      name="product"
      rules={[
        { required: true, message: "Product is required" },
      ]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      disabled={isInner}
      isEdit={is_edit}
      form={form}
      label="City"
      name="city"
      rules={[
        { required: true, message: "City is required" },
      ]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      disabled={isInner}
      isEdit={is_edit}
      form={form}
      label="State"
      name="state"
      rules={[
        { required: true, message: "State is required" },
      ]}
    />
  </div>

  <div className="input_item">
    <CustomInput
      disabled={isInner}
      isEdit={is_edit}
      form={form}
      label="Total Invoice Amount"
      name="total_invoice_amount"
      type="number"
      rules={[
        { required: true, message: "Total invoice amount is required" },
      ]}
    />
 
  </div>
       <div className="input_item">
    <CustomDatePicker
     format="MM/DD/YYYY"
form={form}

      placeholder=""
          isEdit={is_edit}
      label="Created Date"
      name="created_at"
      rules={[{ required: true, message: "Created Date is required" }]}
    />
  </div>
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
                            : t("Partner_infos")?.add_fuel_transaction}
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
