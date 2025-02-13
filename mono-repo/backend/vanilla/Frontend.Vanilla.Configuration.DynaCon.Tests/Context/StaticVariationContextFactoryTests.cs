using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Context;

public sealed class StaticVariationContextFactoryTests
{
    private StaticVariationContextFactory target;
    private Mock<IDynaConVariationContextProvider> dynProvider;

    public StaticVariationContextFactoryTests()
    {
        var settings = TestSettings.GetTenant(parameters: new[]
        {
            new DynaConParameter("service", "Vanilla:666"),
            new DynaConParameter("service", "Portal:111"),
            new DynaConParameter("context.product", "Sports"),
            new DynaConParameter("CONTEXT.label", "bwin.com"),
        });
        dynProvider = new Mock<IDynaConVariationContextProvider>();
        target = new StaticVariationContextFactory(settings, new[] { dynProvider.Object });
    }

    [Fact]
    public void ShouldCreateFromDynaConEngineSettings()
    {
        dynProvider.SetupGet(p => p.Name).Returns("Religion");

        var ctx = target.Create(); // Act

        ctx.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, TrimmedRequiredString> { { "product", "sports" }, { "label", "bwin.com" } });
    }

    [Theory]
    [InlineData("Label")]
    [InlineData("LABel")] // Should be case-insensitive
    public void ShouldThrow_IfConflictsWithDynamicContext(string providerName)
    {
        dynProvider.SetupGet(p => p.Name).Returns(providerName);

        Func<object> act = target.Create;

        act.Should().Throw<Exception>().WithMessage(
            $"There can't be {dynProvider.Object} registered as {nameof(IDynaConVariationContextProvider)} with {nameof(IDynaConVariationContextProvider.Name)}"
            + $" '{providerName}' because particular variation context property is configured as constant for this app in its context: 'product', 'label'.");
    }
}
