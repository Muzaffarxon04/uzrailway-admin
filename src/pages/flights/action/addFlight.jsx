import { Form, Button, Spin, Breadcrumb } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import CustomDatePicker from "../../../components/inputs/customDatePicker";
import CustomSelect from "../../../components/inputs/customSelect";
import Icon from "../../../components/Icon";
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { useEffect, useState, useMemo } from "react";
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

  // Fetch trains for select
  const {
    data: trainsData,
    isPending: isTrainsLoading,
  } = useFetchQuery({
    queryKey: ["trains-select"],
    url: `train/list/`,
    params: { page: 1, page_size: 1000 },
    token: accessToken,
  });

  const trains = trainsData?.data || [];

  // Fetch stations for select
  const {
    data: stationsData,
    isPending: isStationsLoading,
  } = useFetchQuery({
    queryKey: ["stations-select"],
    url: `stations/list/`,
    params: { page: 1, page_size: 1000 },
    token: accessToken,
  });

  const stations =
    stationsData?.data ||
    (Array.isArray(stationsData) ? stationsData : []);

  const {
    data: tripData,
    isPending: isTripLoading,
    isSuccess: isSuccessTripData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `trips/detail/${id}/`,
    queryKey: [`trip-detail`, id],
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`trip-detail`, id],
      },
    },
    token: accessToken,
  });

  const trip = useMemo(() => tripData?.data || tripData || {}, [tripData]);

  const {
    mutate: CreateTrip,
    isPending: isTripCreateLoading,
    isSuccess: isSuccessTripCreated,
    data: tripCreateData,
    isError: isTripCreateError,
    error: tripCreateError,
  } = useFetchMutation({
    url: is_edit ? `trips/update/${id}/` : `trips/create/`,
    invalidateKey: ["trips"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && trip && Object.keys(trip).length > 0) {
      form.setFieldsValue({
        train: trip.train?.id || trip.train,
        departure_station:
          trip.departure_station?.id || trip.departure_station || null,
        arrival_station:
          trip.arrival_station?.id || trip.arrival_station || null,
        scheduled_departure: trip.scheduled_departure ? dayjs(trip.scheduled_departure) : null,
        scheduled_arrival: trip.scheduled_arrival ? dayjs(trip.scheduled_arrival) : null,
        intermediate_stations: trip.intermediate_stations || [],
      });
      
      // Force form to update all fields
      setTimeout(() => {
        form.validateFields();
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip, is_edit]);

  const onFinish = (values) => {
    const body = {
      train: parseInt(values.train),
      departure_station: values.departure_station ? parseInt(values.departure_station) : null,
      arrival_station: values.arrival_station ? parseInt(values.arrival_station) : null,
      scheduled_departure: values.scheduled_departure ? values.scheduled_departure.format("YYYY-MM-DDTHH:mm:ss") : null,
      scheduled_arrival: values.scheduled_arrival ? values.scheduled_arrival.format("YYYY-MM-DDTHH:mm:ss") : null,
      intermediate_stations: (values.intermediate_stations || []).map((station) => ({
        name: station.name,
        arrival: station.arrival,
        departure: station.departure,
      })),
    };
    CreateTrip(body);
  };

  useEffect(() => {
    if (isSuccessTripCreated) {
      refetchData();
      showNotification(
        "success",
        is_edit ? "Reys yangilandi" : "Reys qo'shildi",
        tripCreateData?.message || (is_edit ? "Reys muvaffaqiyatli yangilandi" : "Reys muvaffaqiyatli qo'shildi")
      );
      navigate("/flights");
    } else if (isTripCreateError) {
      showNotification(
        "error",
        t("messages").error_2,
        tripCreateError?.message || t("messages").error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessTripCreated, isTripCreateError]);

  useEffect(() => {
    if (is_edit) {
      if (!isTripLoading && trip && Object.keys(trip).length > 0 && isSuccessTripData && is_edit) {
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
  }, [isTripLoading, trip, is_edit, isSuccessTripData]);

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
                        ? trip?.trip_number || "Tahrirlash"
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
              intermediate_stations: [],
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
                        <CustomSelect
                          label="Poyezd"
                          name="train"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Poyezd tanlanishi shart",
                            },
                          ]}
                          options={Array.isArray(trains) ? trains.map((train) => ({
                            label: `${train.train_number} - ${train.train_name}`,
                            value: train.id,
                          })) : []}
                          loading={isTrainsLoading}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Jo'nash stanstiyasi"
                          name="departure_station"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Jo'nash stanstiyasi tanlanishi shart",
                            },
                          ]}
                          options={
                            Array.isArray(stations)
                              ? stations.map((station) => ({
                                  label: station.name,
                                  value: station.id,
                                }))
                              : []
                          }
                          loading={isStationsLoading}
                        />
                      </div>

                      <div className="input_item">
                        <CustomSelect
                          label="Etib borish stanstiyasi"
                          name="arrival_station"
                          form={form}
                          rules={[
                            {
                              required: true,
                              message: "Etib borish stanstiyasi tanlanishi shart",
                            },
                          ]}
                          options={
                            Array.isArray(stations)
                              ? stations.map((station) => ({
                                  label: station.name,
                                  value: station.id,
                                }))
                              : []
                          }
                          loading={isStationsLoading}
                        />
                      </div>

                      <div className="input_item">
                        <CustomDatePicker
                          isEdit={is_edit}
                          form={form}
                          label="Jo'nash vaqti"
                          name="scheduled_departure"
                          showTime
                          format="YYYY-MM-DD HH:mm"
                          rules={[
                            {
                              required: true,
                              message: "Jo'nash vaqti tanlanishi shart",
                            },
                          ]}
                        />
                      </div>

                      <div className="input_item">
                        <CustomDatePicker
                          isEdit={is_edit}
                          form={form}
                          label="Etib borish vaqti"
                          name="scheduled_arrival"
                          showTime
                          format="YYYY-MM-DD HH:mm"
                          rules={[
                            {
                              required: true,
                              message: "Etib borish vaqti tanlanishi shart",
                            },
                          ]}
                        />
                      </div>

                    </div>
                  </div>
                  
                  <div className="intermediate_stations_section" style={{ width: "100%", marginTop: 24 }}>
                    <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>O'rta stanstiyalar</h4>
                    <Form.List name="intermediate_stations">
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
                                <CustomInput
                                  label="Stanstiya nomi"
                                  name={[name, "name"]}
                                  form={form}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Stanstiya nomi kiritilishi shart",
                                    },
                                  ]}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <CustomInput
                                  label="Kelish vaqti"
                                  name={[name, "arrival"]}
                                  form={form}
                                  placeholder="HH:MM"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Kelish vaqti kiritilishi shart",
                                    },
                                  ]}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <CustomInput
                                  label="Jo'nash vaqti"
                                  name={[name, "departure"]}
                                  form={form}
                                  placeholder="HH:MM"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Jo'nash vaqti kiritilishi shart",
                                    },
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
                            O'rta stanstiya qo'shish
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </div>
                  
                  <div className="form_actions">
                    <div className="footer_buttons">
                      <Button
                        loading={isTripCreateLoading}
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
