#nullable disable

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Validation.Annotations;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Features.EntryWeb.Prerender;

/// <summary>
/// Configuration for prerendering web pages for crawlers using Prerender.io service.
/// </summary>
internal interface IPrerenderConfiguration
{
    bool Enabled { get; }
    Uri ServiceUrl { get; }

    [CanBeNull]
    string Token { get; }

    TimeSpan RequestTimeout { get; }

    TimeSpan? HealthCheckTimeout { get; }
    HealthCheckSeverity? HealthCheckSeverity { get; }
    Regex ExcludedPagePathAndQueryRegex { get; }
    bool ReadyEnabled { get; }
    int MaxWaitingTime { get; }
    string CacheControlResponseHeader { get; }
}

internal sealed class PrerenderConfiguration : IPrerenderConfiguration, IValidatableObject
{
    public const string FeatureName = "VanillaFramework.Features.Seo.Prerender";

    public bool Enabled { get; set; }

    [Required]
    public Uri ServiceUrl { get; set; }

    public string Token { get; set; }

    [MinimumTimeSpan("00:00:00.1")]
    public TimeSpan RequestTimeout { get; set; }

    public TimeSpan? HealthCheckTimeout { get; set; }
    public HealthCheckSeverity? HealthCheckSeverity { get; set; }

    [Required]
    public Regex ExcludedPagePathAndQueryRegex { get; set; }

    public bool ReadyEnabled { get; set; }

    [Required]
    public int MaxWaitingTime { get; set; }

    [Required]
    public string CacheControlResponseHeader { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (ServiceUrl.Host.EndsWith(".prerender.io", StringComparison.OrdinalIgnoreCase) && string.IsNullOrWhiteSpace(Token))
            yield return new ValidationResult("Token must be specified if ServiceUrl points to official Prerender.io service.", new[] { nameof(Token) });
    }
}
