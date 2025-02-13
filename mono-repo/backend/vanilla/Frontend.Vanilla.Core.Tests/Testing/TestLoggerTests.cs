using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.Extensions.Logging;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Testing;

public class TestLoggerTests
{
    private TestLogger<ClassDataAttribute> target;

    public TestLoggerTests()
        => target = new TestLogger<ClassDataAttribute>();

    [Fact]
    public void ShouldRecordLoggedEvents()
    {
        var ex = new Exception("Oups");
        target.LogInformation("Hello {firstName} {lastName}.", "Chuck", "Norris");
        target.LogError(ex, "An error.");

        target.Logged.Should().BeEquivalentOrderedTo(
            new LoggedEvent(
                null,
                LogLevel.Information,
                "Hello {firstName} {lastName}.",
                new Dictionary<string, object>
                {
                    { "firstName", "Chuck" },
                    { "lastName", "Norris" },
                },
                "Hello Chuck Norris."),
            new LoggedEvent(ex, LogLevel.Error, "An error.", new Dictionary<string, object>(), "An error."));
    }

    [Fact]
    public void ShouldReportMissingParameters()
        => RunFailedTest(
#pragma warning disable CA2017
            () => target.LogInformation("Hello {firstName} {lastName}.", "Chuck"),
#pragma warning restore CA2017
            "Missing last 1 values for message format parameters: 'lastName'.");

    [Fact]
    public void ShouldReportTooManyParameters()
        => RunFailedTest(
#pragma warning disable CA2017 // Parameter count mismatch
            () => target.LogInformation("Hello {name}.", "Chuck", "Norris"),
#pragma warning restore CA2017 // Parameter count mismatch
            "Last 1 values passed to the logger aren't used in the message format: 'Norris'.");

    private void RunFailedTest(Action act, string expectedExMsg)
    {
        var ex = act.Should().Throw()
            .WithMessage(expectedExMsg)
            .Which;

        target.Invoking(t => t.Logged).Should().Throw()
            .Which.InnerException.Should().BeSameAs(ex);
    }
}
