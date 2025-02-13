#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.Authentication;

/// <summary>
/// Configures authentication on web tier.
/// </summary>
internal interface IAuthenticationConfiguration
{
    TimeSpan Timeout { get; }
    IReadOnlyList<string> EligibleLoginNameClaimTypes { get; }
    IReadOnlyList<string> SingleSignOnDomains { get; }
    bool IsAntiForgeryValidationEnabled { get; }
    IReadOnlyDictionary<string, string> ClientPlatformToChannel { get; }
    AutoLoginQueryKeysConfiguration AutoLoginQueryParameters { get; }
    IReadOnlyList<string> SingleSignOnLabels { get; }
    TimeSpan AnonymousClaimCacheTime { get; }
}

internal sealed class AuthenticationConfiguration : IAuthenticationConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.Authentication";

    [MinimumTimeSpan("00:00:01")]
    public TimeSpan Timeout { get; set; }

    [Required, NotEmptyCollection, UniqueItems]
    public IReadOnlyList<string> EligibleLoginNameClaimTypes { get; set; }

    [Required, UniqueItems]
    public IReadOnlyList<string> SingleSignOnDomains { get; set; }

    public bool IsAntiForgeryValidationEnabled { get; set; }

    private IReadOnlyDictionary<string, string> clientPlatformToChannel;

    [Required]
    public IReadOnlyDictionary<string, string> ClientPlatformToChannel
    {
        get => clientPlatformToChannel;
        set => clientPlatformToChannel = value?.ToDictionary(StringComparer.OrdinalIgnoreCase);
    }

    [Required]
    public AutoLoginQueryKeysConfiguration AutoLoginQueryParameters { get; set; }

    [Required, UniqueItems]
    public IReadOnlyList<string> SingleSignOnLabels { get; set; }

    [MinimumTimeSpan("00:05:00")]
    public TimeSpan AnonymousClaimCacheTime { get; set; }
}

internal sealed class AutoLoginQueryKeysConfiguration(string username, string password)
{
    public TrimmedRequiredString Username { get; } = Guard.TrimmedRequired(username, nameof(username));
    public TrimmedRequiredString Password { get; } = Guard.TrimmedRequired(password, nameof(password));
}
