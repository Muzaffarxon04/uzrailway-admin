import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";

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

  useEffect(() => {
    if (form?.getFieldValue(name) && isEdit) {
      setIsFilled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.getFieldValue(name), isEdit]);

  const handleBlur = (e) => {
    const inputValue = e.target.value;
    // console.log("Blur value:", inputValue);
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
