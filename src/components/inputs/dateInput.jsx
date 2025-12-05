import React, { useEffect, useState } from "react";
import { Form, DatePicker } from "antd";
import { useWatch } from "antd/es/form/Form";
import Icon from "../Icon";

const CustomInput = ({ label, isEdit, name, rules = [], form, ...props }) => {
  const [isFilled, setIsFilled] = useState(false);

  // Watch the field value
  const fieldValue = useWatch(name, form);

  useEffect(() => {
    setIsFilled(!!fieldValue || isEdit);
  }, [fieldValue, isEdit]);

  const onChange = (date) => {
    form.setFieldsValue({ [name]: date });
  };

  const onBlur = () => {
    if (!form.getFieldValue(name)) {
      setIsFilled(false);
    }
  };

  return (
    <div className="single_input_item">
      <p className={`label ${isFilled ? "label_active" : ""}`}>{label}</p>
      <Form.Item name={name} rules={rules}>
        <DatePicker
          onFocus={() => setIsFilled(true)}
          onBlur={onBlur}
          autoComplete="off"
          showTime
          suffixIcon={<Icon icon="ic_calendar" />}
          locale={false}
          placeholder={false}
          onChange={onChange}
          {...props}
        />
      </Form.Item>
    </div>
  );
};

export default CustomInput;
