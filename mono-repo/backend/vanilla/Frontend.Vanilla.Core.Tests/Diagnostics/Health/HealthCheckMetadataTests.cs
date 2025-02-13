#nullable enable

using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System.Text;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Diagnostics.Health;

public class HealthCheckMetadataTests
{
    [Theory]
    [InlineData(HealthCheckSeverity.Default)]
    [InlineData(HealthCheckSeverity.Critical)]
    public void ShouldCreateWithAllDetails(HealthCheckSeverity severity)
    {
        var target = new HealthCheckMetadata(
            name: "Skynet",
            description: "Checks health state of Skynet super intelligence.",
            whatToDoIfFailed: "Travel to past to fix it before it's started up.",
            severity: severity,
            configurationFeatureName: "Skynet.Config",
            documentationUri: new Uri("https://skynet.nsa.gov/"));

        target.Name.Should().Be("Skynet");
        target.Description.Should().Be("Checks health state of Skynet super intelligence.");
        target.WhatToDoIfFailed.Should().Be("Travel to past to fix it before it's started up.");
        target.Severity.Should().Be(severity);
        target.ConfigurationFeatureName.Should().Be("Skynet.Config");
        target.DocumentationUri.Should().Be(new Uri("https://skynet.nsa.gov/"));
    }

    [Fact]
    public void ShouldCreateWithDefaults()
    {
        var target = new HealthCheckMetadata(
            name: "Skynet",
            description: "Checks health state of Skynet super intelligence.",
            whatToDoIfFailed: "Travel to past to fix it before it's started up.");

        target.Name.Should().Be("Skynet");
        target.Description.Should().Be("Checks health state of Skynet super intelligence.");
        target.WhatToDoIfFailed.Should().Be("Travel to past to fix it before it's started up.");
        target.Severity.Should().Be(HealthCheckSeverity.Default);
        target.ConfigurationFeatureName.Should().BeNull();
        target.DocumentationUri.Should().BeNull();
    }

    public static readonly IEnumerable<object?[]> InvadliConstructorTestData = new[]
    {
        new object?[] { "name", null, "YYY".AsTrimmedRequired(), "ZZZ".AsTrimmedRequired(), HealthCheckSeverity.Default },
        new object?[] { "description", "XXX".AsTrimmedRequired(), null, "ZZZ".AsTrimmedRequired(), HealthCheckSeverity.Default },
        new object?[] { "whatToDoIfFailed", "XXX".AsTrimmedRequired(), "YYY".AsTrimmedRequired(), null, HealthCheckSeverity.Default },
        new object?[] { "severity", "XXX".AsTrimmedRequired(), "YYY".AsTrimmedRequired(), "ZZZ".AsTrimmedRequired(), (HealthCheckSeverity)66 },
    };

    [Theory]
    [MemberData(nameof(InvadliConstructorTestData))]
    public void ShouldThrowIfInvalidArguments(
        string expectedParamName,
        TrimmedRequiredString name,
        TrimmedRequiredString description,
        TrimmedRequiredString whatToDoIfFailed,
        HealthCheckSeverity severity)
        => new Func<object>(() => new HealthCheckMetadata(name, description, whatToDoIfFailed, severity))
            .Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be(expectedParamName);
}
