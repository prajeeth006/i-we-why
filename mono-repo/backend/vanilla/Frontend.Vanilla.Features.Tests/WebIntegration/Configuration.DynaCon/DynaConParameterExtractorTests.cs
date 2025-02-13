using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Configuration.DynaCon;

public class DynaConParameterExtractorTests
{
    private DynaConEngineSettingsBuilder settingsBuilder;

    public DynaConParameterExtractorTests()
        => settingsBuilder = new DynaConEngineSettingsBuilder();

    [Theory]
    [InlineData("context.channel")]
    [InlineData("Context.CHANNEL")] // should be case-insensitive
    public void ShouldExtractParameters(string channelParamName)
    {
        settingsBuilder.Parameters = new[]
        {
            new DynaConParameter("context.product", "Sports"),
            new DynaConParameter(channelParamName, "Mobile"),
            new DynaConParameter("context.label", "bwin.com"),
            new DynaConParameter("service", "Vanilla:666"),
            new DynaConParameter("conquerWorld", "true"),
        };
        var target = new DynaConParameterExtractor(settingsBuilder.Build());

        target.Product.Should().Be("Sports");
    }

    [Fact]
    public void ShouldThrow_IfMissingParameter()
    {
        settingsBuilder.Parameters = new[]
        {
            new DynaConParameter("service", "Vanilla:666"),
            new DynaConParameter("context.label", "bwin.com"),
        };
        var settings = settingsBuilder.Build();

        Func<object> act = () => new DynaConParameterExtractor(settings);

        act.Should().Throw().WithMessage(
            "Missing mandatory DynaCon parameter 'context.product'."
            + $" Specify it in 'dynaCon' web.config section or register as {typeof(DynaConParameter)} in Autofac."
            + " Current parameters: 'service'='Vanilla:666', 'context.label'='bwin.com'");
    }
}
