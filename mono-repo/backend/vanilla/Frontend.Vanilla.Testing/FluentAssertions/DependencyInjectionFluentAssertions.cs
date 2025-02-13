using System;
using FluentAssertions;
using FluentAssertions.Primitives;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Testing.FluentAssertions;

internal static class DependencyInjectionFluentAssertions
{
    public static AndConstraint<TAssertions> BeSingleton<TSubject, TAssertions>(
        this ReferenceTypeAssertions<TSubject, TAssertions> assertions,
        IServiceProvider provider,
        Type serviceType)
        where TAssertions : ReferenceTypeAssertions<TSubject, TAssertions>
    {
        return assertions.BeSameAs((TSubject)provider.GetRequiredService(serviceType), "should be singleton");
    }
}
