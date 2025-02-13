using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Vanilla.Testing.AbstractTests;

internal sealed class DependencyInjectionTestCases
{
    public IEnumerable<Type> Services { get; set; }
    public IEnumerable<(Type ServiceType, Type ExpectedImplType)> ServiceImpls { get; set; }
    public IEnumerable<(Type ServiceType, Type ExpectedImplType)> MultiServices { get; set; }
    public IEnumerable<Type> NotRegisteredServices { get; set; }

    public TheoryData<string, Action<IServiceProvider, IServiceProvider>> GetTestCases()
    {
        var data = new TheoryData<string, Action<IServiceProvider, IServiceProvider>>();
        foreach (var serviceType in Services.NullToEmpty())
            data.Add($"Should resolve {serviceType}.", (p, _) =>
                p.GetRequiredService(serviceType)
                    .Should().BeSingleton(p, serviceType));

        foreach (var test in ServiceImpls.NullToEmpty())
            data.Add($"Should resolve {test.ServiceType} to implementation {test.ExpectedImplType}.", (p, _) =>
                p.GetRequiredService(test.ServiceType)
                    .Should().BeOfType(test.ExpectedImplType)
                    .And.BeSingleton(p, test.ServiceType));

        foreach (var test in MultiServices.NullToEmpty())
            data.Add($"Should resolve one of {test.ServiceType} to implementation {test.ExpectedImplType}.", (p, _) =>
                p.GetServices(test.ServiceType)
                    .Select(s => s.GetType())
                    .Should().ContainSingle(t => t == test.ExpectedImplType));

        foreach (var serviceType in NotRegisteredServices.NullToEmpty())
            data.Add($"Should not resolve any {serviceType}.", (_, p) =>
                p.GetService(serviceType)
                    .Should().BeNull());

        return data;
    }
}
