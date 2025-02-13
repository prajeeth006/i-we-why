using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json.Converters;

public sealed class SimpleExceptionConverterTests
{
    [Fact]
    public void ShouldSerializeException()
    {
        var ex = GetException();
        var serializer = new JsonSerializer { Converters = { new SimpleExceptionConverter() } };

        // Act
        var json = JObject.FromObject(ex, serializer);

        Verify(
            json,
            className: "System.ApplicationException",
            message: "Oups",
            verifyInner: i => Verify(
                i,
                className: "System.Exception",
                message: "Inner oups",
                verifyInner: ii => ii.Should().BeNull()));
    }

    private static void Verify(JObject json, string className, string message, Action<JObject> verifyInner)
    {
        json.Properties().Select(p => p.Name).Should().BeEquivalentTo(new[] { "ClassName", "Message", "StackTrace", "InnerException" });
        json.Value<string>("ClassName").Should().Be(className);
        json.Value<string>("Message").Should().Be(message);
        json["StackTrace"].Value<string>(0).Should().Contain("SimpleExceptionConverterTests.GetException()").And.NotStartWith(" ");
        verifyInner(json.Value<JObject>("InnerException"));
    }

    private static Exception GetException()
    {
        try
        {
            try
            {
                throw new Exception("Inner oups");
            }
            catch (Exception iex)
            {
                throw new ApplicationException("Oups", iex);
            }
        }
        catch (Exception ex)
        {
            return ex;
        }
    }
}
