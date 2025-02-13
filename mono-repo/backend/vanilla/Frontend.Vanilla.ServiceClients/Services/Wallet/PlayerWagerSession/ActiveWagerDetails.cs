using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerWagerSession;

internal sealed class ActiveWagerDetails(
    string productId = null,
    UtcDateTime lastWageredTimeStamp = default,
    bool blockWager = true,
    string blockWagerForSeconds = null,
    decimal code = 0,
    string codeDescription = null,
    UtcDateTime firstActivatedTime = default)
    : IPosApiResponse<ActiveWagerDetails>
{
    public string ProductId { get; set; } = productId;
    public UtcDateTime LastWageredTimeStamp { get; set; } = lastWageredTimeStamp;
    public bool BlockWager { get; set; } = blockWager;
    public string BlockWagerForSeconds { get; set; } = blockWagerForSeconds;
    public decimal Code { get; set; } = code;
    public string CodeDescription { get; set; } = codeDescription;
    public UtcDateTime FirstActivatedTime { get; set; } = firstActivatedTime;

    public ActiveWagerDetails GetData() => this;
}
