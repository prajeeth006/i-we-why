using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.UI;

internal interface IProfilingConfiguration : IDisableableConfiguration { }

internal sealed class ProfilingConfiguration : IProfilingConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.Profiling";
    public bool IsEnabled { get; set; }
}
