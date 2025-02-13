using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.TrackerId;

internal interface ITrackerIdConfiguration
{
    IReadOnlyList<string> QueryStrings { get; }
    bool BtagCallEnabled { get; }
    bool UseOnlyWmId { get; }
}

internal sealed class TrackerIdConfiguration : ITrackerIdConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.TrackerId";

    [Required, RequiredItems, UniqueItems(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyList<string> QueryStrings { get; set; } = new List<string>();

    public bool BtagCallEnabled { get; set; }

    public bool UseOnlyWmId { get; set; }
}
