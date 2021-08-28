import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const Secure = require("bcryptjs");
const Validator = require("validator");
let Register = () => {
  const dispatch = useDispatch();
  // Triggers For Validation
  let [Email, EmailIsValid] = useState(false);
  let [User, UserIsValid] = useState(false);

  const ImgSrc = "https://www.pexels.com/photo/3345882/download/";
  const router = useRouter();
  useEffect(async () => {
    // For Checking User Alreddy Login Or Not
    const Request = await fetch("/api/Token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Request: "Token" }),
    });
    const Response = await Request.json();
    if (Response.Email != undefined && Response.Password != undefined) {
      router.push("/Home");
    }
  }, []);
  // This Function Is For Showing Password
  let ShowPassword = (event) => {
    var Checked = event.target.checked;
    if (Checked == true) {
      document.querySelector("#Password").type = "text";
      document.querySelector("#Password2").type = "text";
    }
    if (Checked == false) {
      document.querySelector("#Password").type = "password";
      document.querySelector("#Password2").type = "password";
    }
  };
  // Strong Password Feature
  let StrongPass = async () => {
    if (Validator.isStrongPassword(document.querySelector("#Password").value)) {
      document.querySelector("#password").innerHTML = "Strong";
      document.querySelector("#password").style.color = "green";
    } else {
      document.querySelector("#password").innerHTML = "Weak";
      document.querySelector("#password").style.color = "red";
    }
  };
  //Function For Checking Password Matched or Not
  // Matching Password
  let Match = () => {
    var Pass1 = document.querySelector("#Password").value;
    var Pass2 = document.querySelector("#Password2").value;
    if (Pass1 == Pass2) {
      document.querySelector("#Confirm").innerHTML = "Matched";
      document.querySelector("#Confirm").style.color = "green";
    }
    if (Pass1 != Pass2) {
      document.querySelector("#Confirm").innerHTML = " Not Matched";
      document.querySelector("#Confirm").style.color = "red";
    }
  };
  // Function for Registering Data
  let RegisterData = async () => {
    if (Email == true && User == true) {
      const DefaultPhoto =
        "https://images.pexels.com/photos/7367082/pexels-photo-7367082.jpeg?cs=srgb&dl=pexels-kelian-pfleger-7367082.jpg&fm=jpg";
      const Request = await fetch("/api/Otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: document.querySelector("#Email").value }),
      });
      const Response = await Request.json();
      const EncrptOtp = Response.Otp;
      console.log(EncrptOtp);
      // Data For input
      let Details = {
        ProfilePhoto: DefaultPhoto,
        FullName: document.querySelector("#FullName").value,
        UserName: document.querySelector("#UserName").value,
        Password: document.querySelector("#Password").value,
        Email: document.querySelector("#Email").value,
      };
      let DataToSent = {
        type: "Otp",
        Page: "/Register",
        Otp: EncrptOtp,
        Data: Details,
      };
      dispatch(DataToSent);
      router.push("/Otp");
    } else {
      alert("Invalid Details");
    }
  };
  // Function For Email Validation
  let EmailValid = async () => {
    if (Validator.isEmail(document.getElementById("Email").value)) {
      const Resp = await fetch("/api/SearchEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: document.getElementById("Email").value }),
      });
      const Result = await Resp.json();
      if (Result.status == false) {
        EmailIsValid(false);
        var Em = document.querySelector("#EmailText");
        if (Em != null) {
          document.querySelector("#EmailText").innerHTML = "Not Available";
          document.querySelector("#EmailText").style.color = "red";
        }
      }
      if (Result.status == true) {
        EmailIsValid(true);
        var Em = document.querySelector("#EmailText");
        if (Em != null) {
          document.querySelector("#EmailText").innerHTML = "Available";
          document.querySelector("#EmailText").style.color = "green";
        }
      }
    }
  };
  // UserName Validation
  let UserValid = async () => {
    const Resp = await fetch("/api/SearchUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserName: document.getElementById("UserName").value,
      }),
    });
    const Result = await Resp.json();
    if (Result.status == false) {
      UserIsValid(false);
      var Us = document.querySelector("#UserNameText");
      if (Us != null) {
        document.querySelector("#UserNameText").innerHTML = "Not Available";
        document.querySelector("#UserNameText").style.color = "red";
      }
    }
    if (Result.status == true) {
      UserIsValid(true);
      var Us = document.querySelector("#UserName");
      if (Us != null) {
        document.querySelector("#UserNameText").innerHTML = "Available";
        document.querySelector("#UserNameText").style.color = "green";
      }
    }
  };
  return (
    <div className="flex flex-row ">
      <img
        src={ImgSrc}
        className=" object-fill lg:block w-2/5 h-screen   md:hidden sm:hidden"
      />
      <button className="fixed top-5 right-5 text-2xl hover:text-primary">
        <Link href="/">Login</Link>
      </button>
      <div className="flex flex-col pl-11 h-screen pt-9 lg:w-1/2 md:w-screen  md:pl-24 sm:pl-24">
        <h1 className="text-4xl font-Main mb-5">Register</h1>
        <div className="flex flex-row">
          <input
            className="border-b border-black w-80 h-11 mb-5 "
            type="text"
            id="FullName"
            placeholder="Enter The FullName"
          />{" "}
        </div>
        <div className="flex flex-row">
          <input
            className="border-b border-black w-80 h-11 mb-5  "
            type="text"
            id="UserName"
            placeholder="Enter The UserName"
            onChange={UserValid}
          />
          <h3
            className="text-xl mt-2 ml-2 font-Secondary text-green-600"
            id="UserNameText"
          ></h3>{" "}
        </div>
        <div className="flex flex-row">
          <input
            className="border-b border-black w-80 h-11 mb-5 "
            type="email"
            id="Email"
            placeholder="Enter The Email"
            onChange={EmailValid}
          />
          <h3
            className="text-xl font-Secondary ml-2 mt-2 text-green-600"
            id="EmailText"
          ></h3>{" "}
        </div>
        <div className="flex flex-row">
          <input
            className="border-b border-black w-80 h-11 mb-5 "
            type="password"
            id="Password"
            placeholder="Enter The Password"
            onChange={StrongPass}
          />
          <h3
            className="text-xl font-Secondary mt-2 ml-2 text-red-600"
            id="password"
          ></h3>{" "}
        </div>
        <div className="flex flex-row">
          <input
            className="border-b border-black w-80 h-11 mb-5 "
            type="password"
            id="Password2"
            placeholder="Confirm The Password"
            onChange={Match}
          />
          <h3
            className="text-xl font-Secondary mt-2 ml-2 text-green-600"
            id="Confirm"
          ></h3>{" "}
        </div>
        <div className="flex flex-row mt-5 h-11 mb-5">
          <input type="checkbox" className=" w-9 h-9" onChange={ShowPassword} />
          <h3 className="text-lg mt-1 ml-2">Show Password</h3>
        </div>
        <button
          className="bg-Insta hover:border-black w-24  border rounded-lg text-lg text-white h-11 hover:bg-white hover:text-black "
          onClick={RegisterData}
        >
          Register
        </button>
      </div>
    </div>
  );
};
export default Register;
