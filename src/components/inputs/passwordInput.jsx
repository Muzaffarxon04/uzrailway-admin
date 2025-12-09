import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";
import { useWatch } from "antd/es/form/Form";

const PasswordInput = ({ label, name, isEdit, rules = [], form, ...props }) => {
  const [isFilled, setIsFilled] = useState(false);
  
  // Watch the field value to detect changes
  const fieldValue = useWatch(name, form);

  useEffect(() => {
    // Check if field has value
    const currentValue = fieldValue !== undefined ? fieldValue : (form?.getFieldValue(name));
    const hasValue = currentValue !== undefined && currentValue !== null && currentValue !== "";
    
    if (hasValue) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [fieldValue, form, name, isEdit]);
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
