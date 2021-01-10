import React, { Component } from "react";
import { withAuth0 } from "@auth0/auth0-react";
import Audio from "./Audio/AudioFile/Audio";
import LoaderThreeDot from "./Loader/LoaderThreeDot";
import CallHistoryOrderForm from "./OrderDetails/Forms/CallHistoryOrderForm";

class Callhistory extends Component {
  constructor() {
    super();
    this.state = {
      All_calls: [],
      new_calls: [],
      Loading: true,
      endpoint: process.env.REACT_APP_WS_URL,
      message: [],
      convmsg: [],
      conversationID: "",
      fetchedOrder: {},
      showAudio: false,
      fromDate: "",
      toDate: "",
      Contact: "",
      callStatus: "",
      FilterCallRecord: "",
      Search: false,
      ResetCheck: "false",
    };
  }

  GetAuthToken = async () => {
    const { getAccessTokenSilently } = this.props.auth0;
    const token = await getAccessTokenSilently();
    return token;
  };

  getConvdata = async (convid, centernm, callerid) => {
    const token = await this.GetAuthToken();

    console.log("this is my passed convid data", convid);
    console.log("this is my passed centerm data", centernm);

    console.log("this is my passed callerid data", callerid);

    document.getElementById("convdiv").innerHTML =
      "<img  id='convloader' width='550px' height='420px' src='/assets/images/messenger-icon.gif' />";
    // do stuff

    fetch(process.env.REACT_APP_API_URL + "/oi/api/v1/conversation/" + convid, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return this.DisplayConvData(data, centernm, callerid, convid);
      })
      .catch((err) => {
        console.log(err);
        this.noConvData();
      });
  };

  DisplayOrderData(orderdata, convid) {
    var orderObj = JSON.parse(orderdata);

    var procedetail_data = JSON.stringify(
      orderObj[0]["order_details"]["procedure"]
    );
    //alert(orderdetail_data);
    var i_proc = "";
    var proce_div = '<div class="row mt-2">';

    var procedetail_jsonObj = JSON.parse(procedetail_data);
    for (i_proc in procedetail_jsonObj) {
      proce_div +=
        '<div class="col-4"><label  class="form-control" style="font-size: 11px; height:auto;">' +
        procedetail_jsonObj[i_proc]["modality"] +
        '</label></div><div class="col-6"><label  class="form-control" style="font-size: 11px; height:auto">' +
        procedetail_jsonObj[i_proc]["bodypart"] +
        '</label></div><div class="col-2"><a href="#" data-toggle="modal" data-target="#mribrain"><i aria-hidden="true" class="fa fa-calendar fa-2x"></i></a></div>';
    }
    proce_div += "</div>";
    document.getElementById("procedure_div").innerHTML = proce_div;

    if (appointemnt_dtm != null) {
      var appointemnt_dtm =
        orderObj[0]["order_details"]["appointment"][0]["schedule_datetime"];
      var appntdtm = new Date(appointemnt_dtm);
      var options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      var appointemnt_str = appntdtm.toLocaleString("en-US", options);
    } else {
      appointemnt_str = "No Data Found";
    }

    document.getElementById("appointdiv_dtm").innerHTML = appointemnt_str;

    var last_name = orderObj[0]["order_details"]["patient"][0]["last_name"];
    var first_name = orderObj[0]["order_details"]["patient"][0]["first_name"];
    var dob = orderObj[0]["order_details"]["patient"][0]["DOB"];
    var medicareno = orderObj[0]["order_details"]["patient"][0]["medicare_no"];
    var callstatus = orderObj[0]["order_details"]["patient"][0][
      "status_updated_by_operator"
    ].replace("_", " ");
    var feedback = orderObj[0]["order_details"]["patient"][0]["feedback"];

    var order_dtl_div =
      '<div class="card"><div class="card-body"><div class="card-title">Patient Details</div><div class="row"><form class="wd-full" style="width:100%"><div class="form-group row"><label class="col-md-5 col-form-label">Last Name</label><div class="col-md-7"><label  class="form-control" style="width: 100%; font-size: 11px;height:auto;" >' +
      last_name +
      '</label></div></div><div class="form-group row"><label class="col-md-5 col-form-label">First Name</label><div class="col-md-7"><label  class="form-control" style="width: 100%; font-size: 11px;height:auto;" >' +
      first_name +
      '</label></div></div><div class="form-group row"><label class="col-md-5 col-form-label">DOB</label><div class="col-md-7"><label  class="form-control" style="width: 100%; font-size: 11px;height:auto;" >' +
      dob +
      '</label></div></div><div class="form-group row"><label class="col-md-5 col-form-label">Medicare No</label><div class="col-md-7"><label  class="form-control" style="width: 100%; font-size: 11px;height:auto;" >' +
      medicareno +
      '</label></div</div></div></div><div class="form-group row"><label class="col-md-5 col-form-label">Call Status</label><div class="col-md-7"><label  class="form-control" style="width: 100%; font-size: 11px;height:auto;" >' +
      callstatus +
      '</label></div</div></div></div><div class="form-group row"><label class="col-md-5 col-form-label">Feedback</label><div class="col-md-7"><label  class="form-control" style="width: 100%; font-size: 11px;height:auto;" >' +
      feedback +
      "</label></div</div></div></div></form></div>";

    document.getElementById("patientdetail_div").innerHTML = order_dtl_div;
  }

  noOrderData() {
    var proce_div = '<div class="row mt-2">';
    proce_div += '<div class="col-4"><p>No Data Found</p></div>';

    proce_div += "</div>";
    document.getElementById("procedure_div").innerHTML = "No Data Found";
    document.getElementById("appointdiv_dtm").innerHTML = "No Data Found";

    var order_dtl_div =
      '<div class="card"><div class="card-body"><div class="card-title">Patient Details</div><p>No Data Found</p></div></div>';

    document.getElementById("patientdetail_div").innerHTML = order_dtl_div;
  }

  DisplayConvData(chatdetail_data, centernm, callerid, convid) {
    console.log(chatdetail_data);
    var x = "<ul class='chat' style='width:100%'>";

    for (let i in chatdetail_data) {
      var utterance = JSON.stringify(chatdetail_data[i].utterance)
        .replace('"', "")
        .replace('"', "");
      var message_from = JSON.stringify(chatdetail_data[i].utterance_from);
      var receiptdate = JSON.stringify(chatdetail_data[i].creation_date)
        .replace('"', "")
        .replace('"', "");
      var msgdtm = new Date(receiptdate);
      var options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      var twelevehour_msgdtm = msgdtm.toLocaleString("en-US", options);
      var asr_corrected_text = JSON.stringify(
        chatdetail_data[i].asr_corrected_text
      )
        .replace('"', "")
        .replace('"', "");
      // Get the size of an object
      Object.size = function (obj) {
        var size = 0,
          key;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
        }
        return size;
      };

      let nlu_intent = JSON.parse(chatdetail_data[i].nlu_data);
      nlu_intent =
        Object.size(nlu_intent) !== 0 ? Object.keys(nlu_intent)[0] : "";
      console.log(nlu_intent);

      if (message_from == '"BOT"') {
        if (asr_corrected_text != "null") {
          x +=
            '<li style="margin-bottom:0px;padding-left:15px;width:80%" class="agent clearfix" ><span class="chat-img left clearfix "><img src="http://placehold.it/50/55C1E7/fff&text=A I" alt="AI" class="img-circle"/></span><div class=" clearfix gradient-blue  bot-body">' +
            utterance +
            '</p><span class="glyphicon glyphicon-time span-text">' +
            asr_corrected_text +
            "</span><div></div>" +
            '<span class=" clearfix"><small class="right text-muted"><span class="glyphicon glyphicon-time"></span>' +
            twelevehour_msgdtm +
            "</small></span></div><p>" +
            "</li>";
        } else {
          x +=
            '<li style="margin-bottom:0px;padding-left:15px;width:80%" class="agent clearfix"><span class="chat-img left clearfix "><img src="http://placehold.it/50/55C1E7/fff&text=A I" alt="AI" class="img-circle"/></span><div class=" clearfix gradient-blue  bot-body">' +
            utterance +
            "</p>" +
            '<span class=" clearfix"><small class="left text-muted"><span class="glyphicon glyphicon-time">' +
            twelevehour_msgdtm +
            "</span>" +
            "</small></span></div>" +
            "</li>";
        }
      } else {
        if (asr_corrected_text != "null") {
          x +=
            '<li class="admin clearfix" style="width:80%"><span class="chat-img right clearfix"><img src="http://placehold.it/50/FA6F57/fff&text=U" alt="U" class="img-circle"/></span><div class=" clearfix bot-body2">' +
            utterance +
            '</p><span class="glyphicon glyphicon-time spanuser-text">' +
            asr_corrected_text +
            "</span>" +
            '<span class=" clearfix"><small class="left dt-text"><span class="glyphicon glyphicon-time"></span>' +
            twelevehour_msgdtm +
            "&nbsp;&nbsp;</small></span></div><p>" +
            "<p id='intent_id'>" +
            "{ intent: '" +
            nlu_intent +
            "' }" +
            "</p>" +
            "</li>";
        } else {
          x +=
            '<li class="admin clearfix" style="width:80%"><span class="chat-img right clearfix"><img src="http://placehold.it/50/FA6F57/fff&text=U" alt="U" class="img-circle"/></span><div class=" clearfix bot-body2">' +
            utterance +
            "</span>" +
            '<span class=" clearfix"><small class="left dt-text"><span class="glyphicon glyphicon-time"></span>' +
            twelevehour_msgdtm +
            "&nbsp;&nbsp;</small></span></div><p>" +
            "<p id='intent_id'>" +
            "{ intent: '" +
            nlu_intent +
            "' }" +
            "</p>" +
            "</li>";
        }
      }
    }

    document.getElementById("convdiv").innerHTML = x + "</ul>";
    document.getElementById("callerid_chatdiv").innerHTML = callerid;

    // updating conversation chatdiv line no. - 304 (sandeep)
    document.getElementById("converseid_chatdiv").innerHTML = convid;

    document.getElementById("div_centernm").innerHTML = centernm;

    document.getElementById("conversionid_textbox").value = convid;

    this.setState({
      ...this.state,
      conversationID: convid,
      showAudio: true,
    });
  }

  noConvData() {
    var x = "<ul class='chat'>";

    document.getElementById("convdiv").innerHTML =
      "No Convesation Data Found" + "</ul>";
  }

  getEarlierDateBeforeToday = (todayDate, number) => {
    var fromDate = todayDate;
    let updatedEarlierDate = fromDate.setDate(fromDate.getDate() - number);
    return updatedEarlierDate;
  };

  getCallerid = async (fromDate, toDate, callStatus, callerId) => {
    const token = await this.GetAuthToken();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw;
    if (fromDate != "" && toDate != "") {
      raw = JSON.stringify({
        start_date: fromDate,
        end_date: toDate,
      });
    } else if (fromDate != "" && toDate != "" && callerId != "") {
      raw = JSON.stringify({
        start_date: fromDate,
        end_date: toDate,
        caller_id: callerId,
      });
    } else if (callerId != "" && callStatus != "") {
      raw = JSON.stringify({
        status: callStatus,
        caller_id: callerId,
      });
    } else if ((fromDate != "", toDate != "", callStatus != "")) {
      raw = JSON.stringify({
        start_date: fromDate,
        end_date: toDate,
        status: callStatus,
      });
    } else if (callerId != "") {
      raw = JSON.stringify({
        caller_id: callerId,
      });
    } else if (callStatus != "") {
      raw = JSON.stringify({
        status: callStatus,
      });
    } else {
      raw = JSON.stringify({
        start_date: fromDate,
        end_date: toDate,
        status: callStatus,
        caller_id: callerId,
      });
    }

    var requestOptions = {
      method: "POST",

      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_API_URL}/oi/api/v1/all-calls`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("search DATA", data);
        this.setState({
          ...this.state,
          All_calls: data,
          Loading: false,
        });
      })
      .catch((error) => console.log("error", error));
  };

  dateToStringFunc = (givenDate) => {
    var today = givenDate;
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "/" + mm + "/" + dd;
    return today;
  };

  getAllCallerid = async () => {
    const token = await this.GetAuthToken();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    let toDateString = this.dateToStringFunc(new Date());
    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 3);

    let fromDateString = this.dateToStringFunc(fromDate);
    console.log("Today", toDateString);
    console.log("Earlier", fromDateString);
    var raw = JSON.stringify({
      start_date: fromDateString,
      end_date: toDateString,
      status: "",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_API_URL}/oi/api/v1/all-calls`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          ...this.state,
          All_calls: data,
          Loading: false,
        });
      })
      .catch((error) => console.log("error", error));
  };

  componentDidMount() {
    this.getAllCallerid();
  }

  InputHandler = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  render() {
    let src = `${process.env.REACT_APP_API_URL}/oi/api/twilio/audio/${this.state.conversationID}`;

    console.log("from", this.state.fromDate);
    console.log("to", this.state.toDate);
    console.log("status", this.state.callStatus);

    const ResetHandler = () => {
      this.setState({
        ...this.state,
        fromDate: "",
        toDate: "",
        callStatus: "",
        FilterCallRecord: "",
        Search: false,
        Contact: "",
        ResetCheck: "true",
      });
      this.getAllCallerid();
    };

    let showcallRecords = null;

    if (this.state.Loading) {
      showcallRecords = (
        <div
          class="text-center"
          style={{
            marginTop: "45vh",
          }}
        >
          <LoaderThreeDot />
        </div>
      );
    } else {
      showcallRecords = (
        <ul
          class="nav nav-pills nav-pills-warning nav-stacked flex-column"
          style={{ flex: 1, scrollSnapType: "y mandatory" }}
          role="tablist"
        >
          {this.state.All_calls.map((k) => (
            <li class="nav-item " style={{ scrollSnapAlign: "start" }}>
              <a
                onClick={() =>
                  this.getConvdata(
                    k.conversation_id,
                    k.center_name,
                    k.caller_id
                  )
                }
                class="nav-link "
                data-toggle="pill"
                href="#"
              >
                <table
                  class=""
                  style={{
                    fontSize: "10px",
                    color: "white",
                    textAlign: "left",
                    letterSpacing: "1px",
                    marginBottom: "3px",
                    lineHeight: "1.2",
                    color: "black",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        width: "15%",
                        paddingTop: "10px",
                        paddingTop: "10px",
                      }}
                    >
                      <span id="newcall"></span>
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        paddingLeft: "10px",
                        paddingBottom: "3px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "800",
                          paddingBottom: "2px",
                          paddingRight: "5px",
                        }}
                      >
                        {k.caller_id}
                      </span>
                      <br />
                      <span
                        style={{
                          paddingBottom: "2px",
                        }}
                      >
                        {k.center_name}
                      </span>
                      <br />
                      <span>
                        {new Date(k.initiate_time).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                        })}
                      </span>
                    </td>
                  </tr>
                </table>
              </a>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div class="content-wrapper content-margin">
        <div class="container-fluid">
          {/*--<div id="root"></div>--*/}
          {/* search Menu bar */}

          <div
            class="border"
            style={{ backgroundColor: "#DADCD4", paddingLeft: "10px" }}
          >
            <div
              class="d-flex searchmenu mr-5 "
              style={{ alignItems: "center" }}
            >
              <div class="search" style={{ marginRight: "5px" }}>
                <label style={{ marginRight: "5px" }}>FROM</label>

                <input
                  type="date"
                  class="input rounded"
                  style={{ borderWidth: "thin", padding: "2px 0 2px 0" }}
                  name="fromDate"
                  value={this.state.fromDate}
                  onChange={this.InputHandler}
                />
              </div>
              <div class="search" style={{ marginRight: "5px" }}>
                <label style={{ marginRight: "5px" }}>TO</label>

                <input
                  type="date"
                  class="input rounded"
                  style={{ borderWidth: "thin", padding: "2px 0 2px 0" }}
                  name="toDate"
                  value={this.state.toDate}
                  onChange={this.InputHandler}
                />
              </div>
              <div class="search" style={{ marginRight: "5px" }}>
                <label style={{ marginRight: "5px" }}>Contact</label>

                <input
                  type="text"
                  class="input rounded"
                  style={{ borderWidth: "thin", padding: "2px 0 2px 0" }}
                  name="Contact"
                  value={this.state.Contact}
                  onChange={this.InputHandler}
                />
              </div>
              <div class="search" style={{ marginRight: "5px" }}>
                <label style={{ marginRight: "5px" }}>CALL STATUS</label>

                <select
                  id="callstatusselect"
                  class="input rounded"
                  style={{ padding: "3px 0 3px 0", height: "32.8px" }}
                  value={this.state.callStatus}
                  name="callStatus"
                  onChange={this.InputHandler}
                >
                  <option value="">Select</option>
                  <option value="AI_SUCCESS">AI Success</option>
                  <option value="OPERATOR_SUCCESS">Operator Success</option>
                  <option value="CUSTOMER_NO_RESPONSE">
                    Customer No Response
                  </option>
                  <option value="CUSTOMER_DISCONNECTED">
                    Customer Disconnected
                  </option>
                  <option value="CUSTOMER_CALLBACK">Customer Callback</option>
                  <option value="PROCEDURE_QUERY">Procedure Query</option>
                  <option value="GENERAL_QUERY">General Query</option>
                  <option value="APPOINTMENT_CONFIRMATION">
                    Appointment Confirmation
                  </option>
                </select>
              </div>
              <button
                class="btn btn-success btn-round"
                style={{ marginRight: "5px", padding: "7px" }}
                onClick={() =>
                  this.getCallerid(
                    this.state.fromDate,
                    this.state.toDate,
                    this.state.callStatus,
                    this.state.Contact
                  )
                }
              >
                Search
              </button>

              <button
                class="btn btn-warning btn-round"
                style={{
                  marginRight: "5px",
                  padding: "7px",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
                onClick={ResetHandler}
              >
                Reset
              </button>
            </div>
          </div>

          {/* search menubar end */}

          <div class="content-wrapper content-margin">
            <div class="container-fluid">
              <div class="row">
                <div
                  id="callrec"
                  class="col-md-2 call_divscrl"
                  style={{
                    height: "90vh",
                    padding: "0px",
                    // display: "flex",
                    // width: "220px",
                  }}
                >
                  <div>{showcallRecords}</div>
                </div>

                <div
                  // class="col-md-7 tab-content"
                  class="tab-content"
                  style={{
                    height: "100vh",
                    // backgroundColor: "yellow",
                    // flex: "1",
                    marginRight: "21.5px",
                    width: "56.5vw",
                    marginRight: "3px",
                  }}
                >
                  <div id="item-01" class="container-fluid tab-pane active">
                    <div
                      class="card"
                      style={{
                        flexDirection: "column",
                        padding: "0px 5px",
                      }}
                    >
                      {/* <div class="text-center"> */}
                      <div
                        class="row"
                        style={{
                          height: "5vh",
                        }}
                      >
                        <div
                          class="col-3 text-left"
                          id="callerid_chatdiv"
                        ></div>
                        <div
                          id="div_centernm"
                          class="col-4 text-center"
                          style={{ textTransform: "capitalize" }}
                        >
                          Conversation
                        </div>
                        <div
                          class="col-5 text-right"
                          style={{
                            fontWeight: "normal",
                            fontSize: "x-small",
                            fontStyle: "italic",
                          }}
                          id="converseid_chatdiv"
                        ></div>
                      </div>

                      <div class="row">
                        <div
                          class="card-body chat-care chat-body scrollDisplay"
                          id="convdiv"
                          style={{
                            flex: 1,
                            height: "79vh",
                          }}
                        >
                          <h2
                            class="col-md-12 col-lg-12 text-center"
                            style={{ marginTop: "45vh", color: "grey" }}
                          >
                            Please select a conversation
                          </h2>
                        </div>
                      </div>
                      {/* chat card footer  */}
                      <div class="row">
                        <div
                          class=" text-center col-md-12 col-lg-12"
                          style={{
                            height: "6vh",
                          }}
                        >
                          {this.state.showAudio && this.state.conversationID ? (
                            <Audio src={src} />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ORDER DETAILS  */}
                {/*--Order Detail Start--*/}
                <div
                  // class=" col-md-3"
                  style={{
                    height: "90vh",

                    width: "25%",
                  }}
                >
                  <div class="col-lg-12 col-md-12" id="orderdetail_div">
                    <CallHistoryOrderForm
                      convid={this.state.conversationID}
                      getTokenFunc={this.GetAuthToken}
                      ResetCheck={this.state.ResetCheck}
                      state={this.state}
                      setState={this.setState()}
                    />
                  </div>
                </div>
                {/*Order Detail End*/}
              </div>
            </div>
            <input
              type="hidden"
              name="conversionid_textbox"
              id="conversionid_textbox"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth0(Callhistory);
