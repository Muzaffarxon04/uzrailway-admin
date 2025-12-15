import { Form, Button, Breadcrumb, Card, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "../../../components/inputs/customSelect";
import CustomInput from "../../../components/inputs/customInput";
import TextArea from "antd/es/input/TextArea";
import Icon from "../../../components/Icon";
import useUniversalFetch from "../../../Hooks/useApi";
import { useNotification } from "../../../components/notification";
import { useLocalization } from "../../../LocalizationContext";

function AddAssignment() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLocalization();
  const { useFetchQuery, useFetchMutation } = useUniversalFetch();
  const accessToken = localStorage.getItem("access_token");
  const showNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const is_edit = id !== "add";

  // Fetch trips for select
  const {
    data: tripsData,
    isPending: isTripsLoading,
  } = useFetchQuery({
    queryKey: ["trips-select"],
    url: `trips/list/`,
    params: { page: 1, page_size: 1000 },
    token: accessToken,
  });

  // Fetch employees for select
  const {
    data: employeesData,
    isPending: isEmployeesLoading,
  } = useFetchQuery({
    queryKey: ["employees-select"],
    url: `auth/employee/list/`,
    params: { page: 1, page_size: 1000 },
    token: accessToken,
  });

  const trips = useMemo(
    () => tripsData?.data || (Array.isArray(tripsData) ? tripsData : []),
    [tripsData]
  );
  const employees = useMemo(
    () =>
      employeesData?.data || (Array.isArray(employeesData) ? employeesData : []),
    [employeesData]
  );

  // Fetch detail for edit
  const {
    data: assignmentDetail,
  } = useFetchQuery({
    queryKey: ["assignment-detail", id],
    url: `assignments/detail/${id}/`,
    token: accessToken,
    config: {
      queryOptions: {
        enabled: is_edit,
      },
    },
  });

  const {
    mutate: saveAssignment,
    isPending: isSaveLoading,
    isSuccess: isSaveSuccess,
    isError: isSaveError,
    error: saveError,
    data: saveData,
  } = useFetchMutation({
    url: is_edit ? `assignments/update/${id}/` : `assignments/create/`,
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
    invalidateKey: ["assignments"],
  });

  const onFinish = (values) => {
    setLoading(true);
    const body = {
      trip: values.trip ? parseInt(values.trip) : null,
      employee: values.employee ? parseInt(values.employee) : null,
      role: values.role,
      wagon_number: values.wagon_number
        ? parseInt(values.wagon_number)
        : null,
      status: values.status || "assigned",
      notes: values.notes || "",
      special_instructions: values.special_instructions || "",
    };
    saveAssignment(body);
  };

  useEffect(() => {
    if (isSaveSuccess) {
      showNotification(
        "success",
        is_edit
          ? t("messages")?.save_success || "Muvaffaqiyatli saqlandi"
          : t("messages")?.create_success || "Muvaffaqiyatli yaratildi",
        saveData?.message || (is_edit ? "Topshiriq saqlandi" : "Topshiriq yaratildi")
      );
      navigate("/assignments");
    } else if (isSaveError) {
      showNotification(
        "error",
        t("messages")?.error_2 || "Xatolik",
        saveError?.message || t("messages")?.error || "Xatolik yuz berdi"
      );
    }
    if (!isSaveLoading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSuccess, isSaveError, isSaveLoading]);

  const roleOptions = [
    { label: "Driver", value: "driver" },
    { label: "Assistant Driver", value: "assistant_driver" },
    { label: "Conductor", value: "conductor" },
    { label: "Senior Conductor", value: "senior_conductor" },
    { label: "Engineer", value: "engineer" },
    { label: "Attendant", value: "attendant" },
    { label: "Security", value: "security" },
  ];

  const statusOptions = [
    { label: "Assigned", value: "assigned" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Declined", value: "declined" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  // Prefill on edit
  useEffect(() => {
    const detail = assignmentDetail?.data || assignmentDetail;
    if (is_edit && detail && Object.keys(detail || {}).length > 0) {
      form.setFieldsValue({
        trip: detail.trip?.id || detail.trip,
        employee: detail.employee?.id || detail.employee,
        role: detail.role,
        wagon_number: detail.wagon_number,
        status: detail.status || "assigned",
        notes: detail.notes || "",
        special_instructions: detail.special_instructions || "",
      });
    }
  }, [assignmentDetail, form, is_edit]);

  return (
    <section className="page partners">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>{is_edit ? "Topshiriqni tahrirlash" : "Topshiriq yaratish"}</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Topshiriqlar ro'yxati",
                    href: "/assignments",
                  },
                  {
                    title: is_edit ? `#${id}` : "Yaratish",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
        </div>
      </div>

      <Card style={{ marginTop: 16, borderRadius: 8 }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ status: "assigned" }}
        >
          <div
            className="form_items"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            <div className="input_item">
              <CustomSelect
                label="Reys"
                name="trip"
                form={form}
                rules={[
                  {
                    required: true,
                    message: "Reys tanlanishi shart",
                  },
                ]}
                options={
                  Array.isArray(trips)
                    ? trips.map((trip) => ({
                        label: trip.trip_number || `Reys #${trip.id}`,
                        value: trip.id,
                      }))
                    : []
                }
                loading={isTripsLoading}
              />
            </div>

            <div className="input_item">
              <CustomSelect
                label="Xodim"
                name="employee"
                form={form}
                rules={[
                  {
                    required: true,
                    message: "Xodim tanlanishi shart",
                  },
                ]}
                options={
                  Array.isArray(employees)
                    ? employees.map((emp) => ({
                        label:
                          emp.full_name ||
                          emp.fullname ||
                          `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
                          `Xodim #${emp.id}`,
                        value: emp.id,
                      }))
                    : []
                }
                loading={isEmployeesLoading}
              />
            </div>

            <div className="input_item">
              <CustomSelect
                label="Rol"
                name="role"
                form={form}
                rules={[
                  {
                    required: true,
                    message: "Rol tanlanishi shart",
                  },
                ]}
                options={roleOptions}
              />
            </div>

            <div className="input_item">
              <CustomInput
                label="Vagon raqami"
                name="wagon_number"
                form={form}
                inputType="number"
                placeholder="1"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const num = Number(value);
                      if (!Number.isInteger(num) || num < 1) {
                        return Promise.reject(
                          new Error("Vagon raqami 1 yoki undan katta butun son bo'lishi kerak")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              />
            </div>

            <div className="input_item">
              <CustomSelect
                label="Status"
                name="status"
                form={form}
                options={statusOptions}
              />
            </div>

            <div className="input_item">
              <div className="single_input_item">
                <p className="label label_active">Izoh</p>
                <Form.Item name="notes">
                  <TextArea rows={3} placeholder="Izoh" />
                </Form.Item>
              </div>
            </div>

            <div className="input_item">
              <div className="single_input_item">
                <p className="label label_active">Maxsus ko'rsatmalar</p>
                <Form.Item name="special_instructions">
                  <TextArea rows={3} placeholder="Maxsus ko'rsatmalar" />
                </Form.Item>
              </div>
            </div>
          </div>

          <div
            className="form_actions"
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <Button onClick={() => navigate("/assignments")}>
              Bekor qilish
            </Button>
            <Button
              type="primary"
              loading={isSaveLoading || loading}
              onClick={() => form.submit()}
            >
              Saqlash
            </Button>
          </div>
        </Form>
      </Card>

      {loading && (
        <div className="loader">
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 44 }} spin />}
          />
        </div>
      )}
    </section>
  );
}

export default AddAssignment;

