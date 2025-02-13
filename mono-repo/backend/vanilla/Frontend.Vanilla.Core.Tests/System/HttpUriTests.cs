using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class HttpUriTests
{
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Constructor_ShouldSucceed_IfValid(bool fromString)
    {
        var target = fromString
            ? new HttpUri("http://www.bwin.com/page?q=1")
            : new HttpUri(new Uri("http://www.bwin.com/page?q=1"));

        target.Should().Be(new Uri("http://www.bwin.com/page?q=1"));
    }

    [Theory]
    [InlineData(false, null)]
    [InlineData(true, null)]
    [InlineData(false, "")]
    [InlineData(true, "")]
    [InlineData(false, "relative")]
    [InlineData(true, "relative")]
    [InlineData(false, "ftp://bwin.com")]
    [InlineData(true, "ftp://bwin.com")]
    public void Constructor_ShouldThrow_IfInvalid(
        bool ctorFromString,
        string value)
    {
        var valueUri = value != null ? new Uri(value, UriKind.RelativeOrAbsolute) : null;
        var reportedParam = ctorFromString ? "uriString" : "uri";
        var reportedValue = value != null ? $"'{value}'" : "null";

        Func<object> act = () => ctorFromString ? new HttpUri(value) : new HttpUri(valueUri);

        act.Should().Throw<ArgumentException>()
            .WithMessage($"Uri must be absolute one with scheme 'http' or 'https'.\r\nActual value: {reportedValue} (Parameter '{reportedParam}')");
    }

    [Fact]
    public void TryCreate_ShouldReturnTrue_IfValid()
    {
        var res = HttpUri.TryCreate("http://www.bwin.com/page?q=1", out var target);

        res.Should().BeTrue();
        target.Should().Be(new Uri("http://www.bwin.com/page?q=1"));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("relative")]
    [InlineData("ftp://bwin.com")]
    public void TryCreate_ShouldReturnFalse_IfInvalid(string value)
    {
        var res = HttpUri.TryCreate(value, out var target);

        res.Should().BeFalse();
        target.Should().BeNull();
    }

    [Fact]
    public void ShouldSerializeCorrectly()
    {
        var json = JsonConvert.SerializeObject(new HttpUri("http://www.bwin.com/page?q=1")); // Act
        json.Should().BeJson("'http://www.bwin.com/page?q=1'");
    }

    [Fact]
    public void ShouldSerializeToUriToken()
    {
        var target = new HttpUri("http://www.bwin.com/page?q=1");

        var json = JToken.FromObject(target); // Act

        json.Value<Uri>().Should().Be(new Uri("http://www.bwin.com/page?q=1"));
        json.Type.Should().Be(JTokenType.Uri);
    }

    [Fact]
    public void ShouldDeserializeCorrectly()
    {
        var target = JsonConvert.DeserializeObject<HttpUri>("'http://www.bwin.com/page?q=1'"); // Act
        target.Should().Be(new Uri("http://www.bwin.com/page?q=1"));
    }
}
