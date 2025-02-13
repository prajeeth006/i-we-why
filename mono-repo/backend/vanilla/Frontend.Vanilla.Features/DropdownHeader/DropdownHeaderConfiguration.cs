using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.DropdownHeader;

internal interface IDropdownHeaderConfiguration : IDisableableConfiguration { }

internal sealed class DropdownHeaderConfiguration : IDropdownHeaderConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.DropdownHeader";

    public bool IsEnabled { get; set; }
}
