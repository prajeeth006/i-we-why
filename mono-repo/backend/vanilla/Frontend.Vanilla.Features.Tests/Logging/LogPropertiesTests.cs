using System.Linq;
using System.Reflection;
using FluentAssertions;
using Frontend.Vanilla.Features.Logging;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging;

public class LogPropertiesTests
{
    [Fact]
    public void EnrichedProperties_ShouldBeEnumeratedCorrectly()
        => LogJsonProperties.EnrichedProperties.Should().BeEquivalentTo(
            "http.hostname",
            "http.absolutePath",
            "http.query",
            "http.method",
            "http.referrer",
            "http.userAgent",
            "http.clientIP",
            "domain",
            "user.name",
            "user.isAuthenticated",
            "user.workflowType",
            "nativeApp",
            "correlationId",
            "requestId",
            "traceRecorded",
            "thread.id",
            "thread.culture",
            "terminal.shopId",
            "terminal.id",
            "evasionDomain");

    [Fact]
    public void AllJsonPropertiesShouldBeUnique()
    {
        var props = typeof(LogJsonProperties).GetFields(BindingFlags.Static | BindingFlags.Public)
            .Where(f => f.FieldType == typeof(string))
            .Select(f => (string)f.GetValue(null))
            .Concat(LogJsonProperties.EnrichedProperties)
            .Select(p => p.ToLowerInvariant());

        props.Should().OnlyHaveUniqueItems()
            .And.Contain("nativeapp").And.Contain("data"); // Just to make sure the test works
    }
}
