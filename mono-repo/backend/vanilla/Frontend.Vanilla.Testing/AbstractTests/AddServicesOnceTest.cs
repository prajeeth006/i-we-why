using System;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Testing.AbstractTests;

/// <summary>
///     Tests that particular method adds its services only once hence it has some flag to avoid double execution.
/// </summary>
internal static class AddServicesOnceTest
{
    public static void Run<TSampleService>(Action<IServiceCollection> addServices)
    {
        var services = new ServiceCollection();

        addServices(services);
        addServices(services);

        var objs = services.BuildServiceProvider().GetServices<TSampleService>();
        objs.Should().HaveCount(1);
    }
}
