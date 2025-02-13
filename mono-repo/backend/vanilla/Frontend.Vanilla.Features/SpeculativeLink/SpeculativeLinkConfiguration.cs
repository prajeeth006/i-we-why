using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.SpeculativeLink;

internal interface ISpeculativeLinkConfiguration : IDisableableConfiguration { }

internal sealed class SpeculativeLinkConfiguration : ISpeculativeLinkConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.SpeculativeLink";
    public bool IsEnabled { get; set; }
}
