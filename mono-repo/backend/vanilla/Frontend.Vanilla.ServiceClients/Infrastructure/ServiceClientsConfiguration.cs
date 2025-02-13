using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>Exposes some generic service clients configuration consumed also by products to access backend services especially Sports Bet Content Distribution service.</summary>
public interface IServiceClientsBaseConfiguration
{
    /// <summary>
    /// Criticality: Security
    /// See <see cref="ServiceClientsConfigurationBuilder.AccessId" />.
    /// </summary>
    string AccessId { get; }

    /// <summary>
    /// Criticality: Technical
    /// See <see cref="ServiceClientsConfigurationBuilder.TimeoutRules" />.
    /// </summary>
    IReadOnlyList<ServiceClientTimeoutRule> TimeoutRules { get; }
}

internal interface IServiceClientsConfiguration : IServiceClientsBaseConfiguration
{
    HttpUri Host { get; }
    string Version { get; }
    TimeSpan StaticDataCacheTime { get; }
    TimeSpan UserDataCacheTime { get; }
    TimeSpan HealthInfoExpiration { get; }
    IReadOnlyDictionary<string, IReadOnlyList<string>> Headers { get; }
    IReadOnlyDictionary<string, IReadOnlyDictionary<string, ServiceClientQueryParametersRule>> QueryParametersRules { get; }
    bool IsApiCacheUsageStatsLoggingEnabled { get; }
    IDictionary<Regex, EndpointConfig> EndpointsV2 { get; }
    IReadOnlyDictionary<string, TimeSpan> CacheTimeEndpoints { get; }
}

internal sealed class ServiceClientsConfiguration : IServiceClientsConfiguration
{
    public HttpUri Host { get; }
    public string Version { get; }
    public string AccessId { get; }
    public TimeSpan StaticDataCacheTime { get; }
    public TimeSpan UserDataCacheTime { get; }
    public TimeSpan HealthInfoExpiration { get; }
    public IReadOnlyDictionary<string, IReadOnlyList<string>> Headers { get; }
    public IReadOnlyList<ServiceClientTimeoutRule> TimeoutRules { get; }
    public IReadOnlyDictionary<string, IReadOnlyDictionary<string, ServiceClientQueryParametersRule>> QueryParametersRules { get; }
    public bool IsApiCacheUsageStatsLoggingEnabled { get; }
    public IDictionary<Regex, EndpointConfig> EndpointsV2 { get; }
    public IReadOnlyDictionary<string, TimeSpan> CacheTimeEndpoints { get; }

    public ServiceClientsConfiguration(ServiceClientsConfigurationBuilder builder)
    {
        builder.Validate();

        Host = new HttpUri(builder.Host);
        Version = builder.Version;
        AccessId = builder.AccessId;
        StaticDataCacheTime = builder.StaticDataCacheTime;
        UserDataCacheTime = builder.UserDataCacheTime;
        HealthInfoExpiration = builder.HealthInfoExpiration;
        IsApiCacheUsageStatsLoggingEnabled = builder.IsApiCacheUsageStatsLoggingEnabled;

        // Copy to prevent changes of original objs, make read-only to prevent further changes
        Headers = builder.Headers
            .ToDictionary(h => h.Key, h => (IReadOnlyList<string>)h.Value.ToList().AsReadOnly(), StringComparer.OrdinalIgnoreCase).AsReadOnly();
        QueryParametersRules = builder.QueryParametersRules.ToDictionary();
        TimeoutRules = builder.TimeoutRules.ToArray().AsReadOnly();
        EndpointsV2 = builder.EndpointsV2.ToDictionary(h => new Regex(h.Key, RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled),
            h => h.Value);
        CacheTimeEndpoints = builder.CacheTimeEndpoints;
    }
}
