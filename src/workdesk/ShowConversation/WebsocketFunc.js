import React from 'react';
import {DislpayLiveConvesationMessage} from './LiveConversation';
export  const componentDidMountWithToken = async () => {
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
      componentDidMountWithToken();
    };
  };