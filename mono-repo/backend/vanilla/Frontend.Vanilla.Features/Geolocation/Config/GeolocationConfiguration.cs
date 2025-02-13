using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.Geolocation.Config;

internal interface IGeolocationConfiguration : IDisableableConfiguration
{
    IReadOnlyDictionary<string, object> WatchOptions { get; }
    TimeSpan CookieExpiration { get; }
    TimeSpan MinimumUpdateInterval { get; }
    bool UseBrowserGeolocation { get; }
    bool WatchBrowserPositionOnAppStart { get; }
    string? ClientApiUrl { get; }
}

internal sealed class GeolocationConfiguration : IGeolocationConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.Geolocation";

    public bool IsEnabled { get; set; }

    [Required, RequiredKeys]
    public IReadOnlyDictionary<string, object> WatchOptions { get; set; } = new Dictionary<string, object>();

    [MinimumTimeSpan("00:00:00")]
    public TimeSpan CookieExpiration { get; set; }

    [MinimumTimeSpan("00:00:00")]
    public TimeSpan MinimumUpdateInterval { get; set; }

    public bool UseBrowserGeolocation { get; set; }
    public bool WatchBrowserPositionOnAppStart { get; set; }

    public string? ClientApiUrl { get; set; }
}
