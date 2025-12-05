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
    const currentValue = form?.getFieldValue(name);
    // eslint-disable-next-line no-mixed-operators
    if ((defaultValue || (currentValue || currentValue === 0) && isEdit)) {
      setIsFilled(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, name, isEdit]);

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
