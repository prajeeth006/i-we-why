export enum DataFeedStatus {

    RequestedAuthenticationKey,
    WaitingForAuthenticationKey,
    GotAuthenticationKey,
    DidNotGotAuthenticationKey,
  
    WaitingForDFConnection,
    ConnectedToDF,
    DFConnectionFailed,
    DFConnectionRetrying,
    DFConnectionTimeout,
  
    Has404Error,
    SnapShotTimeout,
    UnAuthorized,
    HasData,
    SnapShotReceived
  
  }