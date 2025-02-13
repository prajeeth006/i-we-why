using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.WebIntegration.Core;

/// <summary>
/// Determines environment name of the website.
/// </summary>
internal interface IEnvironmentNameProvider
{
    TrimmedRequiredString EnvironmentName { get; }
    bool IsProduction { get; }
}

internal class EnvironmentNameProviderBase(TrimmedRequiredString environmentName) : IEnvironmentNameProvider
{
    public TrimmedRequiredString EnvironmentName { get; } = environmentName;
    public bool IsProduction { get; } = environmentName.EqualsIgnoreCase("prod");
}
