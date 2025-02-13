using System;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection.Delegator;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Reflection;

internal static class DynamicProxy
{
    public static TTarget ExtendTo<TSource, TTarget>(TSource obj)
        where TSource : class
        where TTarget : class, TSource
    {
        Guard.Interface(typeof(TSource), nameof(TSource));
        Guard.Interface(typeof(TTarget), nameof(TTarget));

        var additionalMembers = typeof(TTarget).GetMembers();

        if (additionalMembers.Length > 0)
            throw new ArgumentException(
                $"There can't by any members added by {typeof(TTarget)} compared to {typeof(TSource)}"
                + $" because proxy doesn't know how to implement them but there are: {additionalMembers.Join()}");

        var getProxyType = RoslynProxy.EnqueueClassGeneration(new DelegatorProxyBuilder(interfaceToProxy: typeof(TTarget), delegatedType: typeof(TSource)));

        return (TTarget)Activator.CreateInstance(getProxyType(), new LambdaProxyDelegator(_ => obj))!;
    }
}
