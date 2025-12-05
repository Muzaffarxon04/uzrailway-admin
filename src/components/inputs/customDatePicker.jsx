import React, { useEffect, useState } from "react";
import { Form, DatePicker } from "antd";
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

  useEffect(() => {
    const fieldValue = form?.getFieldValue(name);
    if ((fieldValue || defaultValue) && isEdit) {
      setIsFilled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.getFieldValue(name), isEdit]);

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
