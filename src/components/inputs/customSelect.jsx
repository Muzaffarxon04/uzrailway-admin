import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { useWatch } from "antd/es/form/Form";

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

  const handleChange = (val) => {
    setIsFilled(!!val || val === 0);
    if (props.onChange) props.onChange(val);
  };

  const handleBlur = () => {
    // Check if field has value after blur
    const currentValue = form?.getFieldValue(name);
    const hasValue = currentValue !== undefined && currentValue !== null && currentValue !== "";
    setIsFilled(hasValue || !!value || !!defaultValue);
    if (props.onBlur) props.onBlur();
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
          onBlur={handleBlur}
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
