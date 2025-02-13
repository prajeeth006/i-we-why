using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.EntryWeb.TopLevelDomainCookies;

internal sealed class TopLevelCookiesClientConfigProvider(ITopLevelDomainCookiesConfiguration config) : LambdaClientConfigProvider("vnTopLevelCookies", () => new
{
    config.SetCookieDomain,
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
