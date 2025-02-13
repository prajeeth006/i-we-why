using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.RememberMe;

internal interface IRememberMeConfiguration
{
    bool IsEnabled { get; }
    HttpUri? ApiHost { get; }
    TimeSpan Expiration { get; }
    IEnumerable<string> SkipRetryPaths { get; }
}

internal sealed class RememberMeConfiguration : IRememberMeConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.RememberMe";

    public bool IsEnabled { get; set; }

    [Required]
    public HttpUri? ApiHost { get; set; }

    [MinimumTimeSpan("00:00:01")]
    public TimeSpan Expiration { get; set; }

    public IEnumerable<string> SkipRetryPaths { get; set; } = [];
}
