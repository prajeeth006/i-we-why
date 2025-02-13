using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.LaunchDarkly;

internal sealed class LaunchDarklyClientConfigProvider(ILaunchDarklyConfiguration launchDarklyConfiguration) : LambdaClientConfigProvider("vnLaunchDarkly",
    () => new
    {
        clientId = launchDarklyConfiguration.ClientId,
        options = launchDarklyConfiguration.ClientConfigurationOptions,
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
