import React, { useState, useEffect } from "react";
import Sider_bar from "../common/admin/Sider_bar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import axios from "axios";
import "./css/admin_jobs.css";
import { ToastContainer, toast } from "react-toastify";

interface JobData {
  job_id: number;
  descriptions: string;
  location: string;
  required_skills: string;
  experience_level: string;
  salary: string;
}

interface compa {
  companyid: number;
}

const Admin_jobs: React.FC = () => {
  const [allDataJobs, setAllDataJobs] = useState<JobData[]>([]);
  const [dataCompaById, setDataCompaById] = useState<compa | null>(null);
  const [validated, setValidated] = useState(false);

  const dataUser = localStorage.getItem("flagUser");
  const userLocal = dataUser ? JSON.parse(dataUser) : null;

  const [formValues, setFormValues] = useState({
    descriptions: "",
    location: "",
    salary: "",
    required_skills: "",
    experience_level: "",
  });

  // get data company theo userId để lấy companyId
  const loaDataCompanyByUserId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5500/api/v1/companies/user/${userLocal.user_id}`
      );
      setDataCompaById(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loaDataCompanyByUserId();
  }, [userLocal.user_id]);

  // all data jobs
  const loaDataAllJobs = async () => {
    try {
      const companyId = dataCompaById?.companyid;
      const response = await axios.get(
        `http://localhost:5500/api/v1/jobs/${companyId}`
      );

      setAllDataJobs(response.data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loaDataAllJobs();
  }, [dataCompaById]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    addJob();
  };

  const addJob = async () => {
    try {
      if (dataCompaById) {
        const companyId = dataCompaById.companyid;
        console.log("companyId", companyId);

        await axios.post(
          `http://localhost:5500/api/v1/jobs/${companyId}`,
          formValues
        );
        setFormValues({
          descriptions: "",
          location: "",
          salary: "",
          required_skills: "",
          experience_level: "",
        });
        toast.success("Thêm công việc thành công :)) ", {
          autoClose: 1000,
        });
        setValidated(false);
        loaDataAllJobs();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // xóa job theo id
  const handleDeleteJob = async (job_id: number) => {
    try {
      await axios.delete(`http://localhost:5500/api/v1/jobs/${job_id}`);

      loaDataAllJobs();
      toast.success("Xóa công việc thành công :)) ", {
        autoClose: 1000,
      });
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi xóa công ty :))", {
        autoClose: 1000,
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // hàm format tiền
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div style={{ width: "100%", display: "flex", flex: 1 }}>
      <Sider_bar />
      <div className="container-admin-companys">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustomUsername">
              <Form.Label className="white-label">Mô tả công việc</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend"></InputGroup.Text>
                <Form.Control
                  type="text"
                  name="descriptions"
                  value={formValues.descriptions}
                  placeholder="Mô tả..."
                  aria-describedby="inputGroupPrepend"
                  required
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                  Không bỏ trống mô tả...
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="validationCustomUsername">
              <Form.Label className="white-label">Địa chỉ chi tiết</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend"></InputGroup.Text>
                <Form.Control
                  type="text"
                  name="location"
                  value={formValues.location}
                  placeholder="Địa chỉ..."
                  aria-describedby="inputGroupPrepend"
                  required
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                  Không bỏ trống địa chỉ...
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="validationCustomUsername">
              <Form.Label className="white-label">Kỹ năng</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend"></InputGroup.Text>
                <Form.Control
                  type="text"
                  name="required_skills"
                  value={formValues.required_skills}
                  placeholder="Kỹ năng..."
                  aria-describedby="inputGroupPrepend"
                  required
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                  Không bỏ trống kỹ năng...
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="validationCustomUsername">
              <Form.Label className="white-label">Tiền lương</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend"></InputGroup.Text>
                <Form.Control
                  type="text"
                  name="salary"
                  value={formValues.salary}
                  placeholder="Lương..."
                  aria-describedby="inputGroupPrepend"
                  required
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                  Tiền lương không được bỏ trống...
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} md="3" controlId="validationCustom04">
              <Form.Label className="white-label">
                Yêu cầu và kinh nghiệm
              </Form.Label>
              <Form.Control
                type="text"
                name="experience_level"
                value={formValues.experience_level}
                placeholder="Yêu cầu..."
                required
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Không bỏ trống yêu cầu...
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-6">
            <Form.Check
              required
              label="Bạn có đồng ý thêm công việc này không?"
              feedback="Bạn phải đồng ý trước khi gửi."
              feedbackType="invalid"
            />
          </Form.Group>
          <div className="col-12">
            <Button type="submit" variant="success">
              Thêm công việc
            </Button>
          </div>
        </Form>
        <div>
          <h2 className="title-company-admin">
            Tất cả các jobs của công ty 📂📂📂.
          </h2>
          <Table
            striped
            bordered
            hover
            style={{ backgroundColor: "transparent" }}
          >
            <thead style={{ opacity: 1 }}>
              <tr>
                <th>STT</th>
                <th>Descriptions</th>
                <th>Location</th>
                <th>Experience_level</th>
                <th>Required_skills</th>
                <th>Salary</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody style={{ opacity: 1 }}>
              {allDataJobs.map((jobs, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{`${jobs.descriptions.slice(0, 60)}...`}</td>
                  <td>{jobs.location}</td>
                  <td>{`${jobs.experience_level.slice(0, 60)}...`}</td>
                  <td>{jobs.required_skills}</td>
                  <td>{formatCurrency(Number(jobs.salary))}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteJob(jobs.job_id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <ToastContainer className="toast-container-custom" />
    </div>
  );
};
export default Admin_jobs;
