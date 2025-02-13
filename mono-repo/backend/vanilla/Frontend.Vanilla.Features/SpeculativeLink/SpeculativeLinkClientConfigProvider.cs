using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.SpeculativeLink;

internal sealed class SpeculativeLinkClientConfigProvider(
    ISpeculativeLinkConfiguration speculativeLinkConfiguration)
    : LambdaClientConfigProvider("vnSpeculativeLink", () => new
    {
        speculativeLinkConfiguration.IsEnabled,
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
