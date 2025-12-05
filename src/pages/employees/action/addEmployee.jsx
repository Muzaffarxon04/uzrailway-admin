import { Form, Button, Spin, Breadcrumb } from "antd";
import PhoneNumberInput from "../../../components/inputs/phoneInput";
import CustomInput from "../../../components/inputs/customInput";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { BASE_URL } from "../../../consts/variables";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../components/notification";
import { useLocalization } from "../../../LocalizationContext";

function AddEmployee() {
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
    data: employeeData,
    isPending: isEmployeeLoading,
    isSuccess: isSuccessEmployeeData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `${BASE_URL}/employee`,
    queryKey: [`employee`, id],
    id: is_edit ? id : undefined,
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`employee`, id],
      },
    },
    token: accessToken,
  });

  const employee = employeeData?.data || employeeData || {};

  const {
    mutate: CreateEmployee,
    isPending: isEmployeeCreateLoading,
    isSuccess: isSuccessEmployeeCreated,
    data: employeeCreateData,
    isError: isEmployeeCreateError,
    error: employeeCreateError,
  } = useFetchMutation({
    url: is_edit ? `${BASE_URL}/employee/${id}` : `${BASE_URL}/employee`,
    invalidateKey: ["employees"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && employee) {
      form.setFieldsValue({
        fullname: employee.fullname,
        phone: employee.phone,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee, is_edit]);

  const onFinish = (values) => {
    const body = {
      fullname: values.fullname,
      phone: values.phone,
    };
    CreateEmployee(body);
  };

  useEffect(() => {
    if (isSuccessEmployeeCreated) {
      refetchData();
      const notificationDuration = is_edit ? 1 : 4.5; // 1 second for update, 4.5 for create
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        employeeCreateData?.message || t("messages").create_success,
        notificationDuration
      );
      setTimeout(() => {
        navigate("/employees");
      }, is_edit ? 1000 : 0); // Navigate after 1 second for update, immediately for create
    } else if (isEmployeeCreateError) {
      showNotification(
        "error",
        t("messages").error_2,
        employeeCreateError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessEmployeeCreated, isEmployeeCreateError, is_edit]);

  useEffect(() => {
    if (is_edit) {
      if (!isEmployeeLoading && employee && isSuccessEmployeeData && is_edit) {
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
  }, [isEmployeeLoading, employee, is_edit]);

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
                {is_edit ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: "Xodimlar ro'yxati",
                      href: "/employees",
                    },
                    {
                      title: is_edit
                        ? employee?.fullname || "Tahrirlash"
                        : "Yangi xodim",
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
            name="employee_form"
            className="action_form"
            form={form}
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <div className="action_wrapper">
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>Xodim ma'lumotlari</h3>
                  </div>

                  <div className="drap_area_wrapper">
                    <div className="form_items">
                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="To'liq ism"
                          name="fullname"
                          rules={[
                            {
                              required: true,
                              message: "To'liq ism kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <PhoneNumberInput
                          isEdit={is_edit}
                          form={form}
                          label="Telefon raqami"
                          name="phone"
                          rules={[
                            {
                              required: true,
                              message: "Telefon raqami kiritilishi shart",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form_actions">
                    <div className="footer_buttons">
                      <Button
                        loading={isEmployeeCreateLoading}
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

export default AddEmployee;
