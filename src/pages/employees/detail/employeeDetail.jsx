import { Card, Descriptions, Breadcrumb, Button, Spin, Tag } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import useUniversalFetch from "../../../Hooks/useApi";
import Icon from "../../../components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { useFetchQuery } = useUniversalFetch();

  const {
    data: employeeData,
    isPending: isEmployeeLoading,
  } = useFetchQuery({
    queryKey: [`employee-detail`, id],
    url: `auth/employee/detail/${id}/`,
    token: accessToken,
  });

  
  const employee = employeeData?.data || employeeData || {};
  // const positions = positionsData?.data || (Array.isArray(positionsData) ? positionsData : []);
  // const departments = departmentsData?.data || (Array.isArray(departmentsData) ? departmentsData : []);

  // const positionMap = new Map(positions.map(pos => [pos.id, pos.name || pos.position_name]));
  // const departmentMap = new Map(departments.map(dept => [dept.id, dept.name || dept.department_name]));

  if (isEmployeeLoading) {
    return (
      <section className="page partners">
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "400px" 
        }}>
          <Spin 
            indicator={
              <LoadingOutlined 
                style={{ fontSize: 44 }} 
                spin 
              />
            } 
          />
        </div>
      </section>
    );
  }

  const getRoleLabel = (role) => {
    const roleLabels = {
      superadmin: "Superadmin",
      inspector: "Inspector",
      technician: "Technician",
    };
    return roleLabels[role] || role;
  };

  return (
    <section className="page partners">
      <div className="header">
        <div className="header_wrapper">
          <div className="page_info">
            <h2>Xodim ma'lumotlari</h2>
            <span className="breadcrumb">
              <Breadcrumb
                separator={<Icon icon="chevron" />}
                items={[
                  {
                    title: "Xodimlar ro'yxati",
                    href: "/employees",
                  },
                  {
                    title: `${employee?.firstName || employee?.first_name || ""} ${employee?.lastName || employee?.last_name || ""}`.trim() || "Xodim ma'lumotlari",
                    href: "",
                  },
                ]}
              />
            </span>
          </div>
          <div className="filter">
            <Button 
              type="primary" 
              onClick={() => navigate(`/employees/${id}`)}
            >
              Tahrirlash
            </Button>
          </div>
        </div>
      </div>

      <div className="main">
        <Card className="flights-detail">
          <Descriptions
            title="Asosiy ma'lumotlar"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="ID">
              #{employee?.id || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Xodim ID">
              {employee?.employee_id || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {employee?.username || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Ism">
              {employee?.firstName || employee?.first_name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Familiya">
              {employee?.lastName || employee?.last_name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {employee?.email || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Telefon raqami">
              {employee?.phone || employee?.phone_number || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Jins">
              {employee?.gender === 1 ? "Erkak" : employee?.gender === 2 ? "Ayol" : employee?.gender || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tug'ilgan sana">
              {employee?.date_of_birth ? dayjs(employee.date_of_birth).format("DD.MM.YYYY") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Boshlanish sanasi">
              {employee?.startDate ? dayjs(employee.startDate).format("DD.MM.YYYY") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tugash sanasi">
              {employee?.endDate ? dayjs(employee.endDate).format("DD.MM.YYYY") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Rol">
              <Tag color="blue">{getRoleLabel(employee?.role)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Lavozim">
              {employee?.position?.name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Bo'lim">
              {employee?.department?.name ||  "-"}
            </Descriptions.Item>
           
          </Descriptions>
        </Card>
      </div>
    </section>
  );
}

export default EmployeeDetail;












