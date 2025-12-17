import { Form, Button, Spin, Breadcrumb } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import CustomSelect from "../../../components/inputs/customSelect";
import CustomDatePicker from "../../../components/inputs/customDatePicker";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../components/notification";
import { useLocalization } from "../../../LocalizationContext";
import dayjs from "dayjs";

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

  // Fetch positions for select
  const {
    data: positionsData,
    isPending: isPositionsLoading,
  } = useFetchQuery({
    queryKey: ["positions-select"],
    url: `settings/position/list/`,
    params: { page: 1, page_size: 1000 },
    token: accessToken,
  });

  // Fetch departments for select
  const {
    data: departmentsData,
    isPending: isDepartmentsLoading,
  } = useFetchQuery({
    queryKey: ["departments-select"],
    url: `settings/department/list/`,
    params: { page: 1, page_size: 1000 },
    token: accessToken,
  });

  const positions = positionsData?.data || (Array.isArray(positionsData) ? positionsData : []);
  const departments = departmentsData?.data || (Array.isArray(departmentsData) ? departmentsData : []);

  const {
    data: employeeData,
    isPending: isEmployeeLoading,
    isSuccess: isSuccessEmployeeData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `auth/employee/detail/${id}/`,
    queryKey: [`employee-detail`, id],
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`employee-detail`, id],
      },
    },
    token: accessToken,
  });

  const employee = useMemo(() => employeeData?.data || employeeData || {}, [employeeData]);

  const {
    mutate: handleEmployeeMutation,
    isPending: isEmployeeMutationLoading,
    isSuccess: isSuccessEmployeeMutation,
    data: employeeMutationData,
    isError: isEmployeeMutationError,
    error: employeeMutationError,
  } = useFetchMutation({
    url: is_edit ? `auth/employee/update/${id}/` : `auth/employee/create/`,
    invalidateKey: ["employees"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && employee && Object.keys(employee).length > 0) {
      form.setFieldsValue({
        employee_id: employee.employee_id,
        firstName: employee.firstName || employee.first_name,
        lastName: employee.lastName || employee.last_name,
        phone: employee.phone || employee.phone_number,
        email: employee.email,
        startDate: employee.startDate ? dayjs(employee.startDate) : null,
        endDate: employee.endDate ? dayjs(employee.endDate) : null,
        gender: employee.gender === 1 ? "male" : employee.gender === 2 ? "female" : employee.gender,
        position_id: employee.position?.id || employee.position_id,
        department_id: employee.department?.id || employee.department_id,
      });
    }
  }, [employee, is_edit, form]);

  const onFinish = (values) => {
    const body = {
      firstName: values.firstName || "",
      lastName: values.lastName || "",
      email: values.email || "",
      phone: values.phone || "",
      startDate: values.startDate ? dayjs(values.startDate).format("YYYY-MM-DD") : null,
      endDate: values.endDate ? dayjs(values.endDate).format("YYYY-MM-DD") : null,
      gender: values.gender === "male" ? 1 : values.gender === "female" ? 2 : null,
      position_id: values.position_id ? parseInt(values.position_id) : null,
      department_id: values.department_id ? parseInt(values.department_id) : null,
    };
    
    // Add employee_id only if it has a value
    if (values.employee_id && values.employee_id.trim() !== "") {
      body.employee_id = values.employee_id.trim();
    }
    
    handleEmployeeMutation(body);
  };

  useEffect(() => {
    if (isSuccessEmployeeMutation) {
      refetchData();
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        employeeMutationData?.message || t("messages").create_success
      );
      navigate("/employees");
    } else if (isEmployeeMutationError) {
      showNotification(
        "error",
        t("messages").error_2,
        employeeMutationError?.message || t("messages").error
      );
    }
  }, [isSuccessEmployeeMutation, isEmployeeMutationError, is_edit, navigate, refetchData, showNotification, t, employeeMutationData?.message, employeeMutationError?.message]);

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
  }, [isEmployeeLoading, employee, is_edit, isSuccessEmployeeData]);

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
                        ? `${employee?.firstName || employee?.first_name || ""} ${employee?.lastName || employee?.last_name || ""}`.trim() || "Tahrirlash"
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
            initialValues={{}}
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
                          label="Xodim ID"
                          name="employee_id"
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Ism"
                          name="firstName"
                          rules={[
                            {
                              required: true,
                              message: "Ism kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Familiya"
                          name="lastName"
                          rules={[
                            {
                              required: true,
                              message: "Familiya kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Email"
                          name="email"
                          rules={[
                            {
                              type: "email",
                              message: "Email formati noto'g'ri",
                            },
                            {
                              required: true,
                              message: "Email kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
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

                      <div className="input_item">
                        <CustomSelect
                          label="Jins"
                          name="gender"
                          form={form}
                          options={[
                            { label: "Erkak", value: "male" },
                            { label: "Ayol", value: "female" },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomDatePicker
                          isEdit={is_edit}
                          form={form}
                          label="Boshlanish sanasi"
                          name="startDate"
                          format="YYYY-MM-DD"
                        />
                      </div>

                      <div className="input_item">
                        <CustomDatePicker
                          isEdit={is_edit}
                          form={form}
                          label="Tugash sanasi"
                          name="endDate"
                          format="YYYY-MM-DD"
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Lavozim"
                          name="position_id"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Lavozim tanlanishi shart",
                            },
                          ]}
                          options={Array.isArray(positions) ? positions.map((position) => ({
                            label: position.name || position.position_name,
                            value: position.id,
                          })) : []}
                          loading={isPositionsLoading}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Bo'lim"
                          name="department_id"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Bo'lim tanlanishi shart",
                            },
                          ]}
                          options={Array.isArray(departments) ? departments.map((department) => ({
                            label: department.name || department.department_name,
                            value: department.id,
                          })) : []}
                          loading={isDepartmentsLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form_actions">
                    <div className="footer_buttons">
                      <Button
                        loading={isEmployeeMutationLoading}
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

