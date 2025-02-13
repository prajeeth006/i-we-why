using System;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Vanilla.Testing.AbstractTests;

/// <summary>
/// temp.
/// </summary>
public abstract class DependencyInjectionTestsBase
{
    internal IServiceProvider Provider { get; set; }
    internal IServiceProvider ProviderWithoutFakes { get; set; }

    /// <summary>
    /// test.
    /// </summary>
    public DependencyInjectionTestsBase()
    {
        var collection = new ServiceCollection();

        SetupTestedServices(collection);
        ProviderWithoutFakes = collection.BuildServiceProvider(true);

        SetupFakes(collection);
        Provider = collection.BuildServiceProvider(true);
    }

    internal abstract void SetupTestedServices(IServiceCollection services);
    internal abstract void SetupFakes(IServiceCollection services);

    [Theory, InheritedMemberData("TestCases")]
    internal void Test(string name, Action<IServiceProvider, IServiceProvider> act)
    {
        var dummy = name;
        act(Provider, ProviderWithoutFakes);
    }
}
