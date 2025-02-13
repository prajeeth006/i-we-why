using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.DomainSpecificLanguage;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// Builder of service clients configuration.
/// </summary>
public sealed class ServiceClientsConfigurationBuilder : IConfigurationBuilder<IServiceClientsConfiguration>
{
    internal const string FeatureName = "VanillaFramework.Services.ServiceClients";

    /// <summary>
    /// Gets or sets the PosAPI service host.
    /// Default: https://api.bwin.com/.
    /// </summary>
    [Required, HttpHostUrl]
    public Uri Host { get; set; } = new Uri("https://api.bwin.com/");

    /// <summary>
    /// Gets or sets the version of the PosAPI Service to use.
    /// Default: V3.
    /// </summary>
    [Required]
    public string Version { get; set; } = "V3";

    /// <summary>
    /// Gets or sets the PosAPI Service access ID.
    /// </summary>
    [Required]
    public string AccessId { get; set; }

    /// <summary>
    /// Gets or sets the caching time for static data like languages, countries, currencies etc.
    /// Default: 1 hour.
    /// </summary>
    [MinimumTimeSpan("00:00:00")]
    public TimeSpan StaticDataCacheTime { get; set; } = TimeSpan.FromHours(1);

    /// <summary>
    /// Gets or sets the caching time for user data like balance, bets history etc.
    /// Default: 5 minutes.
    /// </summary>
    [MinimumTimeSpan("00:00:00")]
    public TimeSpan UserDataCacheTime { get; set; } = TimeSpan.FromMinutes(5.0);

    /// <summary>
    /// Time span that defines the expiration of PosApi health state coming from the PosApi health check
    /// or from operations that call PosApi. When this state expires the new PosApi health
    /// check request will be issued. The expiration timer is reset every time the health state is updated.
    /// Default: 15 seconds.
    /// </summary>
    [MinimumTimeSpan("00:00:00")]
    public TimeSpan HealthInfoExpiration { get; set; } = TimeSpan.FromSeconds(15);

    /// <summary>
    /// Gets or sets headers to append to PosAPI requests.
    /// </summary>
    [Required]
    public RestRequestHeaders Headers { get; set; } = new RestRequestHeaders();

    /// <summary>
    /// Specifies timeout for PosAPI calls. Multiple rules can be specified with regular expressions evaluated against the request URL and the first one that matches will be used.
    /// </summary>
    [Required, RequiredItems]
    public IList<ServiceClientTimeoutRule> TimeoutRules { get; set; } = new List<ServiceClientTimeoutRule>();

    /// <summary>
    /// Specifies additional query parameters for PosAPI calls. Multiple rules can be specified with regular expressions evaluated against the request URL and the first one that matches will be used.
    /// </summary>
    [Required]
    public IReadOnlyDictionary<string, IReadOnlyDictionary<string, ServiceClientQueryParametersRule>>
        QueryParametersRules { get; set; } =
        new Dictionary<string, IReadOnlyDictionary<string, ServiceClientQueryParametersRule>>();

    /// <summary>
    /// Specifies whether the Api cache usage statistics are logged or not.
    /// </summary>
    public bool IsApiCacheUsageStatsLoggingEnabled { get; set; }

    /// <summary>
    /// Gets or sets the PosAPI endpoint.
    /// </summary>
    public IDictionary<string, EndpointConfig> EndpointsV2 { get; set; } = new Dictionary<string, EndpointConfig>();

    /// <summary>
    /// Gets or sets the cache time by endpoints.
    /// </summary>
    public IReadOnlyDictionary<string, TimeSpan> CacheTimeEndpoints { get; set; } = new Dictionary<string, TimeSpan>();

    IServiceClientsConfiguration IConfigurationBuilder<IServiceClientsConfiguration>.Build() =>
        new ServiceClientsConfiguration(this);

    internal IServiceClientsConfiguration Build() => new ServiceClientsConfiguration(this);
}

/// <summary>
/// Service clients query parameters rule.
/// </summary>
public sealed class ServiceClientQueryParametersRule
{
    /// <summary>
    /// DSL enabled value.
    /// </summary>
    public IDslExpression<bool> Enabled { get; set; }

    /// <summary>
    /// Parameters.
    /// </summary>
    public IReadOnlyDictionary<string, string> Parameters { get; set; }
}

/// <summary>
/// Service clients timeout rule.
/// </summary>
public sealed class ServiceClientTimeoutRule
{
    /// <summary>
    /// The pattern to match to the request URL.
    /// </summary>
    public Regex UrlRegex { get; }

    /// <summary>
    /// The timeout to be used.
    /// </summary>
    public TimeSpan Timeout { get; }

    /// <summary>
    /// Optional array of methods to be matched (default is to all methods).
    /// </summary>
    public IReadOnlyCollection<HttpMethod> Methods { get; }

    /// <summary>
    /// Creates a new instance.
    /// </summary>
    public ServiceClientTimeoutRule([NotNull, RegexPattern] string urlRegex, TimeSpan timeout, IEnumerable<HttpMethod> methods = null)
    {
        UrlRegex = new Regex(Guard.NotWhiteSpace(urlRegex, nameof(urlRegex)),
            RegexOptions.IgnoreCase | RegexOptions.Compiled);
        Timeout = Guard.Greater(timeout, TimeSpan.Zero, nameof(timeout));
        Methods = Guard.NotNullItems(methods.NullToEmpty().ToHashSet().AsReadOnly(), nameof(methods));
    }
}

/// <summary>
/// Service clients endpoint config.
/// </summary>
public sealed class EndpointConfig
{
    /// <summary>
    /// Overrides global default PPOS version.
    /// </summary>
    public string Version { get; set; }

    /// <summary>
    /// Disables call to PPOS if true.
    /// </summary>
    public bool Disabled { get; set; }

    /// <summary>
    /// Default values for disabled endpoint.
    /// </summary>
    [CanBeNull]
    public object DefaultValue { get; set; }
}
