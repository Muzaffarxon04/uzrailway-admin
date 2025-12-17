import { Form, Button, Spin, Breadcrumb } from "antd";
import CustomInput from "../../../components/inputs/customInput";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import useUniversalFetch from "../../../Hooks/useApi";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../components/notification";
import { useLocalization } from "../../../LocalizationContext";

function AddDepartment() {
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
    data: departmentData,
    isPending: isDepartmentLoading,
    isSuccess: isSuccessDepartmentData,
    refetch: refetchData,
  } = useFetchQuery({
    url: `settings/department/detail/${id}/`,
    queryKey: [`department-detail`, id],
    config: {
      queryOptions: {
        enabled: is_edit,
        queryKey: [`department-detail`, id],
      },
    },
    token: accessToken,
  });

  const department = useMemo(() => departmentData?.data || departmentData || {}, [departmentData]);

  const {
    mutate: handleDepartmentMutation,
    isPending: isDepartmentMutationLoading,
    isSuccess: isSuccessDepartmentMutation,
    data: departmentMutationData,
    isError: isDepartmentMutationError,
    error: departmentMutationError,
  } = useFetchMutation({
    url: is_edit ? `settings/department/update/${id}/` : `settings/department/create/`,
    invalidateKey: ["departments"],
    method: is_edit ? "PATCH" : "POST",
    token: accessToken,
  });

  useEffect(() => {
    if (is_edit && department && Object.keys(department).length > 0) {
      form.setFieldsValue({
        name: department.name || department.department_name,
      });
    }
  }, [department, is_edit, form]);

  const onFinish = (values) => {
    const body = {
      name: values.name,
    };
    handleDepartmentMutation(body);
  };

  useEffect(() => {
    if (isSuccessDepartmentMutation) {
      refetchData();
      showNotification(
        "success",
        is_edit ? t("messages").partner_updated : t("messages").partner_created,
        departmentMutationData?.message || t("messages").create_success
      );
      navigate("/departments");
    } else if (isDepartmentMutationError) {
      showNotification(
        "error",
        t("messages").error_2,
        departmentMutationError?.message || t("messages").error
      );
    }
  }, [isSuccessDepartmentMutation, isDepartmentMutationError, is_edit, navigate, refetchData, showNotification, t, departmentMutationData?.message, departmentMutationError?.message]);

  useEffect(() => {
    if (is_edit) {
      if (!isDepartmentLoading && department && isSuccessDepartmentData && is_edit) {
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
  }, [isDepartmentLoading, department, is_edit, isSuccessDepartmentData]);

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
                {is_edit ? "Bo'limni tahrirlash" : "Yangi bo'lim qo'shish"}
              </h2>

              <span className="breadcrumb">
                <Breadcrumb
                  separator={<Icon icon="chevron" />}
                  items={[
                    {
                      title: "Bo'limlar ro'yxati",
                      href: "/departments",
                    },
                    {
                      title: is_edit
                        ? department?.name || department?.department_name || "Tahrirlash"
                        : "Yangi bo'lim",
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
            name="department_form"
            className="action_form"
            form={form}
            onFinish={onFinish}
            initialValues={{}}
          >
            <div className="action_wrapper">
              <div className="action_item company_info">
                <div className="item_wrapper">
                  <div className="item_title">
                    <h3>Bo'lim ma'lumotlari</h3>
                  </div>

                  <div className="drap_area_wrapper">
                    <div className="form_items">
                      <div className="input_item">
                        <CustomInput
                          isEdit={is_edit}
                          form={form}
                          label="Bo'lim nomi"
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Bo'lim nomi kiritilishi shart",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form_actions">
                    <div className="footer_buttons">
                      <Button
                        loading={isDepartmentMutationLoading}
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

export default AddDepartment;














