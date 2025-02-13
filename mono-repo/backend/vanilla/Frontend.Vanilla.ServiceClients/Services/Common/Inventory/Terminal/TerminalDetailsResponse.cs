namespace Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Terminal;

/// <summary>
/// Terminal details response.
/// </summary>
public sealed class TerminalDetailsResponse
{
    /// <summary>
    /// Status.
    /// </summary>
    public string Status { get; }

    /// <summary>
    /// Terminal details data <see cref="TerminalDetailsData"/>.
    /// </summary>
    public TerminalDetailsData Data { get; }

    /// <summary>
    /// TerminalDetailsResponse.
    /// </summary>
    public TerminalDetailsResponse(
        string status = default,
        TerminalDetailsData data = default)
    {
        Status = status;
        Data = data;
    }
}

/// <summary>
/// Terminal details data.
/// </summary>
public sealed class TerminalDetailsData
{
    /// <summary>
    /// Terminal type.
    /// </summary>
    public string TerminalType { get; }

    /// <summary>
    /// IP address.
    /// </summary>
    public string IpAddress { get; }

    /// <summary>
    /// MAC ID.
    /// </summary>
    public string MacId { get; }

    /// <summary>
    /// Volume.
    /// </summary>
    public long Volume { get; }

    /// <summary>
    /// Terminal status.
    /// </summary>
    public string TerminalStatus { get; }

    /// <summary>
    /// Resolution.
    /// </summary>
    public string Resolution { get; }

    /// <summary>
    /// Lock status.
    /// </summary>
    public string LockStatus { get; }

    /// <summary>
    /// Terminal customer account <see cref="TerminalCustomerAccount"/>.
    /// </summary>
    public TerminalCustomerAccount CustomerAccount { get; }

    /// <summary>
    /// TerminalDetailsData.
    /// </summary>
    public TerminalDetailsData(
        string terminalType = default,
        string ipAddress = default,
        string macId = default,
        long volume = default,
        string terminalStatus = default,
        string resolution = default,
        string lockStatus = default,
        TerminalCustomerAccount customerAccount = default)
    {
        TerminalType = terminalType;
        IpAddress = ipAddress;
        MacId = macId;
        Volume = volume;
        TerminalStatus = terminalStatus;
        Resolution = resolution;
        LockStatus = lockStatus;
        CustomerAccount = customerAccount;
    }
}

/// <summary>
/// Terminal customer account.
/// </summary>
public sealed class TerminalCustomerAccount
{
    /// <summary>
    /// Customer ID.
    /// </summary>
    public string CustomerId { get; }

    /// <summary>
    /// Account name.
    /// </summary>
    public string AccountName { get; }

    /// <summary>
    /// TerminalCustomerAccount.
    /// </summary>
    public TerminalCustomerAccount(
        string customerId = default,
        string accountName = default)
    {
        CustomerId = customerId;
        AccountName = accountName;
    }
}
