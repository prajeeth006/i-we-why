using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.DepositLimits;

internal interface IDepositLimitsConfiguration
{
    bool EnableDepositLimitExceededOverlay { get; }
    IReadOnlyDictionary<string, IReadOnlyDictionary<string, decimal>> LowThresholds { get; }
}

internal sealed class DepositLimitsConfiguration : IDepositLimitsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.DepositLimits";

    public bool EnableDepositLimitExceededOverlay { get; set; } = false;

    [Required, RequiredKeys, UniqueKeys(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyDictionary<string, IReadOnlyDictionary<string, decimal>> LowThresholds { get; set; } = new Dictionary<string, IReadOnlyDictionary<string, decimal>>();
}
