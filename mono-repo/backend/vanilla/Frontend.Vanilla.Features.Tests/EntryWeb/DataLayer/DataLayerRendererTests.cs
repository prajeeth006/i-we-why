using FluentAssertions;
using Frontend.Vanilla.Features.EntryWeb.DataLayer;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.DataLayer;

public class DataLayerRendererTests
{
    private IDataLayerRenderer target;

    public DataLayerRendererTests()
    {
        var config = new TrackingConfiguration();
        target = new DataLayerRenderer(config);

        config.GoogleTagManagerContainerId = "GTM-FOO";
        config.DataLayerName = "testDataLayer";
    }

    [Fact]
    public void ShouldRenderDataLayer()
    {
        var markup = target.GetDataLayerMarkup(); // Act

        markup.Should().Be("<script type=\"text/javascript\">var testDataLayer = [];</script>");
    }
}
