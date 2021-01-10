import React, { Component } from "react";
import { withAuth0 } from "@auth0/auth0-react";
// import Audio from "../Audio/AudioFile/Audio";
import OrderDetails from "../OrderDetails/Forms/OrderDetails";
import LoaderThreeDot from "../Loader/LoaderThreeDot";
import NewCallRecord from "./showCallRecord/NewCallRecord";
import UnconcludedCall from "./showCallRecord/UnconcludedCall";
import Conversation from "./ShowConversation/Conversation";

class Workdesk extends Component {
  constructor() {
    super();
    this.state = {
      unconcluded_calls: [],
      new_calls: [],
      Loading: false,
      endpoint: process.env.REACT_APP_WS_URL,
      message: [],
      convmsg: [],
      conversationID: "",
      fetchedOrder: {},
      showAudio: false,
      NotShowLiveAudio: false,
      OngoingCallClick: false,
      OngoingCallSave: false,
    };
  }

  componentDidMount() {
    //initialize connection
    this.componentDidMountWithToken(); //this function runs when component mount initially
  }

  componentDidMountWithToken = async () => {
    const token = await this.GetAuthToken();
    const ws = new WebSocket(`${this.state.endpoint}/oi/api/v1/ws/${token}`);
    ws.onopen = () => {
      //send any msg from Client if needed
      console.log("connected");
    };
    //save whatever response from client

    ws.onmessage = (evt) => {
      var str = evt.data;
      console.log("messages--->", str);
      let jsonMsg = JSON.parse(str);
      // console.log("MESSAGETYPE", jsonMsg.event_type);
      if (jsonMsg.event_type === "NEW_CALL") {
        let updatedData = this.state.new_calls;
        updatedData.unshift(JSON.parse(evt.data)); // Adding new call in the beginning of updateData Array

        console.log("updatedDATA: " + updatedData);
        this.setState({
          ...this.state,
          new_calls: updatedData,
          // message:this.state.message.concat(JSON.parse(evt.data))
        });
      } else if (jsonMsg.event_type === "CONVERSATION_DETAILS") {
        //  console.log(jsonMsg.details);

        // var newcallObj = JSON.parse(evt.data);
        // var displayed_conversionid = document.getElementById(
        //   "conversionid_textbox"
        // ).value;
        let displayed_conversionid = this.state.conversationID;
        if (displayed_conversionid == jsonMsg.conversation_id) {
          this.DislpayLiveConvesationMessage(jsonMsg.details);
        }
      } else if (jsonMsg.event_type === "ORDER_DETAILS") {
        console.log("JSONMSG_ORDER_DETAIL", jsonMsg);
        this.setState({
          ...this.state,
          fetchedOrder: jsonMsg,
        });
      }
    };

    ws.onclose = (evt) => {
      console.log("Disconnected");
      this.componentDidMountWithToken();
    };
  };

  DislpayLiveConvesationMessage(myConvObj) {
    // this.setState({
    //   ...this.state,
    //   NotShowLiveAudio: true,
    // });

    document.getElementById("convdiv").innerHTML =
      "<img  id='convloader' width='550px' height='420px' src='/assets/images/messenger-icon.gif' />";

    var x = "<ul class='chat' width>";
    var chatdetail_data = myConvObj;

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
        month: "long",
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
      var convid = JSON.stringify(chatdetail_data[i].conversation_id)
        .replace('"', "")
        .replace('"', "");
      console.log("ConvID:" + convid);
      var centernm = JSON.stringify(chatdetail_data[i].center_name)
        .replace('"', "")
        .replace('"', "");
      var callerid = JSON.stringify(chatdetail_data[i].caller_id)
        .replace('"', "")
        .replace('"', "");

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
      // console.log(nlu_intent);
      if (message_from == '"BOT"') {
        if (asr_corrected_text != "null") {
          x +=
            '<li class="agent clearfix " id="bot_margin_left" style="display:flex;width:80%"><span class="chat-img left clearfix "><img src="http://placehold.it/50/55C1E7/fff&text=A I" alt="AI" class="img-circle"/></span><div class=" clearfix gradient-blue  bot-body"><div class="header clearfix"><strong class="primary-font">AI</strong> <small class="right text-muted"><span class="glyphicon glyphicon-time"></span>' +
            twelevehour_msgdtm +
            "</small></div><p>" +
            utterance +
            '</p><span class="glyphicon glyphicon-time span-text">' +
            asr_corrected_text +
            '</span></div><div><!--<span class="keyword">Xray, Knee</span></div>--></li>';
        } else {
          x +=
            '<li class="agent clearfix" id="bot_margin_left" style="display:flex;width:80%" ><span class="chat-img left clearfix "><img src="http://placehold.it/50/55C1E7/fff&text=A I" alt="AI" class="img-circle"/></span><div class=" clearfix gradient-blue  bot-body"><div class="header clearfix"><strong class="primary-font">AI</strong> <small class="right text-muted"><span class="glyphicon glyphicon-time"></span>' +
            twelevehour_msgdtm +
            "</small></div><p>" +
            utterance +
            '</p></div><div><!--<span class="keyword">Xray, Knee</span></div>--></li>';
        }
      } else {
        if (asr_corrected_text != "null") {
          x +=
            '<li class="admin clearfix" style="width:80%" ><span class="chat-img right clearfix"><img src="http://placehold.it/50/FA6F57/fff&text=U" alt="U" class="img-circle"/></span><div class=" clearfix bot-body2"><div class="header clearfix"><small class="left dt-text"><span class="glyphicon glyphicon-time"></span>' +
            twelevehour_msgdtm +
            '&nbsp;&nbsp;</small><strong class="right primary-font">' +
            centernm +
            "</strong></div><p>" +
            utterance +
            '</p><span class="glyphicon glyphicon-time spanuser-text">' +
            asr_corrected_text +
            "</span></div>" +
            "<p id='intent_id'>" +
            "{ intent: '" +
            nlu_intent +
            "' }" +
            "</p>" +
            "</li>";
        } else {
          x +=
            '<li class="admin clearfix" style="width:80%" ><span class="chat-img right clearfix"><img src="http://placehold.it/50/FA6F57/fff&text=U" alt="U" class="img-circle"/></span><div class=" clearfix bot-body2"><div class="header clearfix"><small class="left dt-text"><span class="glyphicon glyphicon-time"></span>' +
            twelevehour_msgdtm +
            '&nbsp;&nbsp;</small><strong class="right primary-font">' +
            centernm +
            "</strong></div><p>" +
            utterance +
            "</p></div>" +
            "<p id='intent_id'>" +
            nlu_intent +
            "</p>" +
            "</li>";
        }
      }
    }

    document.getElementById("convdiv").innerHTML = x + "</ul>";
    document.getElementById("callerid_chatdiv").innerHTML = callerid;
    document.getElementById("div_centernm").innerHTML = centernm;

    var operator_id = JSON.stringify(myConvObj[0]["operator_id"]);
    //document.getElementById('operatorid_textbox').value=operator_id;

    document.getElementById("conversionid_textbox").value = convid;
    this.setState({
      ...this.state,
      conversationID: convid,
    });
    // console.log("Convid workdesk js", convid);
    this.scrollToBottom();
  }

  noConvData() {
    var x = "<ul class='chat'>";

    document.getElementById("convdiv").innerHTML =
      "No Convesation Data Found" + "</ul>";
  }

  getConvdata = async (convid, centernm, callerid) => {
    const token = await this.GetAuthToken();

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
        return this.DisplayConvData(data, centernm, callerid, convid);
      })
      .catch((err) => {
        this.noConvData();
      });
  };

  DisplayConvData(chatdetail_data, centernm, callerid, convid) {
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
      x + "No Convesation Data Found" + "</ul>";
  }

  GetAuthToken = async () => {
    const { getAccessTokenSilently } = this.props.auth0;
    const token = await getAccessTokenSilently();
    return token;
  };

  MountComponentWithToken = async () => {
    const { getAccessTokenSilently } = this.props.auth0;
    const token = await this.GetAuthToken();
    this.setState({
      ...this.state,
      Loading: true,
    });
    //console.log(token);
    fetch(process.env.REACT_APP_API_URL + "/oi/api/v1/unconcluded-calls", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }) /*end fetch */
      .then((results) => results.json())
      .then((data) =>
        this.setState({
          ...this.state,
          unconcluded_calls: data,
          Loading: false,
        })
      );
  };

  componentWillMount() {
    this.MountComponentWithToken();
  } //end life cycle

  scrollToBottom = () => {
    if (this.container) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  };
  passShowRecordsStatus = (color, conversationID) => {
    return color ? true : false;
  };
  render() {
    let OngoingCallPass = (colorYes) => {
      this.setState({
        ...this.state,
        OngoingCallSave: colorYes,
        OngoingCallClick: false,
      });
    };

    // let src = `${process.env.REACT_APP_API_URL}/oi/api/twilio/audio/${this.state.conversationID}`;
    //alert(this.state.data)
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
          {this.state.new_calls.map((k) => (
            <NewCallRecord
              conversationID={k.conversation_id}
              centerName={k.center_name}
              callerId={k.caller_id}
              initialTime={k.initiate_time}
              getConvdata={this.getConvdata}
            />
          ))}

          {this.state.unconcluded_calls.map((k) => (
            <UnconcludedCall
              conversationID={k.conversation_id}
              centerName={k.center_name}
              callerId={k.caller_id}
              initialTime={k.initiate_time}
              getConvdata={this.getConvdata}
            />
          ))}
        </ul>
      );
    }

    return (
      <div
        class="content-wrapper content-margin"
        style={{ margin: "0px", padding: "0px", boxSizing: "border-box" }}
      >
        <div
          class="container-fluid"
          // style={{ backgroundColor: "red",}}
        >
          <div class="content-wrapper content-margin">
            <div class="container-fluid">
              <div class="row">
                <div
                  id="callrec"
                  // class=" call_divscrl"
                  class="col-md-2 call_divscrl"
                  style={{
                    height: "90vh",
                    padding: "0px",
                  }}
                >
                  <div>{showcallRecords}</div>
                </div>

                <div
                  // class="tab-content"
                  // class="col-md-7 tab-content"
                  style={{
                    height: "90vh",
                    // backgroundColor: "yellow",
                    width: "58.5vw",
                    marginRight: "0px",
                  }}
                >
                  <Conversation
                    showAudio={this.state.showAudio}
                    conversationID={this.state.conversationID}
                  />
                </div>

                {/* ORDER DETAILS  */}
                {/*--Order Detail Start--*/}
                <div
                  class=" col-md-3"
                  style={{
                    height: "90vh",
                    // backgroundColor: "#DADCD4",
                    // width: "25%",
                    marginLeft: "0px",
                  }}
                >
                  <div class="col-lg-12 col-md-12" id="orderdetail_div">
                    <OrderDetails
                      OngoingCallPass={OngoingCallPass}
                      recordsLoading={this.state.Loading}
                      convid={this.state.conversationID}
                      getTokenFunc={this.GetAuthToken}
                      fetchedLiveOrder={this.state.fetchedOrder}
                    />
                    {/* <OrderDetailsNew
                      convid={this.state.conversationID}
                      getTokenFunc={this.GetAuthToken}
                      fetchedLiveOrder={this.state.fetchedOrder}
                    /> */}
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

export default withAuth0(Workdesk);
