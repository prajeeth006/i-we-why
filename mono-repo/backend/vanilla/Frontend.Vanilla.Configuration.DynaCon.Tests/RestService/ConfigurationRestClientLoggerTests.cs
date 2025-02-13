using System;
using System.Linq;
using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Moq.Language.Flow;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.RestService;

public class ConfigurationRestClientLoggerTests
{
    private IConfigurationRestClient target;
    private Mock<IConfigurationRestClient> inner;
    private Mock<IHistoryLog<RestServiceCallInfo>> restServiceLog;
    private Mock<IClock> clock;

    private RestRequest request;
    private TimeSpan timeout;

    public ConfigurationRestClientLoggerTests()
    {
        inner = new Mock<IConfigurationRestClient>();
        restServiceLog = new Mock<IHistoryLog<RestServiceCallInfo>>();
        clock = new Mock<IClock>();
        target = new ConfigurationRestClientLogger(inner.Object, restServiceLog.Object, clock.Object);

        request = new RestRequest(new HttpUri("http://dynacon")) { Method = HttpMethod.Delete };
        timeout = TimeSpan.FromSeconds(RandomGenerator.GetInt32());

        clock.SetupGet(c => c.UtcNow).Returns(new UtcDateTime(2001, 2, 3));
        clock.Setup(c => c.StartNewStopwatch()).Returns(() => TimeSpan.FromSeconds(66));
    }

    private class FooDto
    {
        public string Bar { get; set; }
    }

    private IReturnsThrows<IConfigurationRestClient, FooDto> SetupInner()
        => inner.Setup(i => i.Execute<FooDto>(request, timeout))
            .Callback(() =>
            {
                clock.SetupGet(c => c.UtcNow).Throws<Exception>();
                clock.Setup(c => c.StartNewStopwatch()).Throws<Exception>();
            });

    [Theory, BooleanData]
    public void ShouldRecordSuccessRequest(bool hasRequestContent)
    {
        request.Content = hasRequestContent ? new RestRequestContent(new string('a', 120), StringFormatter.Singleton) : null;
        var dto = new FooDto { Bar = new string('b', 130) };
        SetupInner().Returns(dto);

        // Act
        var result = target.Execute<FooDto>(request, timeout);

        result.Should().BeSameAs(dto);
        VerifyLoggedCall(
            requestContent: hasRequestContent ? $@"""{new string('a', 99)}... (122 chars total)" : null,
            responseContent: $@"{{""Bar"":""{new string('b', 92)}... (140 chars total)",
            error: null);
    }

    [Theory, BooleanData]
    public void ShouldRecordFailedRequest(bool hasRequestContent)
    {
        request.Content = hasRequestContent ? new RestRequestContent(new string('a', 120), StringFormatter.Singleton) : null;
        var networkEx = new Exception("Network error");
        SetupInner().Throws(networkEx);

        // Act
        Action act = () => target.Execute<FooDto>(request, timeout);

        act.Should().Throw().SameAs(networkEx);
        VerifyLoggedCall(
            requestContent: hasRequestContent ? $@"""{new string('a', 120)}""" : null,
            responseContent: null,
            error: networkEx);
    }

    private void VerifyLoggedCall(string requestContent, string responseContent, Exception error)
        => restServiceLog.Invocations.Single().Arguments.Single().Should().BeEquivalentTo(new[]
        {
            new RestServiceCallInfo(
                new HttpUri("http://dynacon"),
                HttpMethod.Delete,
                new UtcDateTime(2001, 2, 3),
                TimeSpan.FromSeconds(66),
                requestContent,
                responseContent,
                error),
        });
}
