using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.XmlSources;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.XmlSources;

public class DistributedCacheContentXmlDecoratorTestsWithTracing() : DistributedCacheContentXmlDecoratorTests(true) { }

public class DistributedCacheContentXmlDecoratorTestsWithoutTracing() : DistributedCacheContentXmlDecoratorTests(false) { }

public abstract class DistributedCacheContentXmlDecoratorTests : TraceTestsBase
{
    protected DistributedCacheContentXmlDecoratorTests(bool useTrace)
        : base(useTrace)
    {
        inner = new Mock<IContentXmlSource>();
        hekatonCache = new Mock<IDistributedCache>();
        config = new Mock<IContentConfiguration>();
        clock = new TestClock { UtcNow = new UtcDateTime(2001, 2, 3, 10, 30) };
        log = new TestLogger<DistributedCacheContentXmlDecorator>();
        target = new DistributedCacheContentXmlDecorator(inner.Object, hekatonCache.Object, config.Object, clock, log);

        mode = TestExecutionMode.Get();
        requestUrl = new HttpUri("http://sitecore/request");
        innerResult = new ContentXml(XElement.Parse(@"<items><item source=""fresh"" /></items>"), TimeSpan.FromSeconds(666), clock.UtcNow - TimeSpan.FromSeconds(2));
        cachedEntry = default;

        config.SetupGet(c => c.CacheTimes.Default).Returns(TimeSpan.FromSeconds(100));
        config.SetupGet(c => c.CacheTimes.SitecoreOutage).Returns(TimeSpan.FromSeconds(10));
        inner.SetupWithAnyArgs(i => i.GetContentXmlAsync(default, null, default, null)).ReturnsAsync(() => innerResult);
        hekatonCache.SetReturnsDefault(Task.FromResult<byte[]>(null));
        hekatonCache.SetupWithAnyArgs(c => c.SetAsync(null, null, null, default))
            .Callback<string, byte[], DistributedCacheEntryOptions, CancellationToken>((k, v, o, t) => cachedEntry = (k, v, o, t))
            .Returns(Task.CompletedTask);
    }

    private readonly IContentXmlSource target;
    private readonly Mock<IContentXmlSource> inner;
    private readonly Mock<IDistributedCache> hekatonCache;
    private readonly Mock<IContentConfiguration> config;
    private readonly TestClock clock;
    private readonly TestLogger<DistributedCacheContentXmlDecorator> log;

    private readonly ExecutionMode mode;
    private readonly HttpUri requestUrl;
    private ContentXml innerResult;
    private (string Key, byte[] Value, DistributedCacheEntryOptions Options, CancellationToken Token) cachedEntry;

    [Theory]
    [InlineData(true, null)]
    [InlineData(false, @"<item source=""fresh"" />")]
    public async Task ShouldReturnFreshContent_IfNothingCached(bool notFoundContent, string cachedItemXml)
    {
        if (notFoundContent) innerResult = new ContentXml(null, innerResult.RelativeExpiration, innerResult.SitecoreLoadTime);

        // Act
        var result = await target.GetContentXmlAsync(mode, requestUrl, true, TraceFunc);

        VerifyFreshInnerResultWasCached(result, cachedItemXml);
        log.VerifyNothingLogged();
    }

    [Theory, BooleanData]
    public async Task ShouldReturnCachedContent_IfWithinExpiration(bool notFoundContent)
    {
        var itemXml = notFoundContent ? "" : @"<item source=""cache"" />";
        var sitecoreLoadTime = TestTime.GetRandomUtc();
        var fullXml = SetupHekatonGet(expiration: TimeSpan.FromSeconds(66), sitecoreLoadTime, itemXml);

        // Act
        var result = await target.GetContentXmlAsync(mode, requestUrl, true, TraceFunc);

        result.Xml.Should().Be(notFoundContent ? null : fullXml);
        result.RelativeExpiration.Should().Be(TimeSpan.FromSeconds(66));
        result.SitecoreLoadTime.Should().Be(sitecoreLoadTime);
        inner.VerifyWithAnyArgs(i => i.GetContentXmlAsync(default, null, default, null), Times.Never);
        log.VerifyNothingLogged();
    }

    [Theory, ValuesData(0, -1)]
    public async Task ShouldReturnFreshContent_IfOverExpiration(int expirationSeconds)
    {
        SetupHekatonGet(TimeSpan.FromSeconds(expirationSeconds));

        // Act
        var result = await target.GetContentXmlAsync(mode, requestUrl, true, TraceFunc);

        VerifyFreshInnerResultWasCached(result);
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldReturnStaleContent_IfOverExpiration_AndSitecoreFailed()
    {
        var xml = SetupHekatonGet(expiration: TimeSpan.FromSeconds(-66));
        var sitecoreEx = new Exception("Sitecore outage.");
        inner.Setup(i => i.GetContentXmlAsync(mode, requestUrl, true, TraceFunc)).ThrowsAsync(sitecoreEx);

        // Act
        var result = await target.GetContentXmlAsync(mode, requestUrl, true, TraceFunc);

        result.Xml.Should().BeEquivalentTo(xml);
        result.RelativeExpiration.Should().Be(TimeSpan.FromSeconds(10));
        log.Logged.Single().Verify(LogLevel.Error, sitecoreEx, ("requestUrl", requestUrl));
    }

    [Fact]
    public Task ShouldReturnFreshContent_IfHekatonGetFailed()
    {
        var hekatonEx = new Exception("Hekaton error.");
        hekatonCache.Setup(c => c.GetAsync(requestUrl.ToString(), mode.AsyncCancellationToken.Value)).ThrowsAsync(hekatonEx);

        return RunFailedCacheRetrievalTest(null, ex => ex == hekatonEx);
    }

    [Fact]
    public Task ShouldReturnFreshContent_IfFailedDeserializingValueFromHekaton()
    {
        hekatonCache.Setup(c => c.GetAsync(requestUrl.ToString(), mode.AsyncCancellationToken.Value)).ReturnsAsync("gibberish".EncodeToBytes());

        return RunFailedCacheRetrievalTest("gibberish", ex => ex is XmlException);
    }

    [Theory, ValuesData("", "gibberish", "2001-02-03T10:41:06" /* not UTC */)]
    public Task ShouldReturnFreshContent_IfInvalidExpiration(string expirationStr)
    {
        var xml = SetupHekatonGet(expirationAttr: expirationStr);

        return RunFailedCacheRetrievalTest(xml.ToString(), ex => ex is FormatException);
    }

    [Theory, ValuesData("gibberish", "2001-02-03T10:41:06" /* not UTC */)]
    public Task ShouldReturnFreshContent_IfInvalidSitecoreLoadTime(string loadTimeStr)
    {
        var xml = SetupHekatonGet(loadTimeAttr: loadTimeStr);

        return RunFailedCacheRetrievalTest(xml.ToString(), ex => ex is FormatException);
    }

    [Fact]
    public async Task ShouldPass_IfMissingSitecoreLoadTime()
    {
        var fullXml = SetupHekatonGet(loadTimeAttr: "");

        // Act
        var result = await target.GetContentXmlAsync(mode, requestUrl, true, TraceFunc);

        result.Xml.Should().Be(fullXml);
        result.SitecoreLoadTime.Should().Be(default);
    }

    private async Task RunFailedCacheRetrievalTest(string reportedContent, Expression<Func<Exception, bool>> loggedExceptionPredicate)
    {
        var result = await target.GetContentXmlAsync(mode, requestUrl, true, TraceFunc); // Act

        VerifyFreshInnerResultWasCached(result);
        log.Logged.Single().Verify(
            LogLevel.Error,
            loggedExceptionPredicate,
            ("requestUrl", requestUrl),
            ("rawData", reportedContent));
    }

    [Fact]
    public void ShouldThrow_IfUnableToGetCachedAndFreshContent()
    {
        var sitecoreEx = new Exception("Sitecore outage.");
        inner.Setup(i => i.GetContentXmlAsync(mode, requestUrl, true, TraceFunc)).ThrowsAsync(sitecoreEx);

        Func<Task> act = () => target.GetContentXmlAsync(mode, requestUrl, true, TraceFunc); // Act

#pragma warning disable xUnit1031
        act.Should().ThrowAsync<Exception>().Result
#pragma warning restore xUnit1031
            .WithMessage($"Failed retrieving content from Sitecore at '{requestUrl}'. Even there isn't any stale content in Hekaton cache or its loading failed.")
            .Which.InnerException.Should().BeSameAs(sitecoreEx);
    }

    [Fact]
    public async Task ShouldNotThrowButLog_IfFailedToSetToHekaton()
    {
        var hekatonEx = new Exception("Hekaton error.");
        hekatonCache.SetupWithAnyArgs(c => c.SetAsync(null, null, null, TestContext.Current.CancellationToken))
            .Callback<string, byte[], DistributedCacheEntryOptions, CancellationToken>((k, v, o, t) => cachedEntry = (k, v, o, t))
            .ThrowsAsync(hekatonEx);

        var result = await target.GetContentXmlAsync(mode, requestUrl, true, TraceFunc); // Act

        VerifyFreshInnerResultWasCached(result);
        log.Logged.Single().Verify(
            LogLevel.Error,
            hekatonEx,
            ("requestUrl", requestUrl),
            ("rawData",
                @"<items absoluteExpiration=""2001-02-03T10:41:06.0000000Z"" sitecoreLoadTime=""2001-02-03T10:29:58.0000000Z""><item source=""fresh"" /></items>"));
    }

    private void VerifyFreshInnerResultWasCached(ContentXml result, string cachedItemXml = @"<item source=""fresh"" />")
    {
        result.Should().BeSameAs(innerResult);
        inner.Verify(i => i.GetContentXmlAsync(mode, requestUrl, true, TraceFunc));
        hekatonCache.Verify(c => c.GetAsync(requestUrl.ToString(), mode.AsyncCancellationToken.Value));

        cachedEntry.Key.Should().Be(requestUrl.ToString());
        cachedEntry.Value.DecodeToString().Should().Be(@"<items absoluteExpiration=""2001-02-03T10:41:06.0000000Z"" sitecoreLoadTime=""2001-02-03T10:29:58.0000000Z"""
                                                       + (cachedItemXml != null ? $">{cachedItemXml}</items>" : " />"));
        cachedEntry.Options.Should().BeEquivalentTo(new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12) });
        cachedEntry.Token.Should().Be(mode.AsyncCancellationToken.Value);
    }

    [Fact]
    public Task ShouldReturnFreshContent_IfNotUsingCache()
        => RunNoCachingTest(useCache: false);

    private async Task RunNoCachingTest(bool useCache = true)
    {
        var result = await target.GetContentXmlAsync(mode, requestUrl, useCache, TraceFunc); // Act

        result.Should().Be(innerResult);
        inner.Verify(i => i.GetContentXmlAsync(mode, requestUrl, useCache, TraceFunc));
        hekatonCache.VerifyWithAnyArgs(c => c.GetAsync(null, default), Times.Never);
        hekatonCache.VerifyWithAnyArgs(c => c.SetAsync(null, null, null, default), Times.Never);
        log.VerifyNothingLogged();
    }

    private XElement SetupHekatonGet(TimeSpan expiration, UtcDateTime? loadTime = null, string itemXml = null)
        => SetupHekatonGet((clock.UtcNow + expiration).ToString(), loadTime?.ToString(), itemXml);

    private XElement SetupHekatonGet(string expirationAttr = null, string loadTimeAttr = null, string itemXml = null)
    {
        expirationAttr ??= (clock.UtcNow + TimeSpan.FromSeconds(66)).ToString();
        loadTimeAttr ??= (clock.UtcNow - TimeSpan.FromSeconds(30)).ToString();
        itemXml ??= @"<item source=""cache"" />";

        var xml = XElement.Parse($@"<items
                {DistributedCacheContentXmlDecorator.AbsoluteExpirationAttribute}=""{expirationAttr}""
                {DistributedCacheContentXmlDecorator.SitecoreLoadTimeAttribute}=""{loadTimeAttr}""
                >{itemXml}</items>");

        hekatonCache.Setup(c => c.GetAsync(requestUrl.ToString(), mode.AsyncCancellationToken.Value)).ReturnsAsync(xml.ToString().EncodeToBytes());

        return xml;
    }
}
