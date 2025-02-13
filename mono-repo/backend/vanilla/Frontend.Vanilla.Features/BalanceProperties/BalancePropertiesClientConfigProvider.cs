using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.BalanceProperties;

internal sealed class BalancePropertiesClientConfigProvider(
    IPosApiWalletService posApiWalletService,
    ICachedUserValuesFlag cachedUserValuesFlag,
    ICurrentUserAccessor currentUserAccessor,
    ILogger<BalancePropertiesClientConfigProvider> log)
    : LambdaClientConfigProvider("vnBalanceProperties", async cancellationToken =>
    {
        if (!currentUserAccessor.User.IsAuthenticatedOrHasWorkflow())
            return new { };

        var cached = await cachedUserValuesFlag.GetCached(cancellationToken);
        var balanceProperties = await posApiWalletService.TryAsync(s => s.GetBalanceAsync(cancellationToken, cached), log);

        return new
        {
            balanceProperties,
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
