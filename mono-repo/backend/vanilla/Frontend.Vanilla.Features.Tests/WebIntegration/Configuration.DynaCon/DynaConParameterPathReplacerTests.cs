using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Configuration.DynaCon;

public sealed class DynaConParameterPlaceholderReplacerTests
{
    private static readonly IDynaConParameterReplacer Target = new DynaConParameterReplacer();

    private static readonly IEnumerable<DynaConParameter> Parameters = new[]
    {
        new DynaConParameter("service", "Vanilla:666"),
        new DynaConParameter("service", "LiveBetting:777"),
        new DynaConParameter("context.label", "bwin.com"),
    }.AsReadOnly();

    [Fact]
    public void ShouldReplacePlaceholders()
    {
        // Act
        var result = Target.Replace(OperatingSystemRootedPath.Get("{context.label}-{context.label}/{service}.json"), Parameters);

        result.Should().Be(OperatingSystemRootedPath.Get("bwin.com-bwin.com/Vanilla-666&LiveBetting-777.json"));
    }

    [Fact]
    public void ShouldThrowIfPlaceholderNotFound()
        => new Action(() => Target.Replace(OperatingSystemRootedPath.Get("{context.missing}.json"), Parameters))
            .Should().Throw().WithMessage($"Failed resolving file path from pattern '{OperatingSystemRootedPath.Get("{context.missing}.json")}'.")
            .WithInnerMessage("Unable to find corresponding DynaCon parameter for placeholder '{context.missing}'.");
}
