import { Input } from "antd";

const formatNumber = (value) => {
  const digits = value.replace(/\s/g, "").replace(/[^\d]/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const unformatNumber = (value) => {
  return value.replace(/\s/g, "");
};

/**
 * Reusable formatted number input
 *
 * Props:
 * - value: formatted string (e.g. "10 000")
 * - onChange: (rawValue, formattedValue) => void
 * - prefix: e.g. "$", "%"
 * - ...rest: any other Input props
 */
const FormattedNumberInput = ({ value, onChange, prefix, ...rest }) => {
  const handleChange = (e) => {
    const formatted = formatNumber(e.target.value);
    const raw = unformatNumber(formatted);
    if (onChange) {
      onChange(raw, formatted);
    }
  };

  return (
    <Input value={value} onChange={handleChange} prefix={prefix} {...rest} />
  );
};

export default FormattedNumberInput;
