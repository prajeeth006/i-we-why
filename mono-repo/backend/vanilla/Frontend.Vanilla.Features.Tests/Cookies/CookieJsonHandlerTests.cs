using System;
using FluentAssertions;
using Frontend.Vanilla.Features.Cookies;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Cookies;

public class CookieJsonHandlerTests
{
    private ICookieJsonHandler target;
    private Mock<ICookieHandler> cookieHandler;

    public CookieJsonHandlerTests()
    {
        cookieHandler = new Mock<ICookieHandler>();
        target = new CookieJsonHandler(cookieHandler.Object);
    }

    [Theory]
    [InlineData(null, null)]
    [InlineData("%7B%22webmasterId%22%3A100000%7D", "100000")]
    [InlineData("{\"webmasterId\":200}", "200")]
    public void GetValue_ShouldReturnValue(string cookieValue, string result)
    {
        cookieHandler.Setup(c => c.GetValue("postLoginValues")).Returns(cookieValue);
        target.GetValue("postLoginValues", "webmasterId").Should().Be(result);
    }

    [Fact]
    public void GetValue_ShouldThrowIfValueIsNotJson()
    {
        cookieHandler.Setup(c => c.GetValue("postLoginValues")).Returns("test");
        Action action = () => target.GetValue("postLoginValues", "webmasterId");

        action.Should().Throw<ArgumentException>()
            .WithMessage("Unable to parse valid value 'webmasterId' from cookie 'postLoginValues'. (Parameter 'property')");
    }
}
