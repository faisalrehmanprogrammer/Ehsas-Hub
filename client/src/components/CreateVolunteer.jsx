import axios from "axios";
import React, { useState } from "react";

const CreateVolunteer = () => {
  const [value, setValue] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    image: "",
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
      setValue({ ...value, image: reader.result });
    });
  };

  const handleInput = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const CreateVolunteer = async (e) => {
    e.preventDefault();
    const postData = { ...value };
    try {
      const res = await axios.post(
        "http://localhost:8000/create-volunteer",
        postData
      );
      alert(res.data.msg);
      window.location.reload();
      setForm((state) => !state);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8 p-3 mt-4 card">
              <div className="text-center mb-3 mt-3">
                <div className="text-success ">
                  <i class="fa-solid fa-right-to-bracket fa-3x"></i>
                </div>
                <h3 className="text-primary">Become a Volunteer</h3>
                <p className="text-secondary">Join us as a Volunteer</p>
              </div>
              <form onSubmit={CreateVolunteer}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="name"
                    onChange={handleInput}
                  />
                </div>
                <div className="row ">
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      required
                      name="email"
                      onChange={handleInput}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      required
                      name="password"
                      onChange={handleInput}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="phone"
                    onChange={handleInput}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="address"
                    onChange={handleInput}
                  />
                </div>
                <div className="form-group mb-3">
                  <div className="text-center mt-3">
                    {value.image ? (
                      <img
                        src={value.image}
                        alt=""
                        width="150"
                        height="80 "
                        className="mt-2"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <label htmlFor="bookImage" className="text-dark">
                    CNIC Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="bookImage"
                    accept=".jpg, .jpeg, .png"
                    placeholder="Upload book image"
                    required
                    name="profile"
                    onChange={handleImage}
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
            <div className="col-sm-2"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateVolunteer;