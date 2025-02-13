using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers;

public sealed class FakeDslProvidersTests
{
    private static readonly IServiceProvider Services = new ServiceCollection()
        .AddFakeVanillaDslProviders().BuildServiceProvider();

    public static readonly IEnumerable<object[]> ProviderTypes = typeof(IUserDslProvider).Assembly.GetExportedTypes()
        .Where(t => t.IsInterface && t.Namespace.StartsWith(typeof(IUserDslProvider).Namespace))
        .Except(typeof(IBalanceDslProvider), typeof(IBonusBalanceDslProvider), typeof(IDateTimeDslProvider))
        .Select(t => new[] { t }); // Without decimal support

    [Theory, MemberData(nameof(ProviderTypes))]
    public void ShouldResolveProvider(Type type)
        => Services.GetRequiredService(type);

    [Fact]
    public void ShouldThrowIfProviderEvaluated()
    {
        var provider = Services.GetRequiredService<IUserDslProvider>();

        Action act = () => provider.GetLoginName();

        act.Should().Throw<NotSupportedException>().WithMessage(
            $"Fake DSL provider can't evaluate 'GetLoginName'. You must add your own implementation of {typeof(IUserDslProvider)}.");
    }
}
