using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.HealthPages.Api;

public class DiagnosticsRouteTests
{
    [Fact]
    public void Constructor_ShouldCreateCorrectly()
    {
        var method = new HttpMethod("FUCK");

        // Act
        var target = new DiagnosticsRoute(method, "/test");

        target.HttpMethod.Should().BeSameAs(method);
        target.UrlPattern.Should().Be("/test");
    }

    [Fact]
    public void ImplicitOperator_ShouldCreateCorrectly()
    {
        // Act
        DiagnosticsRoute target = "/test";

        target.HttpMethod.Should().BeSameAs(HttpMethod.Get);
        target.UrlPattern.Should().Be("/test");
    }
}
