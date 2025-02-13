using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.DynaConVariationContext;

internal static class DynaConServices
{
    public static void AddDynaConVariationContextProvidersFeature(this IServiceCollection services)
    {
        Add<UserDynaConProvider>();
        Add<JurisdictionDynaConProvider>();
        Add<CountryDynaConProvider>();
        Add<CultureDynaConProvider>();
        Add<DeviceTypeDynaConProvider>();
        Add<NativeAppDynaConProvider>();
        Add<OperatingSystemDynaConProvider>();
        Add<AppContextDynaConProvider>();
        Add<HeaderProductDynaconProvider>();
        Add<UserAgentDynaConProvider>();
        Add<ShopCountryDynaConProvider>();
        Add<RequestDynaConProvider>();

        void Add<TProvider>()
            where TProvider : class, IWebDynaConVariationContextProvider
            => services.AddSingleton<IDynaConVariationContextProvider>(p => p.Create<DynaConVariationContextProviderAdapter>(p.Create<TProvider>()));
    }
}
