using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Model data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Retail.TerminalSession;

public sealed class TerminalSessionDto(string brand = null, string shopId = null, string terminalId = null, long cumulativeBalance = 0)
    : IPosApiResponse<TerminalSessionDto>
{
    public string Brand { get; } = brand;
    public string ShopId { get; } = shopId;
    public string TerminalId { get; } = terminalId;
    public long CumulativeBalance { get; } = cumulativeBalance;

    public TerminalSessionDto GetData() => this;
}
