import React, { 
  // useEffect,
   useState,
  //  useEffect
   } from "react";
import { Button, Layout, Menu, Modal, Select,
  //  Switch
   } from "antd";
import { LaptopOutlined, BankOutlined } from "@ant-design/icons";
import { useNavigate, Outlet, useLocation,
  //  useSearchParams 

} from "react-router-dom"; // Import routing utilities
// import LogoMin from "../../assets/img/logo_part.svg";
import Logo from "../../assets/img/favicon.svg";
import Icon from "../Icon";
import DeleteConfirmModal from "../modals/deleteConfirm";
import { useLocalization } from "../../LocalizationContext";
// import { MoonOutlined, SunOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const LayoutComponent = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userData") || []);
  // const [searchParams, setSearchParams] = useSearchParams(); // ✅ Hook to manage URL parameters

  const [collapsed, setCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, setLanguage, language } = useLocalization();
  const location = useLocation();
  // const { theme, setTheme } = useLocalization();
  const { Option } = Select;
  // const [checked, setChecked] = useState(theme === "dark");


    // const currentPage = parseInt(searchParams.get("page"));
  // const pageSize = parseInt(searchParams.get("pageSize"));

  const navigate = useNavigate();
  const handleChange = (value) => {
    setLanguage(value);
  };

  // const toggleTheme = (checked) => {
  //   setTheme(checked ? "dark" : "light");
  // };
  // useEffect(() => {
  //   setChecked(theme === "dark");
  // }, [theme]);

  const menuItems = [
    // {
    //   key: "/",
    //   icon: <Icon icon="ic_square" />,
    //   label: `${t("Pages").dashboard}`,
    // },
    // {
    //   key: "/admins",
    //   icon: <Icon icon="ic_users" />,
    //   label: `${t("Pages").admins}`,
    //   accessRoles:["showroom_admin"]
    // },
    {
      key: "/employees",
      icon: <Icon icon="ic_users" />,
      label: `${t("Pages").employees}`,
      accessRoles:["showroom_admin", "dispatcher"]
    },
    {
      key: "/flights",
      icon: <Icon icon="ic_order_list" />,
      label: `${t("Pages").flights}`,
      accessRoles:["showroom_admin", "dispatcher"]
    },
    {
      key: "/stations",
      icon: <BankOutlined />,
      label: `${t("Pages").stations}`,
      accessRoles:["showroom_admin", "dispatcher"]
    },
    {
      key: "/devices",
      icon: <LaptopOutlined />,
      label: "Qurilmalar",
      accessRoles:["showroom_admin", "dispatcher"]
    },
    // {
    //   key: "/fueltransaction",
    //   icon: <Icon icon="fuel_transaction" />,
    //   label: `${t("Pages").fueltransaction}`,
    //   accessRoles:["showroom_admin", "fueler"]

    // },
    // {
    //   key: "/tolltransaction",
    //   icon: <Icon icon="toll_transaction" />,
    //   label: `${t("Pages").tolltransaction}`,
    //   accessRoles:["showroom_admin", "dispatcher"]

    // },
    // {
    //   key: "/totalgrosses",
    //   icon: <Icon icon="total_grosses" />,
    //   label: `${t("Pages").totalgrosses}`,
    //   accessRoles:["showroom_admin", "dispatcher"]

    // },
    //     {
    //   key: "/reports",
    //   icon: <Icon icon="ic_reports" />,
    //   label: `${t("Pages").reports}`,
    //   accessRoles:["showroom_admin", "dispatcher"]

    // },
  ];

  const handleDelete = () => {
    localStorage.clear();
    navigate("/login");
  };

  const closeModal = () => setIsModalOpen(false);


//   useEffect(() => {
// if(!pageSize && !currentPage){ 
//   setSearchParams({
//       page:1,
//       pageSize: 100,
//     });
  
//   }else{
//      setSearchParams({
//       page:currentPage,
//       pageSize: pageSize,
//     });
//   }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   },[currentPage, pageSize, location])

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          <div className="logo_wrapper">
            <div className="demo_logo">
              <img
                src={Logo}
                alt="Logo"
                className={collapsed ? "nav_logo_min" : "nav_logo"}
              />
            </div>
          </div>
          <Button
            type="text"
            className="slider_open"
            icon={
              collapsed ? (
                <Icon icon="duble_chevron_right" />
              ) : (
                <Icon icon="duble_chevron" />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["/"+location.pathname?.split("/")[1]]}
          items={menuItems.filter((el)=> el.accessRoles.includes(userData?.role))}
          onClick={({ key }) => navigate(key)} // Navigate to the route on item click
        />
        <div className="bottom_menu">
          <Menu
            mode="inline"
            items={[
              // {
              //   key: "/settings",
              //   icon: <Icon icon="ic_settings" />,
              //   label: `${t("Pages").settings}`,
              //   onClick: () => setIsModalOpen(true),
              // },
              {
                key: "logout",
                icon: <Icon icon="ic_logout" className="icon ic_logout" />,
                label: <span className="ic_logout">{t("Pages").log_out}</span>,
                onClick: () => setModalVisible(true),
              },
            ]}
          />
        </div>
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "8px",
            padding: 0,
            minHeight: 280,
          }}
        >
          <div className="page">{children}</div>
          <Outlet />
        </Content>
      </Layout>
      <DeleteConfirmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDelete}
        title={t("Pages").log_out}
        message={t("messages").log_out}
        dangerMessage={t("messages").log_out_2}
        isLogout="true"
      />
      <Modal
        title={<h2 className="settings_title">{t("Pages").settings}</h2>}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        width={340}
      >
        <div className="settings_modal">
          <div className="setting_item">
            <span className="label">{t("messages").system_language}</span>
            <Select
              value={language}
              onChange={handleChange}
              style={{ width: 120 }}
            >
              <Option value="en">🇬🇧 {t("lang").en}</Option>
              <Option value="uz">🇺🇿 {t("lang").uz}</Option>
              <Option value="ru">🇷🇺 {t("lang").ru}</Option>
            </Select>
          </div>
          {/* <div className="setting_item">
            <span className="label">{t("messages").system_theme}</span>
            <Switch
              checked={checked}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined color="#edba00" />}
            />
          </div> */}
        </div>

        {/* <div style={{ marginTop: 16, textAlign: "right" }}>
          <Button onClick={closeModal} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleEnter}>
            Enter
          </Button>
        </div> */}
      </Modal>
    </Layout>
  );
};

export default LayoutComponent;
