import React, { useState, useEffect } from "react";
import "./CallHistoryOrderForm.css";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
const CallHistoryOrderForm = (props) => {
  const { params } = useParams();

  console.log("my id", params);
  const [disabled, setDisabled] = useState(false);
  const [orderObj, setOrderObj] = useState({
    modality: "",
    bodypart: "",
    schedule_datetime: "",
    first_name: "",
    last_name: "",
    DOB: "",
    feedback: "",
    callstatus: "",
    contact: "",
    time: "",
  });

  // if (props.ResetCheck) {
  //   setOrderObj({
  //     ...orderObj,
  //     modality: "",
  //     bodypart: "",
  //     schedule_datetime: "",
  //     first_name: "",
  //     last_name: "",
  //     DOB: "",
  //     feedback: "",
  //     callstatus: "",
  //     contact: "",
  //     time: "",
  //   });
  //  props.setState({...props.state,
  //   props.ResetCheck:"flase"})
  // }

  const Month = (id) => {
    switch (id) {
      case 1:
        return "Jan";

      case 2:
        return "Feb";

      case 3:
        return "Mar";

      case 4:
        return "April";

      case 5:
        return "May";

      case 6:
        return "Jun";

      case 7:
        return "July";

      case 8:
        return "Aug";

      case 9:
        return "Sep";

      case 10:
        return "Oct";

      case 11:
        return "Nov";

      case 12:
        return "Dec";
    }
  };

  useEffect(async () => {
    try {
      console.log("conversationid", props.convid);
      const token = await props.getTokenFunc();
      let orderData = null;
      if (props.convid) {
        //  setInputDisabled(false);
        orderData = await fetch(
          process.env.REACT_APP_API_URL + "/oi/api/v1/cart/" + props.convid,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => displayOrderData(data, props.convid));
      }
    } catch (err) {
      console.log(err);
    }
  }, [props.convid]);

  const displayOrderData = (data, convid) => {
    console.log(data);
    // converting null to ""
    Object.keys(data).forEach(function (key) {
      if (data[key] === null) {
        data[key] = "";
      }
    });

    console.log("tis is >>>>>>orderData", data);
    // console.log("order convid", convid);
    // let appntDate = data.

    let appntDate = data.schedule_datetime;
    var options = {
      hour: "numeric",
      minute: "numeric",
      day: "short",
      month: "short",
      year: "numeric",
    };

    console.log(appntDate);
    if (appntDate !== "") {
      appntDate = appntDate.toLocaleString("en-US", options);
    }

    console.log("AppointmentDate", appntDate);
    if (appntDate === "NONE") {
      appntDate = "";
    } else {
      appntDate = appntDate.replace("T", " ");
    }

    const AppntDate = () => {
      let Date = appntDate.substring(0, 10);
      var month = Date.substring(5, 7);
      //  console.log("this is date of birth", data.date_of_birth);
      console.log("month", month);
      let Appoint = `${Month(Number(month))}-${Number(
        Date.substr(8)
      )}-${Date.substr(0, 4)}`;
      return Appoint;
    };
    // AppntDate();

    const Time = () => {
      // console.log("APPPT", appntDate);
      var [k, t] = appntDate.split(" ");

      console.log("time", t);
      var [h, m, l] = t.split(":");
      let time =
        ((h % 12) + 12 * (h % 12 == 0) + ":" + m, h >= 12 ? "PM" : "AM");

      return `${h}:${m} ${time}`;
    };
    let Appoint_time = Time();

    // Time();
    // Time();

    console.log("my date of birth", data.date_of_birth);

    const DateOfBirth = () => {
      var month = data.date_of_birth.substring(5, 7);
      console.log("this is date of birth", data.date_of_birth);
      console.log("month", month);
      let DOB = `${Month(Number(month))}-${Number(
        data.date_of_birth.substr(8)
      )}-${data.date_of_birth.substr(0, 4)}`;
      return DOB;
    };

    setOrderObj({
      ...orderObj,
      modality: data.modality,
      bodypart: data.bodypart,
      schedule_datetime: AppntDate(),
      first_name: data.first_name,
      last_name: data.last_name,
      DOB: data.date_of_birth != "" ? DateOfBirth() : "",
      feedback: data["feedback"],
      callstatus: data["status_updated_by_operator"],
      contact: data["mobile_number"],
      time: Time(),
    });
  };

  const ActionMsg = (orderupdatedatastatus) => {
    //alert(ordrupdatedatastatus);
    setDisabled(true);
    alert("Data Updation successfully");
    document.getElementById("orderSaved").innerHTML = "Order Saved !!!";
  };

  const FailureMsg = () => {
    alert("Data Updation Failed");
  };
  const EditForm = () => {
    setDisabled(false);
  };
  const inputChangedHandler = (event, inputIdentifier) => {
    // console.log("ORDEROBJBEFORE", orderObj);
    setOrderObj({
      ...orderObj,
      [inputIdentifier]: event.target.value,
    });
  };

  console.log("time", orderObj.time);

  return (
    <>
      <form
        className="orderdetails"
        style={{
          width: "24vw",
          padding: "10px",
          border: "1px solid black",
          backgroundColor: "#F1F1F1",
          height: "80vh",
        }}
      >
        <h3>
          <u>Order Details </u>
        </h3>

        <div className="bodey_part" style={{ display: "flex" }}>
          <div style={{ marginRight: "10px" }}>
            <p>Modality</p>
            <input
              type="text"
              key="modality"
              placeholder="Ex.MRI"
              value={orderObj.modality}
              name="modality"
              changed={(event) => inputChangedHandler(event, "modality")}
              required
              style={{ outline: "none", width: "80px" }}
            />
          </div>
          <div>
            <p>Body Part</p>

            <input
              type="text"
              placeholder="Brain"
              required
              name="bodypart"
              value={orderObj.bodypart}
              changed={(event) => inputChangedHandler(event, "bodypart")}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <hr style={{ marginBottom: "5px" }} />

        <p style={{ marginRight: "10px" }}>Appointment Date</p>
        <div style={{ display: "flex" }}>
          <input
            type="text"
            placeholder=""
            name="schedule_datetime"
            value={orderObj.schedule_datetime}
            changed={(event) => {
              inputChangedHandler(event, "schedule_datetime");
            }}
            style={{ marginRight: "10px", width: "120px" }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              name="time"
              value={orderObj.time}
              // changed={(event) => {
              //   inputChangedHandler(event, "time");
              // }}

              style={{ width: "100px" }}
            />
            {/* <input
                type="text"
                style={{
                  width: "40px",
                  height: "42px",
                  borderLeft: "none",
                }}
              /> */}
          </div>
        </div>

        <hr style={{ marginBottom: "5px" }} />
        <div className="user_details">
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ marginRight: "10px" }}>
              <p>FirstName</p>
              <input
                type="text"
                placeholder=""
                required
                name="first_name"
                value={orderObj.first_name}
                changed={(event) => {
                  inputChangedHandler(event, "first_name");
                }}
                style={{ width: "90%" }}
              />
            </div>
            <div>
              <p>LastName</p>
              <input
                type="text"
                placeholder=""
                name="last_name"
                value={orderObj.last_name}
                changed={(event) => {
                  inputChangedHandler(event, "last_name");
                }}
                required
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ marginRight: "10px" }}>
              <p>DOB</p>
              <input
                type="text"
                placeholder="Dec-23-1976"
                name="DOB"
                type="text"
                value={orderObj.DOB}
                changed={(event) => {
                  inputChangedHandler(event, "DOB");
                }}
                style={{ width: "120px" }}
              />
            </div>
            <div>
              <p> Contact</p>
              <input
                required
                key="contact_details"
                label="Contact"
                elementType="input"
                name="contact"
                type="text"
                value={orderObj.contact}
                changed={(event) => {
                  inputChangedHandler(event, "contact");
                }}
                placeholder="Contact"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
        <hr style={{ marginBottom: "5px" }} />

        <p
          style={{
            marginRight: "10px",
            position: "relative",
            top: "6px",
            fontWeight: "500",
            marginBottom: "5px",
          }}
        >
          Callstatus
        </p>

        <input
          required
          key="callstatus"
          label="CallStatus"
          elementType="select"
          name="callstatus"
          value={orderObj.callstatus}
          changed={(event) => {
            inputChangedHandler(event, "callstatus");
          }}
          style={{ padding: "5px", outline: "none", width: "100%" }}
        />

        <hr />
        <div style={{ float: "right", display: "none" }}>
          <input type="radio" id="yes" value="yes" />
          <label>Y</label>
          <input type="radio" id="No" value="no" /> <label>N</label>
        </div>
        <div style={{ display: "none" }}>
          <span>RIS Order ID</span> <input type="text" />
        </div>

        <div>
          <p style={{ marginRight: "10px" }}>Comments</p>
          <textarea
            value={orderObj.feedback}
            changed={(event) => {
              inputChangedHandler(event, "feedback");
            }}
            placeholder="My Comment..."
            style={{
              width: "100%",
              height: "80px",
              fontSize: "18px",
              outline: "none",
            }}
          />
        </div>
      </form>
    </>
  );
};

export default CallHistoryOrderForm;
