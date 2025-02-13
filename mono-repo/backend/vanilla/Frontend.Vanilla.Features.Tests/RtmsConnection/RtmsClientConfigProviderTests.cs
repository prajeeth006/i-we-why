using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.RtmsConnection;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RtmsConnection;

public class RtmsClientConfigProviderTests
{
    private IClientConfigProvider target;
    private Mock<ITraceRecorder> traceRecorder;
    private Mock<IDslExpression<bool>> tracingEnabledDsl;
    private CancellationToken ct;
    private ClientEvaluationResult<bool> clientEvaluationResult;

    public RtmsClientConfigProviderTests()
    {
        traceRecorder = new Mock<ITraceRecorder>();
        tracingEnabledDsl = new Mock<IDslExpression<bool>>();
        ct = TestCancellationToken.Get();

        var condition = new Mock<IDslExpression<bool>>();
        clientEvaluationResult = ClientEvaluationResult<bool>.FromClientExpression("condition");
        condition.Setup(x => x.EvaluateForClientAsync(ct)).ReturnsAsync(clientEvaluationResult);
        var disabledEvents = new Dictionary<string, DisabledEvents>();
        disabledEvents.Add("eventName", new DisabledEvents(condition.Object));

        var config = new RtmsConfiguration(
            true,
            new Uri("https://rtms.bwin.com/gateway"),
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(15),
            tracingEnabledDsl.Object,
            new Regex("pattern"),
            disabledEvents,
            new List<string>() { "error" },
            new List<string>() { "balance_update" },
            true,
            new TimeSpan(2, 2, 2));
        target = new RtmsClientConfigProvider(config, traceRecorder.Object);
    }

    [Fact]
    public void Name_Test()
        => target.Name.Should().Be("vnRtms");

    [Theory]
    [InlineData(false, false)]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public async Task GetClientConfiguration_Test(bool tracingEnabled, bool rtmsTracingEnabled)
    {
        traceRecorder.Setup(r => r.GetRecordingTrace()).Returns(() => tracingEnabled ? Mock.Of<IRecordingTrace>() : null);
        tracingEnabledDsl.Setup(e => e.EvaluateAsync(ct)).ReturnsAsync(rtmsTracingEnabled);
        dynamic config = await target.GetClientConfigAsync(ct);

        ((Uri)config.Host).Should().Be(new Uri("https://rtms.bwin.com/gateway"));
        ((int)config.KeepAliveMilliseconds).Should().Be(5000);
        ((int)config.ReconnectMilliseconds).Should().Be(15000);
        ((string)config.TracingBlacklistPattern).Should().Be("pattern");
        ((bool)config.TracingEnabled).Should().Be(tracingEnabled || rtmsTracingEnabled);
        ((Dictionary<string, ClientEvaluationResult<bool>>)config.DisabledEvents).Should().Equal(new Dictionary<string, ClientEvaluationResult<bool>>
            { { "eventname", clientEvaluationResult } });
        ((IReadOnlyList<string>)config.RemoteLogLevels).Should().BeEquivalentTo(new List<string>() { "error" });
        ((IReadOnlyList<string>)config.BackgroundEvents).Should().BeEquivalentTo(new List<string>() { "balance_update" });
    }
}
