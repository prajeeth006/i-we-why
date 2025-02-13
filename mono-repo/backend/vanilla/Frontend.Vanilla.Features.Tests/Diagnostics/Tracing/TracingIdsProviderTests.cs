using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using System;
using System.Collections.Concurrent;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.Tracing;

public class TracingIdsProviderTests
{
    private ITracingIdsProvider target;
    private ICurrentContextAccessor currentContextAccessor;
    private Mock<ITraceRecorder> traceRecorder;
    private Mock<ICookieHandler> cookieHandler;
    private DefaultHttpContext httpContext;

    public TracingIdsProviderTests()
    {
        currentContextAccessor = Mock.Of<ICurrentContextAccessor>(r => r.Items == new ConcurrentDictionary<object, Lazy<object>>());
        currentContextAccessor.Items.TryAdd(CachedChangesetResolver.ItemsKey, new Lazy<object>(""));
        traceRecorder = new Mock<ITraceRecorder>();
        cookieHandler = new Mock<ICookieHandler>();
        httpContext = new DefaultHttpContext();
        target = new TracingIdsProvider(traceRecorder.Object, currentContextAccessor, cookieHandler.Object);
    }

    [Theory]
    [InlineData(true, "01")]
    [InlineData(false, "00")]
    public void ShouldGenerateCorrectIds(bool hasRecordingTrace, string expectedFlags)
    {
        traceRecorder.Setup(m => m.GetRecordingTrace()).Returns(hasRecordingTrace ? Mock.Of<IRecordingTrace>() : null);

        // Act
        var ids = target.GetTracingIds();

        VerifyIds(ids);
        ids.IsRecording.Should().Be(hasRecordingTrace);
        ids.TraceParentHeader.Should().Be($"00-{ids.CorrelationId}-{ids.RequestId}-{expectedFlags}");
        VerifyCookieSet(ids.CorrelationId);
    }

    [Fact]
    public void ShouldReuseCorrelationIdFromCookie()
    {
        cookieHandler.Setup(h => h.GetValue(TracingIdsProvider.CookieName)).Returns("caf6771a33b5441da484b93170b161eb");

        // Act
        var ids = target.GetTracingIds();

        VerifyIds(ids);
        ids.CorrelationId.Should().Be("caf6771a33b5441da484b93170b161eb");
        VerifyCookieSetNever();
    }

    [Theory, ValuesData("", "gibberish", "1234567890abcdefghij?!")]
    public void ShouldRegenerateCorrelationId_IfCookieNotValid(string cookieValue)
    {
        cookieHandler.Setup(h => h.GetValue(TracingIdsProvider.CookieName)).Returns(cookieValue);

        // Act
        var ids = target.GetTracingIds();

        VerifyIds(ids);
        VerifyCookieSet(ids.CorrelationId);
    }

    [Fact]
    public void ShouldReturnNewCorrelationId_IfNoConfig()
    {
        currentContextAccessor.Items.Clear();
        RunNewIsolatedIdTest();
    }

    private void RunNewIsolatedIdTest()
    {
        // Act
        var ids = target.GetTracingIds();

        VerifyIds(ids);
        VerifyCookieSetNever();
    }

    [Fact]
    public void ShouldCacheIds()
    {
        var ids1 = target.GetTracingIds();

        // Act
        var ids2 = target.GetTracingIds();

        ids1.Should().Be(ids2);
        currentContextAccessor.Items["Van:TracingIds"].Value.Should().BeEquivalentTo(ids1);
    }

    private static void VerifyIds((string CorrelationId, string RequestId, bool, string) ids)
    {
        VerifyHex(ids.CorrelationId, expectedLength: 32);
        VerifyHex(ids.RequestId, expectedLength: 16);
    }

    private static void VerifyHex(string actual, int expectedLength)
        => actual.Should().MatchRegex($"^[0-9a-f]{{{expectedLength}}}$")
            .And.NotBe(new string('0', expectedLength));

    private void VerifyCookieSet(string value)
        => cookieHandler.Verify(h => h.Set(TracingIdsProvider.CookieName, value, new CookieSetOptions { MaxAge = TimeSpan.FromDays(1825), HttpOnly = true }));

    private void VerifyCookieSetNever()
        => cookieHandler.VerifyWithAnyArgs(h => h.Set(null, null, null), Times.Never);
}
