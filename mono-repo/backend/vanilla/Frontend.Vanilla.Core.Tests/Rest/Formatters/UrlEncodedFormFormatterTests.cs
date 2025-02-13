using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Primitives;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Rest.Formatters;

public sealed class UrlEncodedFormFormatterTests
{
    private static readonly IRestFormatter Target = UrlEncodedFormFormatter.Singleton;

    [Fact]
    public void ContentTypeTest()
        => Target.ContentType.Should().Be(ContentTypes.UrlEncodedForm);

    [Fact]
    public void Serialize_ShouldDictionaryToUrl()
    {
        var bytes = Target.Serialize(new Dictionary<string, StringValues>
        {
            ["foo"] = "bar",
            ["test"] = "&a",
        });

        bytes.DecodeToString().Should().Be("foo=bar&test=%26a");
    }

    [Fact]
    public void Serialize_TypeCannotBeSerialized()
    {
        Action act = () => Target.Serialize(new object());
        act.Should().Throw<InvalidCastException>();
    }
}
