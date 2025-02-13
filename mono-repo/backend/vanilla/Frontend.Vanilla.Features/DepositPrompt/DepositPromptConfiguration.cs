using System;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.DepositPrompt;

internal interface IDepositPromptConfiguration : IDisableableConfiguration
{
    [Required]
    IDslExpression<bool> Condition { get; }

    [Required]
    TimeSpan RepeatTime { get; }

    [Required]
    string Trigger { get; }
}

internal sealed class DepositPromptConfiguration(bool isEnabled, IDslExpression<bool> condition, TimeSpan repeatTime, string trigger)
    : IDepositPromptConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.DepositPrompt";

    public bool IsEnabled { get; } = isEnabled;
    public IDslExpression<bool> Condition { get; set; } = condition;
    public TimeSpan RepeatTime { get; set; } = repeatTime;
    public string Trigger { get; set; } = trigger;
}
