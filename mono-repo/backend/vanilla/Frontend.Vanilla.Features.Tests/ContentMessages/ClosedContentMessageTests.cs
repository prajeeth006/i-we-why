#nullable enable

using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ContentMessages;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ContentMessages;

public class ClosedContentMessageTests
{
    [Theory]
    [InlineData(false, false)]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public void ShouldCreateCorrectly(bool showOnNextSession, bool showOnNextLogin)
    {
        var target = new ClosedMessageInfo("msg", showOnNextSession, showOnNextLogin);

        target.Name.Should().Be("msg");
        target.ShowOnNextSession.Should().Be(showOnNextSession);
        target.ShowOnNextLogin.Should().Be(showOnNextLogin);
    }

    [Fact]
    public void ShouldThrow_IfBothFlagsAreTrue()
        => new Action(() => new ClosedMessageInfo("msg", true, true))
            .Should().Throw<ArgumentException>().Which.ParamName.Should().Be(nameof(ClosedMessageInfo.ShowOnNextSession).ToCamelCase());

    [Fact]
    public void ToString_Test()
        => new ClosedMessageInfo("msg", true, false).ToString().Should()
            .Be($"({nameof(ClosedMessageInfo.Name)}='msg', {nameof(ClosedMessageInfo.ShowOnNextSession)}=True, {nameof(ClosedMessageInfo.ShowOnNextLogin)}=False)");

    [Fact]
    public void Equals_ShouldBeCaseInsensitive()
        => new ClosedMessageInfo("msg", false, false).Should().Be(new ClosedMessageInfo("MSG", false, false));
}
