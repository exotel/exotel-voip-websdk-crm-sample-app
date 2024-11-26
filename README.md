# Sample Application of CRM WebSDK for IPPSTN Calling
This project provides an easy-to-integrate SoftPhone SDK for web applications. The SDK allows developers to embed a fully functional softphone within their web projects which can be an inhouse webportal or a CRM Application, enabling seamless communication between agents and customers. The softphone supports both inbound and outbound calling, along with programmatically making calls . By following the simple integration steps provided, developers can quickly enhance their applications with powerful voice communication capabilities.


Using NPM

Refer to the project inside npm-sample-app directory. This project is created using the Create React App utility.

Refer to SDK documentation [here](https://github.com/exotel/exotel-ip-calling-crm-websdk/tree/main)

# For Non-npm Integration
If you are not using a package manager like NPM, you can directly include the bundled JavaScript file provided in the target directory.

## Steps

1. First you have to generate a **'target'** folder. Refer [this](https://github.com/exotel/exotel-ip-calling-crm-websdk)

1. You can now utilize the **'crmBundle.js'** file from **'target** folder by including it as a script in your project.. 
```js
<script src="./target/crmBundle.js"></script>
```

3. Configure the crmWebSDK object like this:
```js
const crmWebSDK = new ExotelCRMWebSDK(accessToken, userId, true);
```

4. **ExotelCRMWebSDK**
    
    **contructor**
      
      **accessToken** : This can be generated using the 
  [Create Authentication Token API](https://developer.exotel.com/api/ip-pstn-intermix-webrtc-sdk-integration#create-authentication-token)

    **userId** : You can get the AppUserId using the [Application user management APIs](https://developer.exotel.com/api/ip-pstn-intermix-webrtc-sdk-integration#applications-user-management)
    
    **autoConnectVOIP** : If true, it will auto-connect device when the `ExotelWebPhoneSDK` is returned on initialization. (If you have passed false, then you must call `DoRegister` on `ExotelWebPhoneSDK`)

    **Initialize**

    Initializes the CRMWebSDK, sets up the phone object, and registers callbacks for various events.

    Parameters:

    `sofPhoneListenerCallback` (function): Callback for incoming calls.
    
    `softPhoneRegisterEventCallBack` (function, optional): Callback for soft phone register events. Default is null.
    
    `softPhoneSessionCallback` (function, optional): Callback for soft phone session events. Default is null.

    Returns:

    Promise<ExotelWebPhoneSDK | void>: A promise that resolves to an instance of ExotelWebPhoneSDK if successful, or void if unsuccessful.

5. Use the `Initialize` method on the `ExotelCRMWebSDK` object which returns Promise that resolves to `ExotelWebPhoneSDK` object.
    `ExotelCRMWebSDK` does all the work to get necessary details required for the `ExotelWebPhoneSDK`

```javascript
const crmWebPhone = await crmWebSDK.Initialize(HandleCallEvents, RegisterationEvent);
```

You must pass call events handler, registeration event handler (optional) and session callback handler (optional) to the `Initialize` method

6. **ExotelWebPhoneSDK**
   
   1. **RegisterDevice**: Registers the device with the call server.
   2. **UnRegisterDevice**: Un-registers the device from the call server.
   3. **AcceptCall**: Accept call
   4. **HangupCall**: Disconnect call
   5. **MakeCall**: (async) Method that places a call
        
        **Number**: A number to dial

        **dialCallback**: It is called after the call request is made to the server (An actual call may start after this with a slight day).

        **CustomField**: String; Any application-specific value like order id that will be passed back as a parameter in status callback.

   7. **ToggleHold**: Toggle state hold/un-hold state of a call. This state needs to be maintained by the client
   8. **ToggleMute** Toggle state mute/un-mute state of a call. This state needs to be maintained by the client

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](https://apache.org/licenses/LICENSE-2.0) file for details.

