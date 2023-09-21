import { useState, useEffect } from "react";
import Sider_bar from "../common/admin/Sider_bar";
import Table from "react-bootstrap/Table";
import axios from "axios";
import "./css/admin_cv.css";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";

interface cv_User {
  id: number;
  cv_file_path: string;
  user: {
    user_email: string;
    phoneNumber: number;
    address: string;
  };
}

const Admin_cv: React.FC = () => {
  const userLocal = localStorage.getItem("flagUser");
  const dataUser = userLocal ? JSON.parse(userLocal) : null;

  // state get data CVs teo company_id
  const [dataCv, setDataCv] = useState<cv_User[]>([]);

  // get api để lấy company_id
  const loadCompaId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5500/api/v1/companies/user/${dataUser.user_id}`
      );
      const companyID = response?.data?.companyid;

      const responseCVById = await axios.get(
        `http://localhost:5500/api/v1/cv-users/info/company/${companyID}`
      );
      setDataCv(responseCVById.data);
      console.log("responseCVById.data", responseCVById.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCV = async (cvId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:5500/api/v1/companies/user/${dataUser.user_id}`
      );
      const companyID = response?.data?.companyid;

      await axios.delete(
        `http://localhost:5500/api/v1/cv-users/info/company/${companyID}/${cvId}`
      );
      toast.success("Xóa cv thành công :)) ", {
        autoClose: 1000,
      });
      // Refresh the data after successful deletion
      loadCompaId();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCompaId();
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", flex: 1 }}>
      <Sider_bar />
      <div className="container-admin-companys">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Email ứng tuyển</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ </th>
              <th>Link CV</th>
              <th>Duyệt</th>
              <th>Lưu thông tin | Xóa</th>
            </tr>
          </thead>
          <tbody>
            {dataCv.map((cv, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{cv.user.user_email}</td>
                <td>{cv.user.phoneNumber}</td>
                <td>{cv.user.address}</td>
                <td>
                  <a
                    href={cv.cv_file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem CV
                  </a>
                </td>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <Button
                    className="button-delete"
                    variant="outline-danger"
                    onClick={() => handleDeleteCV(cv.id)}
                  >
                    Xóa
                  </Button>
                  {"     "}
                  <button className="custom-btn btn-14">Lưu</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <ToastContainer className="toast-container-custom" />
    </div>
  );
};

export default Admin_cv;
