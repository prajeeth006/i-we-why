using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.RtmsConnection;

/// <summary>
/// Configures connection to Real-Time Messaging System.
/// </summary>
internal interface IRtmsConfiguration : IDisableableConfiguration
{
    Uri? Host { get; }
    TimeSpan KeepAliveInterval { get; }
    TimeSpan ReconnectInterval { get; }
    IDslExpression<bool> TracingEnabledCondition { get; }
    Regex TracingBlacklistPattern { get; }
    IReadOnlyDictionary<string, DisabledEvents> DisabledEvents { get; }
    IReadOnlyList<string> RemoteLogLevels { get; }
    IReadOnlyList<string> BackgroundEvents { get; }
    bool EstablishConnectionOnlyInLoginState { get; }
    TimeSpan ConnectionDelay { get; }
}

internal sealed class RtmsConfiguration : IRtmsConfiguration, IValidatableObject
{
    public const string FeatureName = "VanillaFramework.Features.Rtms";

    public RtmsConfiguration(
        bool isEnabled,
        Uri? host,
        TimeSpan keepAliveInterval,
        TimeSpan reconnectInterval,
        IDslExpression<bool> tracingEnabledCondition,
        Regex tracingBlacklistPattern,
        IReadOnlyDictionary<string, DisabledEvents> disabledEvents,
        IReadOnlyList<string> remoteLogLevels,
        IReadOnlyList<string> backgroundEvents,
        bool establishConnectionOnlyInLoginState,
        TimeSpan connectionDelay)
    {
        IsEnabled = isEnabled;
        Host = host;
        KeepAliveInterval = keepAliveInterval;
        ReconnectInterval = reconnectInterval;
        TracingEnabledCondition = tracingEnabledCondition;
        TracingBlacklistPattern = tracingBlacklistPattern;
        DisabledEvents = disabledEvents;
        RemoteLogLevels = remoteLogLevels;
        BackgroundEvents = backgroundEvents;
        EstablishConnectionOnlyInLoginState = establishConnectionOnlyInLoginState;
        ConnectionDelay = connectionDelay;
    }

    public bool IsEnabled { get; }

    [Required, HttpHostUrl]
    public Uri? Host { get; set; }

    [MinimumTimeSpan("00:00:00")]
    public TimeSpan KeepAliveInterval { get; set; }

    public TimeSpan ReconnectInterval { get; set; }
    public IDslExpression<bool> TracingEnabledCondition { get; set; }
    public Regex TracingBlacklistPattern { get; set; }
    public IReadOnlyDictionary<string, DisabledEvents> DisabledEvents { get; set; }
    public IReadOnlyList<string> RemoteLogLevels { get; set; }
    public IReadOnlyList<string> BackgroundEvents { get; set; }
    public bool EstablishConnectionOnlyInLoginState { get; set; }
    public TimeSpan ConnectionDelay { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (ReconnectInterval <= KeepAliveInterval + KeepAliveInterval)
            yield return new ValidationResult(
                $"ReconnectInterval='{ReconnectInterval}' must be greater than 2 times KeepAliveInterval='{KeepAliveInterval}'.",
                new[] { nameof(ReconnectInterval) });
    }
}

internal sealed class DisabledEvents
{
    public DisabledEvents(IDslExpression<bool> disabled)
    {
        Disabled = disabled;
    }

    public IDslExpression<bool> Disabled { get; set; }
}
