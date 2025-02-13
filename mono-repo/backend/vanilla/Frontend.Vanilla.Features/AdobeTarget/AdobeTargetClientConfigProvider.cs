using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.AdobeTarget;

internal sealed class AdobeTargetClientConfigProvider(IAdobeTargetConfiguration config) : LambdaClientConfigProvider("vnAdobeTarget",
    () => new
    {
        config.Token,
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
