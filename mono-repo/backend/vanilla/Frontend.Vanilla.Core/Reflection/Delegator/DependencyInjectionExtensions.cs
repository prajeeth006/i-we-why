using System;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Core.Reflection.Delegator;

internal static class DependencyInjectionExtensions
{
    public static void AddDelegatedProxy<TService>(this IServiceCollection services, Func<IServiceProvider, ProxyDelegator<TService>> getDelegator)
        where TService : class
        => services.AddDelegatedProxy(typeof(TService), getDelegator);

    public static void AddDelegatedProxy(this IServiceCollection services, Type serviceType, Func<IServiceProvider, IProxyDelegator> getDelegator)
    {
        var getProxyType = RoslynProxy.EnqueueClassGeneration(new DelegatorProxyBuilder(serviceType));
        services.AddSingleton(serviceType, p =>
        {
            var delegator = getDelegator(p);

            return Activator.CreateInstance(getProxyType(), delegator)!;
        });
    }
}
