import IcoMoon from "react-icomoon";
const iconSet = require("./selection.json");

const Icon = ({ ...props }) => {
  return (
    <IcoMoon
      iconSet={iconSet}
      style={{ height: "20px", width: "20px", color: "inherit" }}
      className="icon"
      {...props}
    />
  );
};

export default Icon;
