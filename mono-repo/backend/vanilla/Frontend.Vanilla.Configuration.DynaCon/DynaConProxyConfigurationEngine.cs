using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Reflection.Delegator;
using Frontend.Vanilla.Core.Reflection.Proxy;

namespace Frontend.Vanilla.Configuration.DynaCon;

/// <summary>
/// Creates proxy for configuration model which gets injected.
/// </summary>
internal sealed class DynaConProxyConfigurationEngine : IConfigurationEngine
{
    private readonly ICurrentConfigurationResolver configResolver;
    private readonly IReadOnlyList<Type> configTypes;

    public DynaConProxyConfigurationEngine(ICurrentConfigurationResolver configResolver, IEnumerable<IConfigurationInfo> configInfos)
    {
        this.configResolver = configResolver;
        configTypes = RoslynProxy.GenerateClasses(configInfos.Select(c => new DelegatorProxyBuilder(c.ServiceType)));
    }

    public object CreateConfiguration(IConfigurationInfo configInfo)
    {
        IProxyDelegator delegator = new LambdaProxyDelegator(_ => configResolver.Resolve(configInfo.FeatureName));
        if (typeof(IDisableableConfiguration).IsAssignableFrom(configInfo.ServiceType))
            delegator = new DisableableProxyDelegator(delegator);

        var configType = configTypes.Single(configInfo.ServiceType.IsAssignableFrom);

        return Activator.CreateInstance(configType, delegator)!;
    }
}
