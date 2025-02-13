using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Core.Reflection.Facade;

internal static class DependencyInjectionExtensions
{
    public static void AddFacadeFor<TFacadeInterface>(this IServiceCollection services)
        where TFacadeInterface : class
    {
        var getProxyType = RoslynProxy.EnqueueClassGeneration(new FacadeProxyBuilder(typeof(TFacadeInterface)));
        services.AddSingleton(typeof(TFacadeInterface), p => p.Create(getProxyType()));
    }
}
