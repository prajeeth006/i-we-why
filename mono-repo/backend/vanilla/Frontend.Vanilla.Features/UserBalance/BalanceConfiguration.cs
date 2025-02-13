using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.UserBalance;

/// <summary>
/// DON'T REMOVE PROPERTIES. This is serialised to client by <see cref="BalanceSettingsConfigProvider" />.
/// </summary>
internal interface IBalanceConfiguration
{
    IReadOnlyDictionary<string, decimal> LowThresholds { get; }
}

internal sealed class BalanceConfiguration : IBalanceConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Balance";

    [Required, RequiredKeys, UniqueKeys(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyDictionary<string, decimal> LowThresholds { get; set; } = new Dictionary<string, decimal>();
}
