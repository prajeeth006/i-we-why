using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.RangeDatepicker;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RangeDatepicker;

public sealed class RangeDatepickerConfigurationTests
{
    [Fact]
    public void ShouldGetConfig()
    {
        var expression = new Mock<IDslExpression<bool>>();
        var config = new RangeDatepickerConfiguration(expression.Object, 1);

        config.IsEnabledCondition.Should().BeSameAs(expression.Object);
        config.FirstDayOfWeek.Should().Be(1);
    }
}
