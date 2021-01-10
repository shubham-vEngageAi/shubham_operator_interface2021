import React, { Component } from "react";
import { withAuth0 } from "@auth0/auth0-react";

class CallCompleted extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  } //end constructor

  updatecallCompleted = async () => {
    const token = await this.props.GetAuthToken();

    if (
      document.getElementById("basic-select").value != "" &&
      document.getElementById("feedback_detail").value != ""
    ) {
      var callstatus = document.getElementById("basic-select").value;
      //var operator_id = document.getElementById('operatorid_textbox').value;
      var conversationid = document.getElementById("conversionid_textbox")
        .value;
      var call_feedback = document.getElementById("feedback_detail").value;

      if (conversationid != "") {
        fetch(
          process.env.REACT_APP_API_URL + "/oi/api/v1/updatestatusbyoperator",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              conversation_id: conversationid,
              status_updated_by_operator: callstatus,
              feedback: call_feedback,
            }),
          }
        )
          .then((response) => response.text())
          .then((data) => this.callstsactionmsg(data))
          .catch((err) => {
            this.callstatusupdatefailureMsg();
          });
      }
    } else {
      alert("Please fill out feedback and call completed status");
    }
  };

  callstsactionmsg(updatedstatus) {
    alert("Data updated successfully");
    //alert(updatedstatus);
    // document.getElementById("btnclose").click();
    document.getElementById("basic-select").value = "";
    document.getElementById("feedback_detail").value = "";
  }

  callstatusupdatefailureMsg() {
    alert("Data Updation Failed, try again");
    document.getElementById("btnclose").click();
  }

  render() {
    return (
      <div class="row">
        <div class="card">
          <div class="card-body  cardbody">
            <div class="card-title">Call Completion Status</div>
            <form>
              <div class="row ">
                <select
                  class="form-control col-md-12 col-lg-12"
                  id="basic-select"
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
                  <option value="APPOINTMENT_CONFIRMATION">
                    Appointment Confirmation
                  </option>
                </select>
              </div>
              {/* callStatusCSS */}
              <div class="row">
                <textarea
                  placeholder="Please share your feedback... "
                  class="form-control "
                  id="feedback_detail"
                ></textarea>
              </div>
              <div class="text-center">
                <button
                  onClick={() => this.updatecallCompleted()}
                  type="button"
                  class="btn btn-success btn-square waves-effect waves-light m-1"
                >
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth0(CallCompleted);
