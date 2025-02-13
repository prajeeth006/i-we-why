using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Terminal;

internal sealed class TerminalDetailsDto : IPosApiResponse<TerminalDetailsResponse>
{
    public string Status { get; set; }

    public TerminalDetailsDataDto Data { get; set; }

    public TerminalDetailsResponse GetData() => new TerminalDetailsResponse(
        status: Status,
        data: Data?.GetData());
}

internal sealed class TerminalDetailsDataDto : IPosApiResponse<TerminalDetailsData>
{
    public string TerminalType { get; set; }

    public string IpAddress { get; set; }

    public string MacId { get; set; }

    public int Volume { get; set; }

    public string TerminalStatus { get; set; }

    public string Resolution { get; set; }

    public string LockStatus { get; set; }

    public TerminalCustomerAccountDto CustomerAccount { get; set; }

    public TerminalDetailsData GetData() => new TerminalDetailsData(
        terminalType: TerminalType,
        ipAddress: IpAddress,
        macId: MacId,
        volume: Volume,
        terminalStatus: TerminalStatus,
        resolution: Resolution,
        lockStatus: LockStatus,
        customerAccount: CustomerAccount?.GetData());
}

internal sealed class TerminalCustomerAccountDto : IPosApiResponse<TerminalCustomerAccount>
{
    public string CustomerId { get; set; }

    public string AccountName { get; set; }

    public TerminalCustomerAccount GetData() => new TerminalCustomerAccount(
        customerId: CustomerId,
        accountName: AccountName);
}
