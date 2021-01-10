import React from "react";
import Audio from "../../Audio/AudioFile/Audio";


const Conversation = ({ showAudio, conversationID }) => {
  let src = `${process.env.REACT_APP_API_URL}/oi/api/twilio/audio/${conversationID}`;
  return (
    <>
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
            <div class="col-3 text-left" id="callerid_chatdiv"></div>
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
              {showAudio && conversationID && <Audio src={src} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversation;
