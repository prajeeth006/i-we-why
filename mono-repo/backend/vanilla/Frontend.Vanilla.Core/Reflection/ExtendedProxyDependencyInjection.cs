using System;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection.Delegator;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Core.Reflection;

internal static class ExtendedProxyDependencyInjection
{
    public static void AddExtendedSingleton<TTarget, TSource>(this IServiceCollection services, Func<IServiceProvider, TSource> getSource)
        where TSource : class
        where TTarget : class, TSource
    {
        Guard.Interface(typeof(TSource), nameof(TSource));
        Guard.Interface(typeof(TTarget), nameof(TTarget));

        var additionalMembers = typeof(TTarget).GetMembers();

        if (additionalMembers.Length > 0)
            throw new ArgumentException($"There can't by any members added by {typeof(TTarget)} compared to {typeof(TSource)}"
                                        + $" because proxy doesn't know how to implement them but there are: {additionalMembers.Join()}");

        var getProxyType = RoslynProxy.EnqueueClassGeneration(new DelegatorProxyBuilder(interfaceToProxy: typeof(TTarget), delegatedType: typeof(TSource)));
        services.AddSingleton(provider =>
        {
            var source = getSource(provider);
            var delegator = new LambdaProxyDelegator(_ => source);

            return (TTarget)Activator.CreateInstance(getProxyType(), delegator)!;
        });
    }
}
