using System;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders.Time;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders.Time;

public sealed class TimeDslProviderTests
{
    private readonly ITimeDslProvider target;
    private readonly Mock<IDslTimeConverter> converter;

    public TimeDslProviderTests()
    {
        converter = new Mock<IDslTimeConverter>();
        target = new TimeDslProvider(converter.Object);

        converter.Setup(c => c.ToDsl(It.IsAny<TimeSpan>())).Returns(666m);
    }

    private void Verify(decimal result, double expectedSeconds)
    {
        result.Should().Be(666m);
        converter.Setup(c => c.ToDsl(TimeSpan.FromSeconds(expectedSeconds)));
    }

    [Fact]
    public void Seconds_ShouldConvertCorrectly()
        => Verify(target.Seconds(1.2m), 1.2);

    [Fact]
    public void Minutes_ShouldConvertCorrectly()
        => Verify(target.Minutes(1.2m), 1.2 * 60);

    [Fact]
    public void Hours_ShouldConvertCorrectly()
        => Verify(target.Hours(1.2m), 1.2 * 60 * 60);

    [Fact]
    public void Days_ShouldConvertCorrectly()
        => Verify(target.Days(1.2m), 1.2 * 24 * 60 * 60);

    [Fact]
    public void Weeks_ShouldConvertCorrectly()
        => Verify(target.Weeks(1.2m), 1.2 * 7 * 24 * 60 * 60);

    [Fact]
    public void Years_ShouldConvertCorrectly()
        => Verify(target.Years(1.2m), 1.2 * 365 * 7 * 24 * 60 * 60);
}
