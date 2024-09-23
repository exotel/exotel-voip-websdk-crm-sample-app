import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import ExotelCRMWebSDK from "exotel-ip-calling-crm-websdk";
import Notification from "./Notification";
import DialPad from "./DialPad";

const accessToken = "<accessToken>";
const userId = "<userId>";

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("info");
  const [notificationMessage, setNotificationMessage] = useState(
    "Dialling +918878367443"
  );
  const webPhone = useRef(null);

  const HandleCallEvents = (eventType, ...args) => {
    console.log("HandleCallEvents", eventType, { args });
    /**
     * args[0] is the call object that should look like this
     * {
        "callAnswerTime": "",
        "callDirection": "",
        "callDuration": "",
        "callEndReason": "",
        "callEndedTime": "",
        "callEstablishedTime": "",
        "callFromNumber": "userxyz",
        "callId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@pstn.example.com",
        "callSid": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "callStartedTime": "",
        "callState": "",
        "remoteDisplayName": "",
        "remoteId": "",
        "sessionId": ""
      }
     */
    switch (eventType) {
      case "incoming":
        setIsIncomingCall(true);
        break;
      case "connected":
        setCallActive(true);
        break;
      case "callEnded":
        setCallActive(false);
        setIsIncomingCall(false);
        break;
      case "holdtoggle":
        handleToggleOnHold();
        break;
      case "mutetoggle":
        handleToggleMute();
        break;
      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }
  };

  useEffect(() => {
    if (isDeviceRegistered) {
      setShowNotification(true);
      setNotificationType("info");
      setNotificationMessage(`Device is online`);
      setTimeout((_) => {
        setShowNotification(false);
      }, 3000);
      return;
    }
  }, [isDeviceRegistered]);

  const RegisterationEvent = (event) => {
    if (event === "registered") {
      setIsDeviceRegistered(true);
      return;
    }
    if (event === "unregistered") {
      setIsDeviceRegistered(false);
    }
  };

  useEffect(() => {
    return async () => {
      if (webPhone.current) {
        return;
      }
      console.log("initialising crmWebPhone", { webPhone });
      const crmWebSDK = new ExotelCRMWebSDK(accessToken, userId, true);
      const crmWebPhone = await crmWebSDK.Initialize(
        HandleCallEvents,
        RegisterationEvent
      );
      console.log("initialised crmWebPhone", { crmWebPhone });
      webPhone.current = crmWebPhone;
    };
  });

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const dialCallback = (status, response) => {
    console.log("dialCallback response", { response });
    /** Response format is
     * {
          "CustomerId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "AppId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "CallSid": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          "ExotelAccountSid": "exoteltestaccount",
          "DialWhomNumber": "xxxxxxxxxx",
          "AppUserID": "user123",
          "VirtualNumber": "xxxxxxxxxx",
          "Direction": "outbound",
          "CallStatus": "",
          "CallState": "active",
          "ToNumber": "xxxxxxxxxx",
          "FromNumber": "sip:userxyz",
          "TotalDuration": 0,
          "CallRecordings": "",
          "AccountDomain": "Mumbai",
          "TicketId": "",
          "CallDetail": null,
          "CreatedAt": "0001-01-01T00:00:00Z",
          "UpdatedAt": "0001-01-01T00:00:00Z"
        }
    */
    console.log("dialCallback status", status);

    if (status === "success") {
      const callSid = response.Data.CallSid;
      console.log("CallSid is ", callSid);
      // webPhone?.AcceptCall();
      // setCallActive(true);
      // return;
    }
    // setCallActive(false);
  };

  const dial = () => {
    if (/^\+?[0-9]{10,14}$/.test(phoneNumber)) {
      setCallActive(true);
      setIsIncomingCall(false);
      showDiallingNotification(phoneNumber);
      webPhone?.current?.MakeCall(phoneNumber, dialCallback);
    } else {
      showDiallingErrorNotification();
    }
  };

  const showDiallingNotification = (phoneNumber) => {
    setShowNotification(true);
    setNotificationType("info");
    setNotificationMessage(`Dialling <b>${phoneNumber}</b>`);
    setTimeout((_) => {
      setShowNotification(false);
    }, 3000);
  };

  const showDiallingErrorNotification = () => {
    setShowNotification(true);
    setNotificationType("danger");
    setNotificationMessage(
      "Please enter a valid phone number (10-14 digits, optional +)."
    );
    setTimeout((_) => {
      setShowNotification(false);
    }, 3000);
  };

  const acceptCall = () => {
    webPhone?.current?.AcceptCall();
  };

  const hangup = () => {
    webPhone?.current?.HangupCall();
    setCallActive(false);
    showCallEndedNotification();
  };

  const showCallEndedNotification = () => {
    setShowNotification(true);
    setNotificationType("info");
    setNotificationMessage("Call Disconnected");

    setTimeout((_) => {
      setShowNotification(false);
    }, 3000);
  };

  const onClickToggleMute = () => {
    webPhone?.current?.ToggleMute();
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    setShowNotification(true);
    setNotificationType("info");
    if (!isMuted) {
      setNotificationMessage("Call Muted");
    } else {
      setNotificationMessage("Call Un-muted");
    }
    setTimeout((_) => {
      setShowNotification(false);
    }, 3000);
  };

  const handleToggleOnHold = () => {
    if (isOnHold) {
      setIsOnHold(false);
      return;
    }
    setIsOnHold(true);
  };

  const onClickToggleHold = () => {
    webPhone?.current?.ToggleHold();
  };

  return (
    <div className="App">
      <h2>Exotel Web Phone Sample Interface</h2>
      {showNotification && notificationMessage && (
        <Notification
          notificationMessage={notificationMessage}
          type={notificationType}
        />
      )}

      {!isDeviceRegistered ? (
        "Waiting for device to register"
      ) : (
        <>
          <input
            className="phoneNumberInput"
            type="text"
            id="phoneNumber"
            placeholder="Enter phone number"
            pattern="^\+?[0-9]{10,14}$"
            title="Please enter a valid phone number (10-14 digits, optional +)."
            onChange={handlePhoneNumberChange}
          ></input>
          <div className="PhoneControls">
            {!callActive && (
              <button className="dial" onClick={dial}>
                Dial
              </button>
            )}
            {callActive && (
              <button className="accept" onClick={acceptCall}>
                Accept
              </button>
            )}
            <button className="hangup" onClick={hangup} disabled={!callActive}>
              Hangup
            </button>
            {callActive && (
              <>
                <button
                  className="mute-unmute"
                  onClick={onClickToggleMute}
                  disabled={!callActive}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
                <button
                  className={isOnHold ? "UnHold" : "Hold"}
                  onClick={onClickToggleHold}
                  disabled={!callActive}
                >
                  {isOnHold ? "Unhold" : "Hold"}
                </button>
                <DialPad sendDTMF={(digit) => webPhone.current.SendDTMF(digit)}/>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
