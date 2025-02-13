using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

internal sealed class ShopCountryDynaConProvider(IShopDslProvider shopDslProvider) : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "ShopCountry";
    public TrimmedRequiredString DefaultValue { get; } = "unknown";

    public string GetCurrentRawValue()
    {
        var shopCountry = ExecutionMode.ExecuteSync(shopDslProvider.GetCountryAsync, false);

        return string.IsNullOrEmpty(shopCountry) ? DefaultValue : shopCountry;
    }
}
