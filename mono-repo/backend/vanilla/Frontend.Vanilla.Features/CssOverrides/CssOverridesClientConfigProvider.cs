using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.CssOverrides;

internal sealed class CssOverridesClientConfigProvider(ICssOverridesProvider cssOverridesProvider) : LambdaClientConfigProvider("vnCssOverrides", () => new
{
    items = cssOverridesProvider.Get(),
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
