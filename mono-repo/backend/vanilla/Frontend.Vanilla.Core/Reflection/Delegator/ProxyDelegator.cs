using System;

namespace Frontend.Vanilla.Core.Reflection.Delegator;

/// <summary>
/// Resolves target object to which the proxy should delegate execution in the runtime.
/// </summary>
internal interface IProxyDelegator
{
    object ResolveTarget(string methodName);
}

internal abstract class ProxyDelegator<TService> : IProxyDelegator
    where TService : class
{
    public abstract TService ResolveTarget(string methodName);

    object IProxyDelegator.ResolveTarget(string methodName)
        => ResolveTarget(methodName);
}

internal class LambdaProxyDelegator<TService>(Func<string, TService> resolveTarget) : ProxyDelegator<TService>
    where TService : class
{
    public override TService ResolveTarget(string methodName)
        => resolveTarget(methodName);
}

internal class LambdaProxyDelegator(Func<string, object> resolveTarget) : LambdaProxyDelegator<object>(resolveTarget) { }
