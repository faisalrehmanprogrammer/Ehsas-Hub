const { con } = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const {
  SendMailApproveUser,
  SendMailRequest,
  SendMailRejectUser,
  SendMailFreeze,
} = require("../mail/app-mailer");

const CreateUser = async (req, res) => {
  console.log("Route hit");
  const { name, email, phone, password, address, gender, image } = req.body;

  if (!name || !email || !phone || !password || !address || !gender || !image) {
    return res.status(500).json({ msg: "Fields are required" });
  }
  const qry = "SELECT * FROM users WHERE email=?";

  con.query(qry, [email], async (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data.length > 0) {
      return res.status(500).json({ msg: "user already exist", data });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = [name, email, phone, hashPassword, address, gender, image];

    const sql =
      "INSERT INTO users(name, email, phone, password, address, gender,image) VALUES (?)";

    con.query(sql, [user], (err, data) => {
      if (err) throw err;
      SendMailRequest(name, email);
      return res.json({ msg: "User Created successfully" });
    });
  });
};

const LoginUser = async (req, res) => {
  console.log("Rout hit");
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND status=1";

  con.query(sql, [email], async (err, data) => {
    if (err) throw err;
    if (data.length < 1) {
      return res.json({ msg: "user not found!!!", data });
    }
    const user = data[0];
    // console.log(user)

    if (password) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) throw err;
        if (result) {
          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          return res.json({ msg: "user login successfuly", token, user });
        } else {
          return res.json({ msg: "invalid user" });
        }
      });
      // const match = await bcrypt.compare(password, user.password);
      // if (!match) {
      //   res.status(400).json({ msg: "try to login with correct password" });
      // }
    }
  });
};

const UserForgotPassword = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and new password are required" });
  }

  const sql = "SELECT * FROM users WHERE email=?";
  con.query(sql, [email], async (err, data) => {
    if (err) throw err;

    if (data.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updateSql = "UPDATE users SET password=? WHERE email=?";
    con.query(updateSql, [hashedPassword, email], (err, result) => {
      if (err) {
        return res.status(500).json({ msg: "Failed to update password" });
      } else {
        return res.json({ msg: "Password reset successfully" });
      }
    });
  });
};
const FreezeUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "Invalid" });
  }
  //   update query for status
  const sql = "UPDATE `users` SET status=0 WHERE id=?";
  con.query(sql, [id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "error in approving user", err });
    } else {
      SendMailFreeze(name, email);
      return res.json({ msg: "Account Freezed request successfuly" });
    }
  });
};
const ApproveUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!id) {
    return res.status(400).json({ msg: "Invalid" });
  }
  //   update query for status
  const sql = "UPDATE `users` SET status=1 WHERE id=?";
  con.query(sql, [id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "error in approving user", err });
    } else {
      SendMailApproveUser(name, email);
      return res.json({ msg: "Account approved request successfuly" });
    }
  });
};
const RejectUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "user id is required" });
  }
  const qry = "DELETE FROM `users` WHERE id=?";
  con.query(qry, [id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "error in reject user", err });
    } else {
      SendMailRejectUser(name, email);
      return res.json({ msg: " request reject successfuly" });
    }
  });
};

const FetchUser = async (req, res) => {
  const qry = "SELECT * FROM `users`";
  con.query(qry, (error, data) => {
    if (error) {
      console.log("error", error);
      return res.status(404).json({ msg: "error in fetching", error });
    }
    return res.json({ msg: "fetch successfuly", data });
  });
};

const FetchUserById = (req, res) => {
  const userId = req.params.userId;
  const qry = "SELECT * FROM `users` WHERE id = ?";
  con.query(qry, [userId], (error, data) => {
    if (error) {
      return res.status(404).json({ msg: "error in fetching", error });
    }
    if (data.length > 0) {
      return res.json(data[0]);
    } else {
      return res.status(404).json({ msg: "user not found", error });
    }
  });
};

const UpdateInterest = (req, res) => {
  const { id } = req.params;
  const { interest } = req.body;
  console.log("params", req.params);
  if (!id || !interest) {
    return res.status(400).json({ msg: "id and interest required" });
  }

  const sql = "UPDATE users SET interest = ?  WHERE id = ?";
  con.query(sql, [interest, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: "error in updating", err });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ msg: "user not found", err });
    }
    return res.json({ msg: "successfuly update iinterest", result });
  });
};

module.exports = {
  CreateUser,
  LoginUser,
  UserForgotPassword,
  ApproveUser,
  RejectUser,
  FetchUser,
  FetchUserById,
  UpdateInterest,
  FreezeUser,
};
