import { Form, Button, Spin, Breadcrumb } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import CustomDatePicker from "../../../components/inputs/customDatePicker";
import CustomSelect from "../../../components/inputs/customSelect";
import Icon from "../../../components/Icon";
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { BASE_URL } from "../../../consts/variables";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../components/notification";
import { useLocalization } from "../../../LocalizationContext";
import dayjs from "dayjs";

function AddFlight() {
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

  // Fetch stations for select
  const {
    data: stationsData,
    isPending: isStationsLoading,
  } = useFetchQuery({
    queryKey: ["stations-select"],
    url: `${BASE_URL}/station`,
    token: accessToken,
  });

  // Fetch employees for select
  const {
    data: employeesData,
    isPending: isEmployeesLoading,
  } = useFetchQuery({
    queryKey: ["employees-select"],
    url: `${BASE_URL}/employee`,
    token: accessToken,
  });

  const stations = stationsData?.data?.data || stationsData?.data || stationsData || [];
  const employees = employeesData?.data?.data || employeesData?.data || employeesData || [];

  const {
    data: flightData,
    isPending: isFlightLoading,
    isSuccess: isSuccessFlightData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `${BASE_URL}/train-schedule`,
    queryKey: [`train-schedule`, id],
    id: is_edit ? id : undefined,
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`train-schedule`, id],
      },
    },
    token: accessToken,
  });

  const flight = flightData?.data || flightData || {};

  const {
    mutate: CreateFlight,
    isPending: isFlightCreateLoading,
    isSuccess: isSuccessFlightCreated,
    data: flightCreateData,
    isError: isFlightCreateError,
    error: flightCreateError,
  } = useFetchMutation({
    url: is_edit ? `${BASE_URL}/train-schedule/${id}` : `${BASE_URL}/train-schedule`,
    invalidateKey: ["train-schedule"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && flight && Object.keys(flight).length > 0) {
      form.setFieldsValue({
        trainNumber: flight.trainNumber,
        departureStationId: flight.departureStationId,
        arrivalStationId: flight.arrivalStationId,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        departureDate: flight.departureDate ? dayjs(flight.departureDate) : null,
        arrivalDate: flight.arrivalDate ? dayjs(flight.arrivalDate) : null,
        staff: Array.isArray(flight.staff) && flight.staff.length > 0 
          ? flight.staff.map((s) => ({
              employeeId: s.employee?.id || s.employeeId,
              role: s.role,
            }))
          : [],
      });
      
      // Force form to update all fields
      setTimeout(() => {
        form.validateFields();
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight, is_edit]);

  const onFinish = (values) => {
    const body = {
      trainNumber: values.trainNumber,
      departureStationId: parseInt(values.departureStationId),
      arrivalStationId: parseInt(values.arrivalStationId),
      departureTime: values.departureTime,
      arrivalTime: values.arrivalTime,
      departureDate: values.departureDate ? values.departureDate.toISOString() : null,
      arrivalDate: values.arrivalDate ? values.arrivalDate.toISOString() : null,
      staff: (values.staff || []).map((staffMember) => ({
        employeeId: parseInt(staffMember.employeeId),
        role: staffMember.role,
      })),
    };
    CreateFlight(body);
  };

  useEffect(() => {
    if (isSuccessFlightCreated) {
      refetchData();
      const notificationDuration = is_edit ? 1 : 4.5;
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        flightCreateData?.message || t("messages").create_success,
        notificationDuration
      );
      setTimeout(() => {
        navigate("/flights");
      }, is_edit ? 1000 : 0);
    } else if (isFlightCreateError) {
      showNotification(
        "error",
        t("messages").error_2,
        flightCreateError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessFlightCreated, isFlightCreateError, is_edit]);

  useEffect(() => {
    if (is_edit) {
      if (!isFlightLoading && flight && isSuccessFlightData && is_edit) {
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
  }, [isFlightLoading, flight, is_edit]);

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
                        ? flight?.trainNumber || "Tahrirlash"
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
            initialValues={{ 
              remember: true,
              staff: [], // Initial empty staff array
            }}
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
                          label="Poyezd raqami"
                          name="trainNumber"
                          rules={[
                            {
                              required: true,
                              message: "Poyezd raqami kiritilishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Ketish stansiyasi"
                          name="departureStationId"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Ketish stansiyasi tanlanishi shart",
                            },
                          ]}
                          options={Array.isArray(stations) ? stations.map((station) => ({
                            label: station.name,
                            value: station.id,
                          })) : []}
                          loading={isStationsLoading}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Kelish stansiyasi"
                          name="arrivalStationId"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Kelish stansiyasi tanlanishi shart",
                            },
                          ]}
                          options={Array.isArray(stations) ? stations.map((station) => ({
                            label: station.name,
                            value: station.id,
                          })) : []}
                          loading={isStationsLoading}
                        />
                      </div>

                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Ketish vaqti"
                          name="departureTime"
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
                          name="arrivalTime"
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
                        <CustomDatePicker
                          isEdit={is_edit}
                          form={form}
                          label="Ketish sanasi"
                          name="departureDate"
                          rules={[
                            {
                              required: true,
                              message: "Ketish sanasi tanlanishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomDatePicker
                          isEdit={is_edit}
                          form={form}
                          label="Kelish sanasi"
                          name="arrivalDate"
                          rules={[
                            {
                              required: true,
                              message: "Kelish sanasi tanlanishi shart",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="staff_section" style={{ width: "100%", marginTop: 24 }}>
                    <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>Xodimlar</h4>
                    <Form.List name="staff">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <div key={key} style={{ 
                              display: "flex", 
                              gap: 16, 
                              marginBottom: 16,
                              alignItems: "flex-start",
                              padding: 16,
                              border: "1px solid #e0e0e4",
                              borderRadius: 8,
                              backgroundColor: "#f8f8f8"
                            }}>
                              <div style={{ flex: 1 }}>
                                <CustomSelect
                                  label="Xodim"
                                  name={[name, "employeeId"]}
                                  form={form}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Xodim tanlanishi shart",
                                    },
                                  ]}
                                  options={Array.isArray(employees) ? employees.map((employee) => ({
                                    label: employee.fullname,
                                    value: employee.id,
                                  })) : []}
                                  loading={isEmployeesLoading}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <CustomSelect
                                  label="Rol"
                                  name={[name, "role"]}
                                  form={form}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Rol tanlanishi shart",
                                    },
                                  ]}
                                  options={[
                                    { label: "Poyezd boshlig'i", value: "train_chief" },
                                    { label: "Vagon nazoratchisi", value: "wagon_supervisor" },
                                  ]}
                                />
                              </div>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                                style={{ marginTop: 32 }}
                              >
                                O'chirish
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                            style={{ marginTop: 8 }}
                          >
                            Xodim qo'shish
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </div>
                  
                  <div className="form_actions">
                    <div className="footer_buttons">
                      <Button
                        loading={isFlightCreateLoading}
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

export default AddFlight;
