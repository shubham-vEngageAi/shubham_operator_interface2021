import React from "react";



export function DislpayLiveConvesationMessage({myConvObj}) {
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

