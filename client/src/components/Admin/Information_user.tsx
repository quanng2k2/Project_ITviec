import Sider_bar from "../common/admin/Sider_bar";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import axios from "axios";
import "./css/infor_user.css";
import Button from "react-bootstrap/Button";

interface UserData {
  address: string;
  user_name: string;
  user_email: string;
  roles: number;
  phoneNumber: string;
  user_id: string;
  isLocked: number;
}

const Information_user: React.FC = () => {
  const [dataUser, setDataUser] = useState<UserData[]>([]);

  const loadUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/v1/users");
      setDataUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleLockUser = async (userId: string, isLocked: number) => {
    try {
      const updatedIsLocked = isLocked === 0 ? 1 : 0;
      await axios.patch(
        `http://localhost:5500/api/v1/users/isLocked/${userId}`,
        {
          isLocked: updatedIsLocked,
        }
      );

      // Update the local data after patching
      const updatedDataUser = dataUser.map((user) => {
        if (user.user_id === userId) {
          return {
            ...user,
            isLocked: updatedIsLocked,
          };
        }
        return user;
      });

      setDataUser(updatedDataUser);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flex: 1 }}>
      <Sider_bar />
      <div className="container-infor-user">
        <h3>Thông tin tất cả user</h3>
        <Table striped bordered hover variant="whire">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên </th>
              <th>Địa chỉ email</th>
              <th>Quyền</th>
              <th>Sđt</th>
              <th>Địa chỉ</th>
              <th>Chỉnh sửa</th>
            </tr>
          </thead>
          <tbody>
            {dataUser.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.user_name}</td>
                <td>{user.user_email}</td>
                <td>
                  {" "}
                  {user.roles === 0
                    ? "admin ITviec"
                    : user.roles === 1
                    ? "admin Cty"
                    : user.roles === 2
                    ? "user"
                    : ""}
                </td>
                <td>{user.phoneNumber}</td>
                <td>{user.address}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleLockUser(user.user_id, user.isLocked)}
                  >
                    {user.isLocked === 1 ? "Mở TK" : "Khóa TK"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
export default Information_user;
