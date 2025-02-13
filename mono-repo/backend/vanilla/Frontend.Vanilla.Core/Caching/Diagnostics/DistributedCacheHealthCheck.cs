using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;

namespace Frontend.Vanilla.Core.Caching.Diagnostics;

/// <summary>
/// Health check for IDistributedCache where we currently supported Redis and Hekaton.
/// </summary>
internal sealed class DistributedCacheHealthCheck : IHealthCheck
{
    private readonly ILabelIsolatedDistributedCache labelsIsolatedDistributedCache;
    private readonly object details;

    /// <summary>
    /// Health check for IDistributedCache where we currently supported Redis and Hekaton.
    /// </summary>
    public DistributedCacheHealthCheck(IConfiguration configuration, ILabelIsolatedDistributedCache labelsIsolatedDistributedCache)
    {
        this.labelsIsolatedDistributedCache = labelsIsolatedDistributedCache;
        details = new { ConnectionString = configuration.GetConnectionString(DistributedCacheExtensions.Current.ToString()) };
    }

    public bool IsEnabled => true;

    public HealthCheckMetadata Metadata { get; } = new (
        DistributedCacheHealthConstants.Name,
        DistributedCacheHealthConstants.Description,
        DistributedCacheHealthConstants.WhatToDoIfFailed,
        HealthCheckSeverity.Critical,
        documentationUri: new Uri("https://docs.vanilla.intranet/caching-infrastructure.html"));

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        var guid = Guid.NewGuid();
        var testKey = "HealthCheck:" + guid;
        var testValue = guid.ToByteArray();
        var mode = ExecutionMode.Async(cancellationToken);

        await labelsIsolatedDistributedCache.SetAsync(
            testKey,
            testValue,
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(10) },
            cancellationToken);

        var cachedValue = await labelsIsolatedDistributedCache.GetAsync(mode, testKey);

        return cachedValue?.SequenceEqual(testValue) == true
            ? HealthCheckResult.CreateSuccess(details)
            : HealthCheckResult.CreateFailed($"Returned cached item value {ToHex(cachedValue)} is not equal to original item's value {ToHex(testValue)}.", details);
    }

    private static string ToHex(IEnumerable<byte>? bytes)
        => "[" + bytes?.Select(b => $"0x{b:x2}").Join(" ") + "]";
}

internal static class DistributedCacheHealthConstants
{
    public static readonly string Name = $"Distributed Cache [{DistributedCacheExtensions.Current}]";
    public static readonly string Description = $"Checks the {DistributedCacheExtensions.Current} cache by putting an item with a new key. Succeeds if the item can then be retrieved successfully.";
    public static readonly string WhatToDoIfFailed = $"Check the connectivity and health of {DistributedCacheExtensions.Current} database. More info in Details.";
}
