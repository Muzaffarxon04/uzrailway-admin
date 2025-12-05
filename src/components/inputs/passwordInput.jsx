import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";

const PasswordInput = ({ label, name, isEdit, rules = [], form, ...props }) => {
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    if (form?.getFieldValue(name) && isEdit) {
      setIsFilled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.getFieldValue(name), isEdit]);
  return (
    <div className="single_input_item password_input">
      <p className={`label ${isFilled ? "label_active" : ""}`}>{label}</p>
      <Form.Item name={name} rules={rules}>
        <Input.Password
          autoComplete="off"
          onFocus={() => setIsFilled(true)}
          onBlur={(e) => setIsFilled(!!e.target.value)}
          {...props} // Spread other props
        />
      </Form.Item>
    </div>
  );
};

export default PasswordInput;
