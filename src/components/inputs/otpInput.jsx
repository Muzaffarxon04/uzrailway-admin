import { Form, Input } from "antd";
// import "./CustomInput.css"; // Import styles

const OtpInput = ({ label, name, rules = [], ...props }) => {
  return (
    <div className="otp_input">
      <Form.Item name={name} rules={rules}>
        <Input.OTP
          autoComplete="off"
          {...props} // Spread other props
        />
      </Form.Item>
    </div>
  );
};

export default OtpInput;
