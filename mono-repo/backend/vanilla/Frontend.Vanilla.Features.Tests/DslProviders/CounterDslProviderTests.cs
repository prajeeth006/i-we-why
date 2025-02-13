using System;
using FluentAssertions;
using FluentAssertions.Common;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.DslProviders.Time;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Xunit;
using IClock = Frontend.Vanilla.Core.Time.IClock;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class CounterDslProviderTests
{
    private readonly ICounterDslProvider target;
    private readonly JsonSerializerSettings serializerSettings;
    private readonly Mock<ICookiesDslProvider> cookiesDslProvider;
    private readonly Mock<IClock> clock;
    private readonly Mock<IDslTimeConverter> dslTimeConverter;

    public CounterDslProviderTests()
    {
        cookiesDslProvider = new Mock<ICookiesDslProvider>();
        dslTimeConverter = new Mock<IDslTimeConverter>();
        clock = new Mock<IClock>();
        target = new CounterDslProvider(cookiesDslProvider.Object, dslTimeConverter.Object, clock.Object);
        serializerSettings = new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };
    }

    [Fact]
    public void Get_ShouldReturnCounterValue()
    {
        cookiesDslProvider.Setup(x => x.Get("test")).Returns(JsonConvert.SerializeObject(new Counter(2, new DateTime(2020, 01, 01))));
        // Act
        var result = target.Get("test");

        result.Should().Be(2);
    }

    [Fact]
    public void Get_ShouldReturnZeroIfCounterDoesNotExists()
    {
        cookiesDslProvider.Setup(x => x.Get("test")).Returns("");
        // Act
        var result = target.Get("test");

        result.Should().Be(0);
    }

    [Fact]
    public void Increment_ShouldCreateNewCounterWhenCounterDoesNotExists()
    {
        cookiesDslProvider.Setup(x => x.Get("test")).Returns("");
        var (expiration, datetime, datetimeExpired) = SetupAbsoluteExpiration();

        var newCounter = new Counter(1, datetime);
        // Act
        target.Increment("test", expiration);

        cookiesDslProvider.Verify(x => x.SetPersistent("test", JsonConvert.SerializeObject(newCounter, serializerSettings), expiration));
    }

    [Fact]
    public void Increment_ShouldCreateNewCounterWhenExpired()
    {
        var (expiration, datetime, datetimeExpired) = SetupAbsoluteExpiration(true);

        var counter = JsonConvert.SerializeObject(new Counter(3, datetime));
        cookiesDslProvider.Setup(x => x.Get("test")).Returns(counter);

        // Act
        target.Increment("test", expiration);

        var newCounter = new Counter(1, datetime);
        cookiesDslProvider.Verify(x => x.SetPersistent("test", JsonConvert.SerializeObject(newCounter, serializerSettings), expiration));
    }

    [Fact]
    public void Increment_ShouldIncrementCounter()
    {
        var (expiration, datetime, expiredDate) = SetupAbsoluteExpiration();

        var counter = JsonConvert.SerializeObject(new Counter(2, datetime));
        cookiesDslProvider.Setup(x => x.Get("test")).Returns(counter);

        // Act
        target.Increment("test", expiration);

        var incrementedCounter = new Counter(3, datetime);
        cookiesDslProvider.Verify(x => x.SetPersistent("test", JsonConvert.SerializeObject(incrementedCounter, serializerSettings), expiration));
    }

    private (decimal, DateTime, DateTime) SetupAbsoluteExpiration(bool expired = false)
    {
        var expiration = CookiesDslProvider.AbsoluteExpirationBoundary + 500;
        var datetime = TestTime.GetRandom();
        var userLocalDate = datetime.AddDays(-1).ToDateTimeOffset();
        clock.SetupGet(x => x.UserLocalNow).Returns(userLocalDate);

        dslTimeConverter.Setup(c => c.FromDslToTime(expiration)).Returns(datetime);
        dslTimeConverter.Setup(c => c.ToDsl(datetime)).Returns(expiration);

        if (expired)
        {
            userLocalDate = datetime.AddDays(1).ToDateTimeOffset();
            clock.SetupGet(x => x.UserLocalNow).Returns(userLocalDate);
            dslTimeConverter.Setup(c => c.ToDsl(userLocalDate)).Returns(expiration + 500);
        }

        return (expiration, datetime, userLocalDate.DateTime);
    }
}
