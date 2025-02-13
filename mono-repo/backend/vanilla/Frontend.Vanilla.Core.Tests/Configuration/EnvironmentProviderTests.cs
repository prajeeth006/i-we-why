using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Configuration;

public sealed class EnvironmentProviderTests
{
    [Theory]
    [InlineData(null, false)]
    [InlineData("https://www.bwin.com", true)]
    [InlineData("https://bwin.com", false)] // This is not useful for our websites
    [InlineData("https://qa2.www.internal.bwin.com", true)]
    [InlineData("http://www.bwin.com", true)]
    [InlineData("ftp://www.bwin.com", true)]
    [InlineData("https://www.party.com", false)]
    [InlineData("https://www.bwin.es", false)]
    [InlineData("relative-bwin.com", false)]
    [InlineData("/root/bwin.com", false)]
    public void IsCurrentLabel_ShouldEvaluateCorrectly(string uriStr, bool expected)
    {
        var provider = Mock.Of<IEnvironmentProvider>(p => p.CurrentLabel == "bwin.com");
        var uri = uriStr != null ? new Uri(uriStr, UriKind.RelativeOrAbsolute) : null;

        provider.IsCurrentLabel(uri).Should().Be(expected);
    }
}
