using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.Cors;

internal interface ICorsConfiguration
{
    TimeSpan? PreflightMaxAge { get; }
    IReadOnlyDictionary<string, string[]> OriginAllowedHosts { get; }
    IReadOnlyDictionary<string, string> OriginAllowedWildcardSubdomains { get; }
}

internal class CorsConfiguration : ICorsConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.Cors";

    public TimeSpan? PreflightMaxAge { get; set; }

    [Required, RequiredKeys, RequiredValues]
    [UniqueKeys(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyDictionary<string, string[]> OriginAllowedHosts { get; set; } =
        new Dictionary<string, string[]>();

    [Required, RequiredKeys, RequiredValues]
    [UniqueKeys(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyDictionary<string, string> OriginAllowedWildcardSubdomains { get; set; } =
        new Dictionary<string, string>();
}
