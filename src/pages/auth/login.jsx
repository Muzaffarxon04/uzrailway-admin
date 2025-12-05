import { Form, Button, message } from "antd";
import { useState, useEffect } from "react";
import PasswordInput from "../../components/inputs/passwordInput";
import Logo from "../../assets/img/logo.png";
// import { BASE_URL } from "../../consts/variables";
import { useNavigate } from "react-router";
import useUniversalFetch from "../../Hooks/useApi";
import CustomInput from "../../components/inputs/customInput";
import { useLocalization } from "../../LocalizationContext";

function Login() {
  const [messageApi, contextHolder] = message.useMessage();

  const { t } = useLocalization();
  const [status, setStatus] = useState("");
  //
  const { useFetchMutation } = useUniversalFetch();

  const navigate = useNavigate();

  const {
    data: handleSignInConfirmData,
    isSuccess: isSuccessSigninConfirm,
    mutate: handleSignInConfirm,
    isPending: isHandleSignInConfirmLoading,
    error: handleSignInConfirmError,
    isError: isHandleSignInConfirmError,
  } = useFetchMutation({
    url: `https://dev.api.c5.uz/api/showroom/login`,
    method: "POST",
  });


  useEffect(() => {
    if (isSuccessSigninConfirm) {

      messageApi.success(
        handleSignInConfirmData?.message || "Sign-in successful!"
      );

      // Store access token & refresh token in localStorage
      localStorage.setItem(
        "access_token",
        handleSignInConfirmData?.data?.token
      );
      localStorage.setItem(
        "userData",
        JSON.stringify(handleSignInConfirmData?.data)
      );

    
      navigate("/employees");
        
      

    } else if (isHandleSignInConfirmError) {
      messageApi.error(handleSignInConfirmError?.message);
      setStatus("error");
    }
  }, [
    isHandleSignInConfirmError,
    handleSignInConfirmData,
    handleSignInConfirmError,
    isSuccessSigninConfirm,
    messageApi,
    navigate,
  ]);

  const onFinish = async (values) => {
    try {
      handleSignInConfirm({
        username: values?.login,
        password: values?.password,
      });
    } catch (error) {}
  };

  return (
    <section className="login">
      {contextHolder}
      <div className="login_wrapper">
        <div className="login_form">
          <div className="logo">
            <div className="logo_wrapper">
              <img src={Logo} alt="logo" />
            </div>
          </div>
          <div className="otp_login_wrapper">
            <div className={`login_form_wrapper`}>
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                <div className="inputs_wrapper">
                  <CustomInput
                    status={status}
                    label={t("Common").login}
                    name="login"
                    rules={[
                      {
                        required: true,
                        message: `${t("Common").login_re}`,
                      },
                    ]}
                  />
                  <PasswordInput
                    label={t("Common").password}
                    name="password"
                    type="password"
                    status={status}
                    rules={[
                      {
                        required: true,
                        message: `${t("Common").password_re}`,
                      },
                    ]}
                  />
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login_form_button"
                    loading={isHandleSignInConfirmLoading}
                  >
                    {t("Common").continue}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Login;
