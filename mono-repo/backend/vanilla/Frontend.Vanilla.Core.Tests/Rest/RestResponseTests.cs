using System;
using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Rest;

public sealed class RestResponseTests
{
    private RestResponse target;
    private Mock<IRestFormatter> formatter;

    public RestResponseTests()
    {
        formatter = new Mock<IRestFormatter>();
        target = new RestResponse(new RestRequest(new HttpUri("http://test")));
    }

    [Fact]
    public void Constructor_ShouldSetReasonableDefaults()
    {
        target.StatusCode.Should().Be(HttpStatusCode.OK);
        target.StatusDescription.Should().Be("OK");
        target.Request.Url.Should().Be(new Uri("http://test"));
        target.Headers.Should().BeEmpty();
        target.Content.Length.Should().Be(0);
        target.ExecutionDuration.Should().BeGreaterThan(TimeSpan.Zero);
    }

    [Theory]
    [InlineData(null, "BadRequest")]
    [InlineData(" ", "BadRequest")]
    [InlineData("Missing parameter", "Missing parameter")]
    public void StatusDescription_ShouldReplaceWithStatusCodeIfEmpty(string input, string expected)
    {
        target.StatusCode = HttpStatusCode.BadRequest;
        target.StatusDescription = input;
        target.StatusDescription.Should().Be(expected);
    }

    [Fact]
    public void Stream_ShouldAcceptValidStream()
    {
        var stream = new byte[10];
        target.Content = stream;
        target.Content.Should().BeSameAs(stream);
    }

    [Fact]
    public void Stream_ShouldNotAcceptNull()
        => Assert.Throws<ArgumentNullException>(() => target.Content = null);

    [Fact]
    public void Request_ShouldAllowSettingIt()
    {
        var request = new RestRequest(new HttpUri("http://other"));
        target.Request = request;
        target.Request.Should().BeSameAs(request);
    }

    [Fact]
    public void Request_ShouldThrowIfSetToNull()
        => Assert.Throws<ArgumentNullException>(() => target.Request = null);

    [Fact]
    public void ExecutionDuration_ShouldAcceptValuesAboveZero()
    {
        target.ExecutionDuration = TimeSpan.FromMilliseconds(1);
        target.ExecutionDuration.Should().Be(TimeSpan.FromMilliseconds(1));
    }

    [Theory]
    [InlineData("00:00:00")]
    [InlineData("-00:00:10")]
    public void ExecutionDuration_ShouldNotAcceptValuesLessThanOrEqualToZero(string duration)
        => Assert.Throws<ArgumentOutOfRangeException>(() => target.ExecutionDuration = TimeSpan.Parse(duration));

    [Fact]
    public void Deserialize_ShouldDeserializeUsingGivenFormatter()
    {
        var bytes = target.Content = new byte[] { 0x48, 0x65, 0x6c, 0x6c, 0x6f };
        formatter.Setup(f => f.Deserialize(bytes, typeof(object))).Returns("BWIN");
        target.Deserialize(typeof(object), formatter.Object).Should().Be("BWIN"); // Act
    }

    [Fact]
    public void Deserialize_ShouldRetunNewObjectWhenStatusCodeIsNoContent()
    {
        target.StatusCode = HttpStatusCode.NoContent;
        target.Deserialize(typeof(object), formatter.Object).Should().BeOfType<object>(); // Act
    }

    [Fact]
    public void Deserialize_ShouldDeserializeStronglyTyped()
    {
        formatter.Setup(f => f.Deserialize(It.IsAny<byte[]>(), typeof(string))).Returns("Typed");
        target.Deserialize<string>(formatter.Object).Should().Be("Typed"); // Act
    }

    [Fact]
    public void Deserialize_ShouldThrowIfDeserializationFails()
    {
        var deserEx = new Exception();
        target.Content = "Hello".EncodeToBytes();
        formatter.Setup(f => f.Deserialize(It.IsAny<byte[]>(), typeof(string))).Throws(deserEx);

        var ex = RunFailedDeserializeAndGetException(); // Act

        ex.Message.Should().EndWith("Hello");
        ex.InnerException.Should().BeSameAs(deserEx);
    }

    [Fact]
    public void Deserialize_ShouldTruncateContentInExceptionMessage()
    {
        target.Content = new string('x', 2135).EncodeToBytes();
        formatter.Setup(f => f.Deserialize(It.IsAny<byte[]>(), typeof(string))).Throws(new Exception());

        var ex = RunFailedDeserializeAndGetException(); // Act

        ex.Message.Should().EndWith(new string('x', 1000) + "... (2135 chars total)");
    }

    [Fact]
    public void Deserialize_ShouldThrowIfNull()
    {
        target.Content = "Hello".EncodeToBytes();

        var ex = RunFailedDeserializeAndGetException(); // Act

        ex.InnerException.Should().BeOfType<NullDeserializedException>()
            .Which.Message.Should().Be("Null was deserialized.");
    }

    private Exception RunFailedDeserializeAndGetException()
    {
        target.Request.Url = new HttpUri("http://bwin.com/");

        Action act = () => target.Deserialize(typeof(string), formatter.Object);

        var ex = act.Should().Throw<RestResponseDeserializationException>().Which;
        ex.Message.Should()
            .StartWith($"Failed deserializing System.String using {formatter.Object} from body of the response to GET http://bwin.com/ which is 200 OK. Body content: ");

        return ex;
    }

    [Theory]
    [InlineData(HttpStatusCode.OK, "200 OK")]
    [InlineData(HttpStatusCode.BadRequest, "400 BadRequest")]
    public void ToString_ShouldReportStatus(HttpStatusCode statusCode, string expected)
    {
        target.StatusCode = statusCode;
        target.ToString().Should().Be(expected);
    }
}
