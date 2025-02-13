using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Configuration;

/// <summary>
/// Describes all info regarding config provided by a developer.
/// </summary>
internal interface IConfigurationInfo
{
    TrimmedRequiredString FeatureName { get; }
    Type ServiceType { get; }
    Type ImplementationType { get; }
    IReadOnlyList<IConfigurationImplementationParameter>? ImplementationParameters { get; }
    Type FactoryType { get; }
    WithWarnings<object> CreateUsingFactory(object dto);
}

internal sealed class ConfigurationInfo : IConfigurationInfo
{
    public TrimmedRequiredString FeatureName { get; }
    public Type ServiceType { get; }
    public Type ImplementationType { get; }
    public IReadOnlyList<IConfigurationImplementationParameter>? ImplementationParameters { get; }
    public Type FactoryType { get; }
    private readonly Func<object, WithWarnings<object>> factoryFunc;

    public ConfigurationInfo(
        TrimmedRequiredString featureName,
        Type serviceType,
        Type implementationType,
        Type factoryType,
        Func<object, WithWarnings<object>> factoryFunc)
    {
        FeatureName = featureName;
        ServiceType = Guard.Interface(serviceType, nameof(serviceType));
        ImplementationType = Guard.FinalClass(implementationType, nameof(implementationType));
        ImplementationParameters = ConfigurationImplementationParameter.GetAll(implementationType);
        FactoryType = factoryType;
        this.factoryFunc = factoryFunc;

        var setter = serviceType.GetProperties().Where(p => p.SetMethod != null).FirstOrDefault();

        if (setter != null)
        {
            var message = "Configuration interface can't declare property setters because values come from DynaCon, can't by changed by the app itself"
                          + $" but {serviceType}  of '{featureName}' has: {setter}.";

            throw new ArgumentException(message, nameof(serviceType));
        }
    }

    public WithWarnings<object> CreateUsingFactory(object dto)
    {
        var result = factoryFunc(dto);

        return result?.Value != null
            ? result
            : throw new Exception($"Null returned by factory {FactoryType} when creating {ToString()}.");
    }

    public override string ToString()
        => $"({ServiceType}; DynaCon: {FeatureName})";
}
