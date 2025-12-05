import { Form, Button, Spin, Breadcrumb } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import CustomDatePicker from "../../../components/inputs/customDatePicker";
import CustomSelect from "../../../components/inputs/customSelect";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

// Mock data storage
const mockFlightsData = [
  {
    id: 1,
    flight_number: "RE-001",
    route: "Toshkent - Samarqand",
    departure_time: "08:00",
    arrival_time: "12:30",
    train_type: "Yuk poyezdi",
    status: "active",
    locomotive_number: "L-1234",
    driver: "Abdullayev Akmal Toshmatovich",
    cargo_weight: "500 tonna",
    date: "2024-01-15",
  },
  // ... other flights
];

function AddFlight() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const is_edit = id !== "add" && id !== undefined;
  const [opacity, setOpacity] = useState("0");
  const [loader, setLoader] = useState("1");
  const [flightData, setFlightData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate API call
  useEffect(() => {
    if (is_edit) {
      setIsLoading(true);
      setTimeout(() => {
        const flight = mockFlightsData.find((f) => f.id === parseInt(id));
        setFlightData(flight);
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
    if (is_edit && flightData) {
      form.setFieldsValue({
        flight_number: flightData.flight_number,
        route: flightData.route,
        departure_time: flightData.departure_time,
        arrival_time: flightData.arrival_time,
        train_type: flightData.train_type,
        locomotive_number: flightData.locomotive_number,
        driver: flightData.driver,
        cargo_weight: flightData.cargo_weight,
        status: flightData.status,
        date: flightData.date ? dayjs(flightData.date) : null,
      });
    }
  }, [flightData, is_edit, form]);

  const onFinish = (values) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Flight data:", values);
      setIsLoading(false);
      navigate("/flights");
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
                {is_edit ? "Reysni tahrirlash" : "Yangi reys qo'shish"}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: "Reyslar ro'yxati",
                      href: "/flights",
                    },
                    {
                      title: is_edit
                        ? flightData?.flight_number || "Tahrirlash"
                        : "Yangi reys",
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
            name="flight_form"
            className="action_form"
            form={form}
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <div className="action_wrapper">
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>Reys ma'lumotlari</h3>
                  </div>

                  <div className="drap_area_wrapper">
                    <div className="form_items">
                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Reys raqami"
                          name="flight_number"
                          rules={[
                            {
                              required: true,
                              message: "Reys raqami kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Marshrut"
                          name="route"
                          rules={[
                            {
                              required: true,
                              message: "Marshrut kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Poyezd turi"
                          name="train_type"
                          form={form}
                          defaultValue="Yuk poyezdi"
                          rules={[
                            {
                              required: true,
                              message: "Poyezd turi tanlanishi shart",
                            },
                          ]}
                          options={[
                            { label: "Yuk poyezdi", value: "Yuk poyezdi" },
                            { label: "Yo'lovchi poyezdi", value: "Yo'lovchi poyezdi" },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Ketish vaqti"
                          name="departure_time"
                          placeholder="HH:MM"
                          rules={[
                            {
                              required: true,
                              message: "Ketish vaqti kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Kelish vaqti"
                          name="arrival_time"
                          placeholder="HH:MM"
                          rules={[
                            {
                              required: true,
                              message: "Kelish vaqti kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Lokomotiv raqami"
                          name="locomotive_number"
                          rules={[
                            {
                              required: true,
                              message: "Lokomotiv raqami kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Haydovchi"
                          name="driver"
                          rules={[
                            {
                              required: true,
                              message: "Haydovchi kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Yuk og'irligi"
                          name="cargo_weight"
                          placeholder="tonna"
                          rules={[
                            {
                              required: false,
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomDatePicker
                          isEdit={is_edit}
                          form={form}
                          label="Sana"
                          name="date"
                          rules={[
                            {
                              required: true,
                              message: "Sana tanlanishi shart",
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
                            { label: "Yakunlangan", value: "completed" },
                            { label: "Kechikkan", value: "delayed" },
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

export default AddFlight;

