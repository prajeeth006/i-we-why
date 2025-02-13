using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services.Offers;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.Gamification;

internal sealed class CoinsBalance(string balance, string status, string statusCode, string statusMessage, IReadOnlyList<PosApiKeyValuePair> additionalAttribs)
    : IPosApiResponse<CoinsBalance>
{
    public string Balance { get; } = balance;
    public string Status { get; } = status;
    public string StatusCode { get; } = statusCode;
    public string StatusMessage { get; } = statusMessage;
    public IReadOnlyList<PosApiKeyValuePair> AdditionalAttribs { get; } = additionalAttribs;
    public IReadOnlyList<ProductBalance> ProductBalances { get; }

    public CoinsBalance GetData() => this;
}

internal sealed class CoinsBalanceRequest(SourceInfo sourceInfo, int expiryInDays, IReadOnlyList<PosApiKeyValuePair> additionalAttribs)
{
    public SourceInfo SourceInfo { get; } = sourceInfo;
    public int ExpiryInDays { get; } = expiryInDays;
    public IReadOnlyList<PosApiKeyValuePair> AdditionalAttribs { get; } = additionalAttribs;
}

internal sealed class SourceInfo
{
    public string Source { get; set; }
}

internal sealed class ProductBalance
{
    public string Product { get; set; }
    public string Balance { get; set; }
}
