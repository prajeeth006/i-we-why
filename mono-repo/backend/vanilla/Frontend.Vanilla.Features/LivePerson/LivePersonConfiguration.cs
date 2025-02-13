using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.LivePerson;

internal interface ILivePersonConfiguration
{
    IDslExpression<bool> Enabled { get; }
    IDslExpression<bool> ShowInvite { get; }
    string AccountId { get; }
    IDictionary<string, ConditionalEvents> ConditionalEvents { get; }
}

internal sealed class LivePersonConfiguration(
    IDslExpression<bool> enabled,
    IDslExpression<bool> showInvite,
    string accountId,
    IDictionary<string, ConditionalEvents> conditionalEvents)
    : ILivePersonConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.LivePerson";

    public IDslExpression<bool> Enabled { get; set; } = enabled;
    public IDslExpression<bool> ShowInvite { get; set; } = showInvite;
    public string AccountId { get; set; } = accountId;
    public IDictionary<string, ConditionalEvents> ConditionalEvents { get; } = conditionalEvents;
}

internal sealed class ConditionalEvents(string urlRegex, TimeSpan timeout)
{
    public string UrlRegex { get; } = urlRegex;

    [MinimumTimeSpan("00:00:01")]
    public TimeSpan Timeout { get; } = timeout;
}
