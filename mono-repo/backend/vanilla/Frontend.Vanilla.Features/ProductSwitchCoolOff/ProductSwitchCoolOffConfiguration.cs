using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.ProductSwitchCoolOff;

internal interface IProductSwitchCoolOffConfiguration : IDisableableConfiguration { }

internal class ProductSwitchCoolOffConfiguration : IProductSwitchCoolOffConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.ProductSwitchCoolOff";
    public bool IsEnabled { get; set; }
}
