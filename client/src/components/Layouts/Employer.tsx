import "./css/employer.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

interface CompanyData {
  companyid: number;
  logo: string;
  company_name: string;
  compa_city: string;
  company_description: string;
  compa_salary: string;
  industry: string;
}

const Employer: React.FC = () => {
  const [dataCompany, setDataCompany] = useState<CompanyData[]>([]);
  const { id } = useParams<{ id: string }>(); // Lấy ID từ URL

  const loadDataCompany = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5500/api/v1/companies`
      );

      // Đảm bảo lấy ít nhất 4 phần tử
      const startIndex = Math.floor(Math.random() * (response.data.length - 3));

      // Lấy 4 phần tử bất kỳ từ mảng response.data
      const fourRandomItems = response.data.slice(startIndex, startIndex + 3);
      setDataCompany(fourRandomItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDataCompany();
  }, []);

  const handleNavLinkClick = (companyid: number) => {
    // Xử lý khi click vào div NavLink
    // console.log("Clicked on NavLink with ID:", companyid);
    // Thực hiện các thao tác hoặc chuyển hướng đến trang chi tiết công ty dựa trên companyId
  };

  return (
    <div className="container-employer">
      <h2 className="title-employer">Nhà Tuyển Dụng Hàng Đầu</h2>
      <div className="grip-employer">
        {dataCompany.map((companys) => (
          <NavLink
            key={companys.companyid}
            to={`/company-detail/${companys.companyid}`} // Thêm ID vào đường dẫn
            className="employer-item"
            onClick={() => handleNavLinkClick(companys.companyid)}
          >
            <div className="hiden-img">
              <img
                className="img-employer"
                src={companys.logo}
                alt="loading..."
              />
            </div>
            <div>
              <div className="text-body-employer">
                <h6>{companys.company_name}</h6>
                <h6 className="opacity-body-employer">{companys.compa_city}</h6>
              </div>
              <div className="flex-list-couser">
                {companys.industry.split(",").map((industry, index) => (
                  <h6 className="item-couser" key={index}>
                    {industry}
                  </h6>
                ))}
              </div>

              <h6 className="job-foo">1 Việc làm 🔔 </h6>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Employer;
