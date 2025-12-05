import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";

const { Option } = Select;

const CustomSelect = ({
  label,
  isEdit,
  name,
  rules = [],
  value,
  form,
  defaultValue,
  options = [],
  ...props
}) => {
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    // Check value after form is initialized
    const checkValue = () => {
      const currentValue = form?.getFieldValue(name);
      const hasValue = currentValue !== undefined && currentValue !== null && currentValue !== "";
      if (hasValue || defaultValue) {
        setIsFilled(true);
      } else {
        setIsFilled(false);
      }
    };
    
    checkValue();
    
    // Also check when form values change
    const timer = setTimeout(() => {
      checkValue();
    }, 100);
    
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, name, defaultValue, isEdit, value]);

  const handleChange = (val) => {
    setIsFilled(!!val || val === 0);
    if (props.onChange) props.onChange(val);
  };

  return (
    <div className="single_input_item">
      <p className={`label ${isFilled ? "label_active" : ""}`}>
        {label}
      </p>
      <Form.Item name={name} rules={rules} initialValue={defaultValue}>
        <Select
        className="single_select"
          onFocus={() => setIsFilled(true)}
          onChange={handleChange}
          value={value}
          {...props}
        >
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default CustomSelect;
