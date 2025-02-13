using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Caching.Distributed;

namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>
/// Stores number of failed operation in distributed cache
/// and based on it determines success for particular context.
/// </summary>
internal interface IFailureCounter
{
    Task<bool> HasFailedAsync(TrimmedRequiredString area, CancellationToken cancellationToken);
    Task ReportSucessAsync(TrimmedRequiredString area, CancellationToken cancellationToken);
    Task ReportFailureAsync(TrimmedRequiredString area, CancellationToken cancellationToken);
    Task ClearAsync(TrimmedRequiredString area, CancellationToken cancellationToken); // Used in TestWeb
}

internal sealed class FailureCounter(IReCaptchaConfiguration config, IClientIPResolver clientIpResolver, ILabelIsolatedDistributedCache distributedCache)
    : IFailureCounter
{
    public async Task<bool> HasFailedAsync(TrimmedRequiredString area, CancellationToken cancellationToken)
    {
        Guard.NotNull(area, nameof(area));

        var key = GetKey(area);
        var str = await distributedCache.GetStringAsync(key, cancellationToken);

        return str != null && int.Parse(str) >= config.FailureCount;
    }

    // TODO: Fix typo
    public Task ReportSucessAsync(TrimmedRequiredString area, CancellationToken cancellationToken)
        => Task.CompletedTask; // For now we don't clear counter on success

    public async Task ReportFailureAsync(TrimmedRequiredString area, CancellationToken cancellationToken)
    {
        Guard.NotNull(area, nameof(area));

        var key = GetKey(area);
        var str = await distributedCache.GetStringAsync(key, cancellationToken);

        var count = str != null ? int.Parse(str) : 0;
        count++;

        var cacheOpts = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = config.FailureCountExpiration };
        await distributedCache.SetStringAsync(key, count.ToString(), cacheOpts, cancellationToken);
    }

    public Task ClearAsync(TrimmedRequiredString area, CancellationToken cancellationToken)
    {
        Guard.NotNull(area, nameof(area));

        var key = GetKey(area);

        return distributedCache.RemoveAsync(key, cancellationToken);
    }

    private string GetKey(string area)
        => $"Van:ReCaptcha:{area.ToLowerInvariant()}:{clientIpResolver.Resolve()}";
}
