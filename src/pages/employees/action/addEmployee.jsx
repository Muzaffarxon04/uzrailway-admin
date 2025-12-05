import { Form, Button, Spin, Breadcrumb } from "antd";
import PhoneNumberInput from "../../../components/inputs/phoneInput";
import CustomInput from "../../../components/inputs/customInput";
import CustomSelect from "../../../components/inputs/customSelect";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalization } from "../../../LocalizationContext";

// Mock data storage (in real app, this would be API)
const mockEmployeesData = [
  {
    id: 1,
    full_name: "Abdullayev Akmal Toshmatovich",
    phone_number: "+998901234567",
    role: "Lokomotiv haydovchisi",
    username: "akmal.abdullayev",
    status: "active",
    department: "Yuk tashish bo'limi",
    experience: "5 yil",
  },
  {
    id: 2,
    full_name: "Karimova Dilshoda Rustamovna",
    phone_number: "+998901234568",
    role: "Dispetcher",
    username: "dilshoda.karimova",
    status: "active",
    department: "Operatsion bo'lim",
    experience: "3 yil",
  },
  // ... other employees
];

function AddEmployee() {
  const [form] = Form.useForm();
  const { t } = useLocalization();
  const { id } = useParams();
  const navigate = useNavigate();

  const is_edit = id !== "add" && id !== undefined;
  const [opacity, setOpacity] = useState("0");
  const [loader, setLoader] = useState("1");
  const [employeeData, setEmployeeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate API call for getting employee data
  useEffect(() => {
    if (is_edit) {
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const employee = mockEmployeesData.find((emp) => emp.id === parseInt(id));
        setEmployeeData(employee);
        setIsLoading(false);
        setLoader("0");
        setOpacity("1");
      }, 500);
    } else {
      setLoader("0");
      setOpacity("1");
    }
  }, [id, is_edit]);

  useEffect(() => {
    if (is_edit && employeeData) {
      form.setFieldsValue({
        phone: employeeData.phone_number,
        name: employeeData.full_name,
        username: employeeData.username,
        role: employeeData.role,
        department: employeeData.department,
        experience: employeeData.experience,
        status: employeeData.status,
      });
    }
  }, [employeeData, is_edit, form]);

  const onFinish = (values) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Employee data:", values);
      setIsLoading(false);
      // In real app, navigate after successful API call
      navigate("/employees");
    }, 1000);
  };

  return (
    <>
      {is_edit && isLoading && (
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
                        ? employeeData?.full_name || "Tahrirlash"
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
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Ism kiritilishi shart",
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

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Foydalanuvchi nomi"
                          name="username"
                          rules={[
                            {
                              required: true,
                              message: "Foydalanuvchi nomi kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Lavozim"
                          name="role"
                          form={form}
                          defaultValue="Lokomotiv haydovchisi"
                          rules={[
                            {
                              required: true,
                              message: "Lavozim tanlanishi shart",
                            },
                          ]}
                          options={[
                            { label: "Lokomotiv haydovchisi", value: "Lokomotiv haydovchisi" },
                            { label: "Dispetcher", value: "Dispetcher" },
                            { label: "Yoqilg'i operatori", value: "Yoqilg'i operatori" },
                            { label: "Kassir", value: "Kassir" },
                            { label: "Texnik xodim", value: "Texnik xodim" },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Bo'lim"
                          name="department"
                          form={form}
                          defaultValue="Yuk tashish bo'limi"
                          rules={[
                            {
                              required: true,
                              message: "Bo'lim tanlanishi shart",
                            },
                          ]}
                          options={[
                            { label: "Yuk tashish bo'limi", value: "Yuk tashish bo'limi" },
                            { label: "Operatsion bo'lim", value: "Operatsion bo'lim" },
                            { label: "Yoqilg'i xizmati", value: "Yoqilg'i xizmati" },
                            { label: "Kassa bo'limi", value: "Kassa bo'limi" },
                            { label: "Texnik xizmat", value: "Texnik xizmat" },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Tajriba"
                          name="experience"
                          rules={[
                            {
                              required: true,
                              message: "Tajriba kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Holat"
                          name="status"
                          form={form}
                          defaultValue="active"
                          rules={[
                            {
                              required: true,
                              message: "Holat tanlanishi shart",
                            },
                          ]}
                          options={[
                            { label: "Faol", value: "active" },
                            { label: "Nofaol", value: "inactive" },
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

        <div className="footer">
          <div className="footer_wrapper">
            <div className="footer_buttons">
              <Button
                loading={isLoading}
                onClick={() => form.submit()}
                type="primary"
              >
                {is_edit ? "Saqlash" : "Qo'shish"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AddEmployee;

