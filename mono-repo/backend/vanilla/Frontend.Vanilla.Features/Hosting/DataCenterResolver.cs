using System;
using System.Linq;
using Ardalis.SmartEnum;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Features.Hosting;

/// <summary>Provides data center hosting details.</summary>
internal interface IDataCenterResolver
{
    /// <summary>Site.</summary>
    DataCenter Site { get; }

    /// <summary>Group.</summary>
    DataCenterGroup Group { get; }
}

internal sealed class DataCenterResolver : IDataCenterResolver
{
    public const string DataCenterEnvironmentVariableName = "Site";
    public const string DataCenterGroupEnvironmentVariableName = "GROUP";

    public DataCenterResolver(IEnvironment environment)
    {
        Site = Parse(environment, DataCenterEnvironmentVariableName, DataCenter.NonProd);
        Group = Parse(environment, DataCenterGroupEnvironmentVariableName, DataCenterGroup.Default);
    }

    private static T Parse<T>(IEnvironment environment, string variableName, T defaultValue)
        where T : SmartEnum<T, string>
    {
        var envVarValue = environment.GetEnvironmentVariable(variableName) ?? defaultValue;
        if (!SmartEnum<T, string>.TryFromValue(envVarValue, out var value))
        {
            throw new Exception(
                $"Failed to setup {typeof(T)} using environment variable '{variableName}' with value '{envVarValue}'. Supported values are: {SmartEnum<T, string>.List.Select(l => l.Value).Join()}.");
        }

        return value;
    }

    public DataCenter Site { get; }
    public DataCenterGroup Group { get; }
}
