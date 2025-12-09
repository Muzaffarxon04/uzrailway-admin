import React, { useEffect, useState } from "react";
import { Form, DatePicker } from "antd";
import { useWatch } from "antd/es/form/Form";
import dayjs from "dayjs";

const CustomDatePicker = ({
  label,
  name,
  rules = [],
  value,
  defaultValue,
  form,
  isEdit,
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
  }, [fieldValue, form, name, defaultValue, value, isEdit]);

  const handleChange = (date) => {
    setIsFilled(!!date);
  };

  return (
    <div className="single_input_item">
      <p className={`label input_datepicker_label ${isFilled ? "label_active" : ""}`}>{label}</p>
      <Form.Item name={name} rules={rules}>
        <DatePicker
          onChange={handleChange}
          style={{ width: "100%" }}
          format="YYYY-MM-DD"
          value={value}
          defaultValue={defaultValue ? dayjs(defaultValue) : undefined}
          {...props}
        />
      </Form.Item>
    </div>
  );
};

export default CustomDatePicker;
