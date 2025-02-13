using System;
using System.Reflection;
using Frontend.Vanilla.Core.Configuration;
using Moq;

namespace Frontend.Vanilla.Testing;

/// <summary>
///     Configuration factory which creates mocks. Useful if you don't want to provide mocks for all configs one by one.
/// </summary>
public sealed class FakeConfigurationFactory : IConfigurationEngine
{
    object IConfigurationEngine.CreateConfiguration(IConfigurationInfo configuration)
    {
        return typeof(Mock)
            .GetMethod(nameof(Mock.Of), BindingFlags.Static | BindingFlags.Public, null, Type.EmptyTypes, null)
            .MakeGenericMethod(configuration.ServiceType)
            .Invoke(null, null);
    }
}
