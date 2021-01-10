import React, { useState, useEffect, useCallback } from "react";

import "./CallHistoryOrderForm.css";

const OrderDetails = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [nameColor, setNameColor] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  // local order details store

  const [orderObj, setOrderObj] = useState({
    modality: "",
    bodypart: "",
    schedule_datetime: "",
    first_name: "",
    last_name: "",
    DOB: "",
    comment: "",
    callStatus: "",
    contact: "",
    time: "",
    CallStatusCode: "",
    Operator_Feedback: "",
    status_updated_by_AI: "",
    startDate: "",
    Order_Id: "",
    ToOperator: "No",
    time: "",
    SaveClicked: false,
    SelectStatus: false,
    PostError: false,
  });

  // console.log("Local State", orderObj);
  // using useEffect to reset useState
  const testCallback = useCallback(() => {
    setDisabled(false);
    setNameColor(false);
    setOrderSaved(false);
    setError(false);
    setUploading(false);
  }, [props.convid]);
  useEffect(() => {
    testCallback();
  }, [props.convid]);

  //************************************************ */
  // this useEffect run when page render and get data from API for unique conversation ID

  useEffect(async () => {
    try {
      console.log("conversationid", props.convid);
      const token = await props.getTokenFunc();
      let orderData = null;
      if (props.recordsLoading) {
        setOrderObj({
          ...orderObj,
          modality: "",
          bodypart: "",
          schedule_datetime: "",
          first_name: "",
          last_name: "",
          DOB: "",
          feedback: "",
          callstatus: "",
          comment: "",
          contact: "",
          time: "",
          CallStatusCode: "",
          Operator_Feedback: "",
          status_updated_by_AI: "",
          startDate: "",
          Order_Id: "",
          ToOperator: "No",
        });
      } else {
        if (props.convid) {
          orderData = await fetch(
            process.env.REACT_APP_API_URL + "/oi/api/v1/cart/" + props.convid,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              displayOrderData(data, props.convid);
            });
        }
      }
    } catch (err) {
      console.log("Error", err);
    }
  }, [props.convid]);

  //********************************************************/
  // this useEffect run  display live order

  useEffect(() => {
    displayLiveOrderData(props.convid, props.fetchedLiveOrder);
  }, [props.fetchedLiveOrder, props.convid]);

  const displayLiveOrderData = (conversationID, LiveOrderData) => {
    if (conversationID === LiveOrderData.conversation_id) {
      displayOrderData(LiveOrderData, conversationID);
    }
  };

  //*************************************************** */

  // this function set data from database to local state (orderObj)
  const displayOrderData = (data, convid) => {
    console.log("My order data", data);
    // converting null to ""
    Object.keys(data).forEach(function (key) {
      if (
        data[key] === null ||
        data[key] === "None" ||
        typeof data[key] === "undefined"
      ) {
        data[key] = "";
      }
    });

    let appntDate = data.schedule_datetime;
    var options = {
      hour: "numeric",
      minute: "numeric",
      day: "short",
      month: "short",
      year: "numeric",
    };
    if (appntDate !== "") {
      appntDate = appntDate.toLocaleString("en-US", options);
    }

    let AppointMentDate = data.appointment_datetime.split(" ");
    const Time = (t) => {
      var [h, m] = t.split(":");
      let time =
        ((h % 12) + 12 * (h % 12 == 0) + ":" + m, h >= 12 ? "PM" : "AM");

      return `${h}:${m} ${time}`;
    };
    let Appoint_time = data.schedule_datetime ? Time(AppointMentDate[1]) : " ";

    setOrderObj({
      ...orderObj,
      modality: data.modality,
      bodypart: data.bodypart,
      schedule_datetime: AppointMentDate[0],
      first_name: data.first_name,
      last_name: data.last_name,
      DOB: data.date_of_birth,
      callStatus: data["call_status"],
      Operator_Feedback: data["operator_feedback"],
      contact: data["mobile_number"],
      status_updated_by_AI: data.status_updated_by_AI,
      comment: data.feedback,
      CallStatusCode: data["operator_feedback"]["operator_feedback"],
      time: Appoint_time,
    });
  };

  let CallCode = "";

  if (orderObj.callStatus.length) {
    CallCode = orderObj.callStatus[0].operator_feedback;
  }

  // updating order Data

  const orderHandler = (event) => {
    event.preventDefault();

    let conversation_id = props.convid;

    let AppntDate = orderObj.schedule_datetime;
    let DateAppoint = AppntDate.split("-");
    let timeCheck = orderObj.time.split(" ");
    let Appointmentdate = null;
    if (timeCheck.length < 3) {
      Appointmentdate =
        DateAppoint[2] +
        "-" +
        DateAppoint[0] +
        "-" +
        DateAppoint[1] +
        " " +
        timeCheck[0] +
        ":" +
        "00";
    } else {
      Appointmentdate =
        DateAppoint[2] +
        "-" +
        DateAppoint[0] +
        "-" +
        DateAppoint[1] +
        " " +
        AppntDate[1];
    }

    const orderData = {
      conversation_id: conversation_id,
      modality: orderObj.modality,
      bodypart: orderObj.bodypart,

      schedule_datetime:
        orderObj.schedule_datetime != "" ? Appointmentdate : "",
      last_name: orderObj.last_name,
      first_name: orderObj.first_name,
      DOB: orderObj.DOB,
      feedback: orderObj.comment,
      callstatus:
        orderObj.CallStatusCode == "--Select--" ? "" : orderObj.CallStatusCode,
      mobile_number: orderObj.contact,
      ris_code: orderObj.Order_Id,
    };

    console.log("SENTDATA", orderData);
    UpdateOrderdata(orderData);
  };

  //************************************************** */
  const UpdateOrderdata = async (orderData) => {
    setUploading(true);
    const token = await props.getTokenFunc();
    if (props.convid != "") {
      fetch(process.env.REACT_APP_API_URL + "/oi/api/v1/updateorderdetails", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })
        .then((response) => response.text())
        .then((data) => {
          setUploading(false);
          console.log("RESPONSE DATA", data);
          if (data == 200) {
            setOrderSaved(true);
            props.OngoingCallPass(true); // for color change
          }

          ActionMsg(data);
        })
        .catch((err) => {
          FailureMsg();
          setError(true);
          setOrderObj({ ...orderObj, PostError: true });
          setOrderObj({ ...orderObj, SaveClicked: false });
        });
    } else {
      console.log("Empty");
    }
  };
  const ActionMsg = (orderupdatedatastatus) => {
    setDisabled(true);
  };

  const FailureMsg = () => {
    alert("Data Updation Failed");
  };
  const EditForm = () => {
    setDisabled(false);
  };
  const inputChangedHandler = (event, inputIdentifier) => {
    setOrderObj({
      ...orderObj,
      [inputIdentifier]: event.target.value,
    });
  };

  console.log("Order object ", orderObj);

  // for name confirmation
  if (orderObj.CallStatusCode == "1004") {
    const NameConfirmationHandler = async () => {
      const token = await props.getTokenFunc();
      if (props.convid !== "") {
        fetch(`${process.env.REACT_APP_API_URL}/oi/api/v1/name-confirmation`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversation_id: props.convid,
            status_code: 1004,
          }),
          redirect: "follow",
        })
          .then((response) => {
            setNameColor(true);
          })
          .catch((err) => alert("ERROR OCCURED IN SENDING MESSAGE!", err));
      }
    };

    NameConfirmationHandler();
  }

  let DataStatus = () => {
    if (!error) {
      if (!uploading && !orderSaved) {
        return <p style={{ textAlign: "center" }}>Please Submit your Order</p>;
      } else if (uploading && !orderSaved) {
        return <p style={{ textAlign: "center" }}>Saving Order...</p>;
      } else if (!uploading && orderSaved) {
        return <p style={{ textAlign: "center" }}> Order Saved ...</p>;
      } else {
        return <p style={{ textAlign: "center" }}> Order Saved Again ...</p>;
      }
    } else {
      return (
        <p style={{ textAlign: "center" }}> Failed to Save Order Details</p>
      );
    }
  };

  console.log("status Code ", orderObj.CallStatusCode);

  return (
    <>
      <form
        className="orderdetails"
        onSubmit={orderHandler}
        style={{
          width: "23vw",
          // flexGrow: 1,
          padding: "5px",
          border: "1px solid black",
          boxSizing: "border-box",
          backgroundColor: "#F1F1F1",
          height: "90vh",
          // display: "flex",
          // flexDirection: "column",
        }}
      >
        <h4 style={{ display: "flex", justifyContent: "center" }}>
          <u style={{ fontSize: "20px" }}>Order Details </u>
        </h4>

        <div
          style={{
            display: "flex",
            // justifyContent: "center",
          }}
        >
          <div style={{ marginRight: "10px" }}>
            <p>Modality</p>
            <input
              style={{ textTransform: "uppercase", width: "100px" }}
              key="modality"
              label="Modality"
              elementType="input"
              type="text"
              value={orderObj.modality}
              name="modality"
              onChange={(event) => inputChangedHandler(event, "modality")}
              placeholder="Ex.MRI"
              onkeypress="this.style.width = ((this.value.length + 1) * 8) + 'px';"
            />
          </div>
          <div>
            <p>Body Part</p>
            <input
              style={{ textTransform: "capitalize" }}
              key="bodypart"
              label="Body Part"
              elementType="input"
              type="text"
              name="bodypart"
              value={orderObj.bodypart}
              onChange={(event) => inputChangedHandler(event, "bodypart")}
              placeholder="chest"
            />
          </div>
        </div>
        <hr style={{ marginBottom: "5px" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <p>Appointment Date</p>
          {/* <DatePicker
            selected={schedule_dateti
            onChange={(date) => setSchedule_datetime(date)}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
          /> */}

          {/* <input
            type="datetime-local"
            value={orderObj.schedule_datetime}
            onChange={(event) => {
              inputChangedHandler(event, "schedule_datetime");
            }}
          /> */}
          <div style={{ display: "flex" }}>
            <input
              id="appointment"
              type="text"
              id="meeting-time"
              name="meeting-time"
              value={orderObj.schedule_datetime}
              onChange={(event) => {
                inputChangedHandler(event, "schedule_datetime");
              }}
              placeholder="mm-dd-yyyy"
              style={{ fontSize: "16px", marginRight: "10px", width: "110px" }}
            />
            <input
              id="time"
              type="text"
              value={orderObj.time}
              style={{ width: "90px", paddingLeft: "5px" }}
              onChange={(event) => {
                inputChangedHandler(event, "time");
              }}
            />
          </div>
        </div>

        <hr style={{ marginBottom: "5px" }} />

        <div className="user_details">
          <div
            style={{
              display: "flex",
              marginBottom: "10px",
              // justifyContent: "center",
            }}
          >
            <div>
              <p style={{ width: "100px" }}>FirstName</p>

              <input
                key="givenname"
                label="Given name"
                elementType="input"
                name="first_name"
                type="text"
                value={orderObj.first_name}
                onChange={(event) => {
                  inputChangedHandler(event, "first_name");
                }}
                placeholder="Ex. Clinton"
                style={{ width: "90%", fontSize: "16px", marginRight: "0px" }}
              />
            </div>
            <div>
              <p>LastName</p>
              <input
                key="surname"
                label="Surname"
                elementType="input"
                name="last_name"
                type="text"
                value={orderObj.last_name}
                onChange={(event) => {
                  inputChangedHandler(event, "last_name");
                }}
                placeholder="Ex. Marx"
                style={{ width: "90%", fontSize: "16px" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              // justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div style={{ marginRight: "10px" }}>
              <p>DOB</p>
              <input
                key="dob"
                label="DOB"
                elementType="input"
                name="DOB"
                type="date"
                value={orderObj.DOB}
                onChange={(event) => {
                  inputChangedHandler(event, "DOB");
                }}
                placeholder="Jan-4-1997"
                style={{ width: "130px" }}
              />
            </div>
            <div>
              <p>Contact</p>
              <input
                key="contact_details"
                label="Contact"
                elementType="input"
                name="contact"
                type="text"
                value={orderObj.contact}
                onChange={(event) => {
                  inputChangedHandler(event, "contact");
                }}
                placeholder="Contact"
                style={{ width: "111px", fontSize: "15px" }}
              />
            </div>
          </div>
        </div>
        <hr style={{ marginBottom: "5px" }} />
        {orderObj.status_updated_by_AI == "IN_PROGRESS" ? (
          <p></p>
        ) : (
          <>
            <p>Callstatus</p>

            <select
              required
              key="CallStatusCode"
              value={orderObj.CallStatusCode}
              name="CallStatusCode"
              onChange={(event) => {
                inputChangedHandler(event, "CallStatusCode");
              }}
              style={{
                padding: "10px",
                outline: "none",
                width: "100%",
                fontSize: "16px",
              }}
            >
              <option> --Select--</option>
              {orderObj.callStatus.length != 0 &&
                orderObj.callStatus.map((feedbackOption) => (
                  <option
                    key={feedbackOption.operator_feedback}
                    value={feedbackOption.operator_feedback}
                  >
                    {feedbackOption.operator_feedback_english}
                  </option>
                ))}
            </select>
            <hr style={{ marginBottom: "5px" }} />
          </>
        )}

        <div style={{ display: "", marginBottom: "3px" }}>
          {CallCode == "3001" ||
            (CallCode == "2001" && (
              <>
                <span>Appointment Booked </span>
                <div
                  style={{
                    float: "right",
                    marginRight: "50px",
                  }}
                >
                  <input
                    type="radio"
                    id="yes"
                    name="Yes"
                    value="Yes"
                    onChange={(event) => {
                      inputChangedHandler(event, "ToOperator");
                    }}
                    style={{ width: "20px", padding: "20px" }}
                  />
                  <label
                    for="Yes"
                    style={{ fontSize: "16px" }}
                    style={{ marginRight: "10px", fontSize: "16px" }}
                  >
                    Y
                  </label>
                  <input
                    type="radio"
                    id="No"
                    name="Yes"
                    value="No"
                    onChange={(event) => {
                      inputChangedHandler(event, "ToOperator");
                    }}
                  />
                  <label for="No" style={{ fontSize: "16px" }}>
                    N
                  </label>
                </div>
              </>
            ))}
        </div>

        <div style={{ display: "" }}>
          {orderObj.ToOperator == "Yes" &&
            (CallCode == "3001" || CallCode == "2001") && (
              <>
                <span style={{ marginRight: "5px" }}>RIS Order ID</span>
                <input
                  required
                  type="text"
                  value={orderObj.Order_Id}
                  onChange={(event) => {
                    inputChangedHandler(event, "Order_Id");
                  }}
                />
              </>
            )}
        </div>
        <div style={{ display: "" }}>
          {CallCode == "1001" && (
            <>
              {" "}
              <span style={{ marginRight: "5px" }}>RIS Order ID</span>
              <input
                required
                type="text"
                value={orderObj.Order_Id}
                onChange={(event) => {
                  inputChangedHandler(event, "Order_Id");
                }}
              />{" "}
            </>
          )}
        </div>

        <div>
          <p style={{ marginRight: "10px" }}>Comments</p>

          <textarea
            key="comment"
            label="Comment"
            elementType="comment"
            name="comment"
            value={orderObj.comment}
            onChange={(event) => {
              inputChangedHandler(event, "comment");
            }}
            placeholder="My Comments... "
            style={{
              width: "100%",
              height: "80px",
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="submit"
            // disabled={orderSaved}
            style={{
              padding: "10px",
              paddingLeft: "20px",
              paddingRight: "20px",
              outline: "none !important",
              borderRadius: "10px",
              backgroundColor: "#FF4D4D",
              outline: "none",
              margin: "10px",
              color: "white",
            }}
            // onClick={orderHandler}
          >
            Save
          </button>
          {/* <button
            disabled={!disabled}
            onClick={EditForm}
            style={{
              padding: "10px",
              paddingLeft: "20px",
              paddingRight: "20px",
              outline: "none !important",
              backgroundColor: "#4472C4",
              borderRadius: "10px",
              outline: "none",
              margin: "10px",
              color: "white",
            }}
          >
            Edit
          </button> */}
        </div>
        <DataStatus />
        <p style={{ textAlign: "center", color: "grey" }}>
          Note:- CallStatus is always{" "}
          <span style={{ color: "red" }}>Required!</span>
        </p>
      </form>

      {/* {!nameColor ? (
        <button
          onClick={NameConfirmationHandler}
          style={
            {
              // padding: "10px",
              // paddingLeft: "20px",
              // paddingRight: "20px",
              // outline: "none !important",
              // backgroundColor: "#FF4D4D",
              // borderRadius: "10px",
              // outline: "none",
              // margin: "10px",
            }
          }
        >
          Name Confirmation
        </button>
      ) : (
        <button
          style={
            {
              // padding: "10px",
              // paddingLeft: "20px",
              // paddingRight: "20px",
              // outline: "none !important",
              // backgroundColor: "#FF4D4D",
              // borderRadius: "10px",
              // outline: "none",
              // margin: "10px",
            }
          }
        >
          Request Sent!
        </button>
      )} */}
    </>
  );
};

export default OrderDetails;
