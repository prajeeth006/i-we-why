using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Configuration.DynaCon;

public class MultitenantSettingsFactoryTests
{
    [Theory]
    [InlineData(null, null)]
    [InlineData("FallbackPattern.json", null)]
    [InlineData(null, "OverridesPattern.json")]
    public void ShouldCreateCorrectly(string fallbackFile, string overridesFile)
    {
        var engineSettings = new DynaConEngineSettingsBuilder
        {
            ChangesetFallbackFile = fallbackFile == null ? null : OperatingSystemRootedPath.Get(fallbackFile),
            ContextHierarchyFallbackFile = fallbackFile != null ? OperatingSystemRootedPath.Get(fallbackFile) + ".context" : null,
            LocalOverridesFile = overridesFile == null ? null : OperatingSystemRootedPath.Get(overridesFile),
            LocalOverridesMode = overridesFile != null ? LocalOverridesMode.File : LocalOverridesMode.Disabled,
            Parameters =
            {
                new DynaConParameter("service", "Test:1"),
                new DynaConParameter("Other", "Value"),
            },
        };

        var paramReplacer = new Mock<IDynaConParameterReplacer>();
        paramReplacer.Setup(r => r.Replace(OperatingSystemRootedPath.Get("FallbackPattern.json"), It.IsAny<IEnumerable<DynaConParameter>>()))
            .Returns(OperatingSystemRootedPath.Get("FallbackResolved.json"));
        paramReplacer.Setup(r => r.Replace(OperatingSystemRootedPath.Get("OverridesPattern.json"), It.IsAny<IEnumerable<DynaConParameter>>()))
            .Returns(OperatingSystemRootedPath.Get("OverridesResolved.json"));

        var target = new MultitenantSettingsFactory(engineSettings.Build(), paramReplacer.Object);

        // Act
        var settings = target.Create("bwin.com");

        settings.Name.Should().Be("bwin.com");
        settings.ChangesetFallbackFile.Should().Be(fallbackFile != null ? new RootedPath(OperatingSystemRootedPath.Get("FallbackResolved.json")) : null);
        settings.LocalOverridesFile.Should().Be(overridesFile != null ? new RootedPath(OperatingSystemRootedPath.Get("OverridesResolved.json")) : null);
        settings.Parameters.Should().BeEquivalentTo(new[]
        {
            new DynaConParameter("service", "Test:1"),
            new DynaConParameter("Other", "Value"),
            new DynaConParameter("context.label", "bwin.com"),
        });

        paramReplacer.Invocations.Should().HaveCount(new[] { fallbackFile, overridesFile }.Count(f => f != null));
        paramReplacer.Invocations.Each(i => i.Arguments[1].Should().BeEquivalentTo(settings.Parameters));
    }
}
