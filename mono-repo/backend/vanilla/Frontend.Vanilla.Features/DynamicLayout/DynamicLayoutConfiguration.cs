using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.DynamicLayout;

internal interface IDynamicLayoutConfiguration
{
    IDictionary<string, SlotConfiguration> Slots { get; }
    IDictionary<string, IDictionary<string, string>> SlotStyle { get; }
}

internal sealed class DynamicLayoutConfiguration(IDictionary<string, SlotConfiguration> slots, IDictionary<string, IDictionary<string, string>> slotStyle)
    : IDynamicLayoutConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.DynamicLayout";

    [Required, RequiredKeys, RequiredValues]
    [UniqueKeys(StringComparison.OrdinalIgnoreCase)]
    public IDictionary<string, SlotConfiguration> Slots { get; } = slots;

    [Required, RequiredKeys, RequiredValues]
    [UniqueKeys(StringComparison.OrdinalIgnoreCase)]
    public IDictionary<string, IDictionary<string, string>> SlotStyle { get; } = slotStyle;
}
