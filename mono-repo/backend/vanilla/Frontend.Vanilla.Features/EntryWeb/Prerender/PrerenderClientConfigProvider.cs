using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.EntryWeb.Prerender;

internal sealed class PrerenderClientConfigProvider(IPrerenderConfiguration config) : LambdaClientConfigProvider("vnPrerender", () => new
{
    config.MaxWaitingTime,
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
