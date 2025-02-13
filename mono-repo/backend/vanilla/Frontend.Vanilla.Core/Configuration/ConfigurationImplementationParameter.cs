using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Configuration;

/// <summary>
/// Info regarding parameters needed for create an instance of configuration implementation class.
/// </summary>
internal interface IConfigurationImplementationParameter
{
    TrimmedRequiredString Name { get; }
    Type Type { get; }
    ConfigurationParameterSource Source { get; }
}

internal enum ConfigurationParameterSource
{
    Constructor,
    Property,
}

internal sealed class ConfigurationImplementationParameter : IConfigurationImplementationParameter
{
    public TrimmedRequiredString Name { get; }
    public Type Type { get; }
    public ConfigurationParameterSource Source { get; }

    private ConfigurationImplementationParameter(TrimmedRequiredString name, Type type, ConfigurationParameterSource source)
    {
        Name = name;
        Type = type;
        Source = Guard.DefinedEnum(source, nameof(source));
    }

    public static IReadOnlyList<IConfigurationImplementationParameter>? GetAll(Type type)
    {
        Guard.FinalClass(type, nameof(type));

        return (HasWildcardProperties(type) ? null : GetAllInternal(type))?.ToArray().AsReadOnly();
    }

    private static IEnumerable<IConfigurationImplementationParameter> GetAllInternal(Type type)
    {
        var ctors = type.GetConstructors();
        var ctor = Enumerable.FirstOrDefault(ctors, c => c.Has<JsonConstructorAttribute>()) ?? ctors.FirstOrDefault();

        foreach (var ctorParam in EnumerableExtensions.NullToEmpty(ctor?.GetParameters()))
            yield return new ConfigurationImplementationParameter(
                ctorParam.Get<JsonPropertyAttribute>()?.PropertyName ?? ctorParam.Name!,
                ctorParam.ParameterType,
                ConfigurationParameterSource.Constructor);

        var props = type.GetProperties(BindingFlags.Instance | BindingFlags.Public)
            .Where(p => p.SetMethod?.IsPublic == true && !p.Has<JsonIgnoreAttribute>());

        foreach (var prop in props)
            yield return new ConfigurationImplementationParameter(
                prop.Get<JsonPropertyAttribute>()?.PropertyName ?? prop.Name,
                prop.PropertyType,
                ConfigurationParameterSource.Property);
    }

    private static bool HasWildcardProperties(Type type)
    {
        if (typeof(DynamicObject).IsAssignableFrom(type) || typeof(ExpandoObject).IsAssignableFrom(type))
            return true;

        var ifaces = type
            .GetInterfaces()
            .Where(i => i.IsGenericType && i.GenericTypeArguments.Length == 2)
            .Select(i => i.GetGenericTypeDefinition())
            .ToList();

        return ifaces.Contains(typeof(IDictionary<,>))
               || ifaces.Contains(typeof(IReadOnlyDictionary<,>));
    }
}
