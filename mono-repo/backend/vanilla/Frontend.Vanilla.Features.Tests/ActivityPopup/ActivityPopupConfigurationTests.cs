using System;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.ActivityPopup;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ActivityPopup;

public sealed class ActivityPopupConfigurationTests
{
    [Fact]
    public void ShouldGetConfig()
    {
        var expression1 = new Mock<IDslExpression<bool>>();

        var config = new ActivityPopupConfiguration(expression1.Object, new TimeSpan(0, 5, 0));

        config.Timeout.Should().Be(new TimeSpan(0, 5, 0));
        config.IsEnabledCondition.Should().BeSameAs(expression1.Object);
    }
}
