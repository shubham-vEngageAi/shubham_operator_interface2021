import React from "react";

const UnconcludedCall = (
  conversationID,
  centerName,
  callerId,
  initialTime,
  getConvdata
) => {
  return (
    <>
      <li class="nav-item " style={{ scrollSnapAlign: "start" }}>
        {/* <ExpireElement class="nav-item toggle"> */}
        <a
          style={{
            boxShadow: "1px 1px rgba(0,0,0,0.5)",
          }}
          onClick={() => getConvdata(conversationID, centerName, callerId)}
          class="nav-link"
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
                  {callerId}
                </span>
                <br />
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
        {/* </ExpireElement> */}
      </li>
    </>
  );
};

export default UnconcludedCall;
