import React, { useState, useEffect } from "react";
import { Form } from "antd";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const PhoneNumberInput = ({
  label,
  name,
  rules = [],
  isEdit,
  form,
  ...props
}) => {
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    if (form?.getFieldValue(name) && isEdit) {
      setIsFilled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.getFieldValue(name), isEdit]);
  return (
    <div className="single_input_item">
      <p className={`label ${isFilled ? "label_active" : ""}`}>{label}</p>
      <Form.Item
        name={name}
        rules={rules}
        validateTrigger={["onBlur", "onChange"]}
      >
        <PhoneInput
          autoComplete="off"
          onFocus={() => setIsFilled(true)}
          onBlur={(e) => setIsFilled(!!e.target.value)}
          {...props} // Spread other props
        />
      </Form.Item>
    </div>
  );
};

export default PhoneNumberInput;
