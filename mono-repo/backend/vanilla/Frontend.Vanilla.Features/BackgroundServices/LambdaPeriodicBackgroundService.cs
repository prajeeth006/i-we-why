using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.BackgroundServices;

internal class LambdaPeriodicBackgroundService(TimeSpan period, Func<CancellationToken, Task> func, ILogger logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation($"Starting {nameof(LambdaPeriodicBackgroundService)}.{nameof(ExecuteAsync)}.");

        using PeriodicTimer timer = new (period);

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await func(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"{nameof(LambdaPeriodicBackgroundService)}.{nameof(ExecuteAsync)} failed.");
            }
        }
    }
}
