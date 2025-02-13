using System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Configuration;

/// <summary>
/// Default configuration engine which resolves configs directly from dependency injection provider.
/// Of course if config registration is overwritten then there is no need for engine.
/// </summary>
internal sealed class DependencyInjectionConfigurationEngine(IServiceProvider services, IDisableableGuard disableableGuard) : IConfigurationEngine
{
    public object CreateConfiguration(IConfigurationInfo configInfo)
    {
        Guard.NotNull(configInfo, nameof(configInfo));

        var dto = services.GetService(configInfo.ImplementationType)
                  ?? throw new Exception(
                      $"There is no config registered with dependency injection as {configInfo.ServiceType} nor {configInfo.ImplementationType} therefore it can't be resolved.");

        var (config, _) = configInfo.CreateUsingFactory(dto);

        if (config is IDisableableConfiguration)
            config = disableableGuard.Decorate(configInfo.ServiceType, config);

        return config;
    }
}
