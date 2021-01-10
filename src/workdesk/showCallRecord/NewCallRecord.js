import React from "react";

const NewCallRecord = ({
  conversationID,
  centerName,
  callerId,
  initialTime,
  getConvdata,
}) => {
  return (
    <>
      <li
        style={{
          scrollSnapAlign: "start",
        }}
        class="nav-item  toggle"
        id="newcall"
      >
        {/* <ExpireElement  key={Math.random(1, 1000)}> */}
        <a
          style={{
            boxShadow: "1px 1px rgba(0,0,0,0.5)",
            // backgroundColor: { ongoingCallColor }, // changing color, ongoing call clicked
          }}
          onClick={() => getConvdata(conversationID, centerName, callerId)}
          class="nav-link newcall-btn "
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
                }}
              >
                <span id="newcall"></span>
              </td>
              <td
                style={{
                  textAlign: "left",
                  paddingLeft: "10px",
                  paddingBottom: "3px",
                  width: "85%",
                }}
              >
                <span
                  style={{
                    fontWeight: "800",
                    paddingBottom: "2px",
                    paddingRight: "5px",
                  }}
                >
                  {callerId}
                </span>
                <span
                  style={{
                    paddingBottom: "2px",
                  }}
                >
                  {centerName}
                </span>
                <br />
                <span>
                  {new Date(initialTime).toLocaleString("en-US", {
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
    </>
  );
};

export default NewCallRecord;
