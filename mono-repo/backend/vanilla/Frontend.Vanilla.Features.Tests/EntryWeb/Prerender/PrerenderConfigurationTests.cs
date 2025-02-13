using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using FluentAssertions;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.Prerender;

public class PrerenderConfigurationTests
{
    private PrerenderConfiguration target;

    public PrerenderConfigurationTests()
        => target = new PrerenderConfiguration
        {
            ServiceUrl = new Uri("https://prerender.bwin.corp/"),
            RequestTimeout = TimeSpan.FromSeconds(5),
            ExcludedPagePathAndQueryRegex = new Regex("page"),
            CacheControlResponseHeader = "max-age=3600",
        };

    [Fact]
    public void ShouldBeValid()
        => target.Should().BeValid();

    [Theory]
    [InlineData(null, false)]
    [InlineData("", false)]
    [InlineData("  ", false)]
    [InlineData("xyz", true)]
    public void ShouldRequireToken_IfPrerenderIOService(string token, bool expectedIsValid)
    {
        target.ServiceUrl = new Uri("https://service.prerender.io");
        target.Token = token;

        target.Should().BeValidIf(
            expectedIsValid,
            new ValidationResult(
                $"{nameof(target.Token)} must be specified if {nameof(target.ServiceUrl)} points to official Prerender.io service.",
                new[] { nameof(target.Token) }));
    }
}
