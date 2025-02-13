using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Features.WebUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.TrackerId;

public class TrackerIdQueryParameterTests
{
    [Theory]
    [InlineData("", null)]
    [InlineData("?", null)]
    [InlineData("?q=111&p=abc", null)]
    [InlineData("?trc=", null)]
    [InlineData("?trc=  &wmid=", null)]
    [InlineData("?trc=111", "111")]
    [InlineData("?wmid=111", "111")]
    [InlineData("?TRC=111", "111")]
    [InlineData("?trc=111&wmid=222", "111")]
    [InlineData("?wmid=222&trc=111", "111")]
    public void RunTest(string urlQuery, string expected)
    {
        var browserUrlProvider = new Mock<IBrowserUrlProvider>();
        var config = new TrackerIdConfiguration();
        ITrackerIdQueryParameter target = new TrackerIdQueryParameter(browserUrlProvider.Object, config);

        browserUrlProvider.SetupGet(r => r.Url).Returns(new HttpUri("http://www.bwin.com/en/page" + urlQuery));
        config.QueryStrings = new[] { "trc", "wmid" };

        // Act
        var value = target.GetValue();

        value?.Value.Should().Be(expected);
    }
}
