using System;
using Frontend.Vanilla.Features.BackgroundServices;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.WebIntegration.Core.DynaconAppBoot;

internal sealed class DynaconAppBootRefresher(IDynaconAppBootRestClientService dynaconRestClientService, ILogger<DynaconAppBootRefresher> logger)
    : LambdaPeriodicBackgroundService(TimeSpan.FromHours(1),
        async ct =>
        {
            await dynaconRestClientService.ReloadAsync(ct);
        },
        logger)
{
}
