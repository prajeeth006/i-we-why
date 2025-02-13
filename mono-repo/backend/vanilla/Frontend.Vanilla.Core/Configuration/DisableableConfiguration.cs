using System;
using Frontend.Vanilla.Core.Reflection.Delegator;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Configuration;

/// <summary>
/// Marks the configuration which can be disabled.
/// </summary>
public interface IDisableableConfiguration
{
    /// <summary>
    /// Indicates if the configuration is enabled.
    /// If disabled, it doesn't get validated by configuration system.
    /// </summary>
    bool IsEnabled { get; }
}

/// <summary>
/// Guard for correct behavior regarding <see cref="IDisableableConfiguration" />.
/// </summary>
public interface IDisableableGuard
{
    /// <summary>
    /// Decorates the configuration implementing <see cref="IDisableableConfiguration" /> with a logic to allow access only if the configuration is enabled.
    /// </summary>
    object Decorate(Type configInterface, object configuration);
}

internal sealed class DisableableGuard : IDisableableGuard
{
    public object Decorate(Type configInterface, object config)
    {
        Guard.Interface(configInterface, nameof(configInterface));
        Guard.AssignableTo<IDisableableConfiguration>(configInterface, nameof(configInterface));

        var getProxyType = RoslynProxy.EnqueueClassGeneration(new DelegatorProxyBuilder(configInterface));
        var delegator = new DisableableProxyDelegator(new LambdaProxyDelegator(_ => config));

        return Activator.CreateInstance(getProxyType(), delegator)!;
    }
}

internal sealed class DisableableProxyDelegator(IProxyDelegator inner) : IProxyDelegator
{
    public object ResolveTarget(string methodName)
    {
        var config = inner.ResolveTarget(methodName);

        const string isEnabledProperty = nameof(IDisableableConfiguration.IsEnabled);

        if (methodName != "get_" + isEnabledProperty && !((IDisableableConfiguration)config).IsEnabled)
            throw new InvalidOperationException($"{config.GetType()} has {isEnabledProperty} = false therefore you can't call '{methodName}'"
                                                + $" nor access its other members. Check {isEnabledProperty} first and if disabled then don't execute the feature.");

        return config;
    }
}
