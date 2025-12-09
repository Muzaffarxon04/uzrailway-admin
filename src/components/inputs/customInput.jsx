import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { useWatch } from "antd/es/form/Form";

const CustomInput = ({
  label,
  isEdit,
  name,
  rules = [],
  value,
  form,
  defaultValue,
  ...props
}) => {
  const [isFilled, setIsFilled] = useState(false);
  
  // Watch the field value to detect changes
  const fieldValue = useWatch(name, form);

  useEffect(() => {
    // Check if field has value
    const currentValue = fieldValue !== undefined ? fieldValue : (form?.getFieldValue(name));
    const hasValue = currentValue !== undefined && currentValue !== null && currentValue !== "";
    
    // Also check defaultValue and value props
    if (hasValue || defaultValue || value) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [fieldValue, form, name, defaultValue, value]);

  const handleBlur = (e) => {
    const inputValue = e.target.value;
    setIsFilled(!!inputValue);
  };

  return (
    <div className="single_input_item">
      <p
        id={props?.prefix ? "prefix_true" : ""}
        className={`label ${isFilled ? "label_active" : ""}`}
      >
        {label}
      </p>
      <Form.Item name={name} rules={rules}>
        <Input
          onFocus={() => setIsFilled(true)}
          autoComplete="off"
          onBlur={handleBlur}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />
      </Form.Item>
    </div>
  );
};

export default CustomInput;
