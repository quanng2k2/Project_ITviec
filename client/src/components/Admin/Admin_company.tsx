import React, { useState, useEffect } from "react";
import Sider_bar from "../common/admin/Sider_bar";
import "./css/admin_company.css";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface CompanyData {
  companyid: number;
  logo: string;
  company_name: string;
  compa_city: string;
  company_description: string;
  industry: string;
}

const Admin_company: React.FC = () => {
  const [dataCompany, setDataCompany] = useState<CompanyData[]>([]);
  const [nameCompa, setNameCompa] = useState("");
  const [locationCompa, setLocationCompa] = useState("");
  const [descriptionCompa, setDescriptionCompa] = useState("");
  const [imageCompa, setImageCompa] = useState<File | null>(null);
  const [industryCompa, setIndustryCompa] = useState("");

  const loadDataCompany = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5500/api/v1/companies`
      );
      setDataCompany(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDataCompany();
  }, []);

  const handlePostCompany = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !nameCompa ||
      !locationCompa ||
      !descriptionCompa ||
      !industryCompa ||
      !imageCompa
    ) {
      toast.error("Vui lòng không để trống thông tin !!!", {
        autoClose: 1000,
      });
      return;
    }

    if (nameCompa.trim() === "") {
      toast.error("Tên công ty không được để trống !!!", {
        autoClose: 1000,
      });
      return;
    }
    if (locationCompa.trim() === "") {
      toast.error("Địa chỉ công ty không được để trống  !!!", {
        autoClose: 1000,
      });
      return;
    }
    if (descriptionCompa.trim() === "") {
      toast.error("Mô tả công ty không được để trống  !!!", {
        autoClose: 1000,
      });
      return;
    }
    if (industryCompa.trim() === "") {
      toast.error("Chuyên nghành công ty không được để trống  !!!", {
        autoClose: 1000,
      });
      return;
    }
    if (!imageCompa) {
      toast.error("Logo công ty không được để trống  !!!", {
        autoClose: 1000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", imageCompa);
      formData.append("upload_preset", "project05");
      formData.append("company_name", nameCompa);
      formData.append("company_description", descriptionCompa);
      formData.append("compa_city", locationCompa);
      formData.append("industry", industryCompa);

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dqx8znzox/image/upload",
        formData
      );

      if (response.status === 200) {
        const imageUrl = response.data.secure_url;
        console.log("imageUrl--------->", imageUrl);

        formData.append("logo", imageUrl);

        const postResponse = await axios.post(
          "http://localhost:5500/api/v1/companies",
          {
            logo: imageUrl,
            company_name: nameCompa,
            company_description: descriptionCompa,
            compa_city: locationCompa,
            industry: industryCompa,
          }
        );

        if (postResponse.status === 201) {
          setNameCompa("");
          setLocationCompa("");
          setDescriptionCompa("");
          setImageCompa(null);
          setIndustryCompa("");
          toast.success("Thêm mới công ty thành công !!!", {
            autoClose: 500,
          });
          loadDataCompany();
        }
      } else {
        toast.error("Upload ảnh thất bại !!!", {
          autoClose: 500,
        });
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi thêm mới công ty  !!!", {
        autoClose: 1000,
      });
      return;
    }
  };

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImageCompa(event.target.files[0]);
    }
  };

  const handleDeleteCompany = async (company_id: number) => {
    try {
      await axios.delete(
        `http://localhost:5500/api/v1/companies/${company_id}`
      );

      toast.success("Xóa công ty thành công :(( ", {
        autoClose: 1000,
      });
      loadDataCompany();
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi xóa công ty :))", {
        autoClose: 1000,
      });
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flex: 1 }}>
      <Sider_bar />
      <div className="container-admin-company">
        <h1 className="title-admin-company">Quản lý tất cả các công ty </h1>
        <form
          id="container-form-admin"
          className="row g-3 needs-validation"
          onSubmit={handlePostCompany}
          encType="multipart/form-data"
        >
          <div className="container-flex-chill">
            <div>
              <label className="form-label">Tên công ty :</label>
              <input
                className="input-form-compa"
                placeholder="Tên công ty ..."
                type="text"
                value={nameCompa}
                onChange={(event) => setNameCompa(event.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Địa chỉ công ty :</label>
              <input
                className="input-form-compa"
                type="text"
                placeholder="Địa chỉ của công ty..."
                value={locationCompa}
                onChange={(event) => setLocationCompa(event.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Mô tả công ty :</label>
              <input
                className="input-form-compa"
                type="text"
                placeholder="Mô tả về công ty..."
                value={descriptionCompa}
                onChange={(event) => setDescriptionCompa(event.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Công nghệ chính :</label>
              <input
                className="input-form-compa"
                type="text"
                placeholder="Java , php , c# ..."
                value={industryCompa}
                onChange={(event) => setIndustryCompa(event.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Logo công ty :</label>
              <input
                className="input-form-compa"
                type="file"
                name="uploadMedia"
                placeholder="Logo công ty..."
                onChange={handleChangeFile}
              />
            </div>

            <div className="col-12">
              <button className="custom-btn btn-12" type="submit">
                <span>Thêm</span>
                <span>Thêm công ty</span>
              </button>
            </div>
          </div>
        </form>
        <table className="table table-striped table-hover table-bordered ">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Logo công ty</th>
              <th scope="col">Tên công ty</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Mô tả </th>
              <th scope="col">Chuyên nghành</th>
              <th scope="col">BTN</th>
            </tr>
          </thead>
          <tbody>
            {dataCompany.map((company, index) => (
              <tr key={company.companyid}>
                <th scope="row">{index + 1}</th>
                <td>
                  <img height={40} src={company.logo} alt="Logo công ty" />
                </td>
                <td>{company.company_name}</td>
                <td>{company.compa_city}</td>
                <td>{`${company.company_description.slice(0, 60)}...`}</td>
                <td>{company.industry.split(",")}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteCompany(company.companyid)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer className="toast-container-custom" />
    </div>
  );
};

export default Admin_company;
