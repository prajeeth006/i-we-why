using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.MetaTags;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.MetaTags;

public class MetaTagsClientConfigProviderTests
{
    private IClientConfigProvider target;
    private IMetaTagsConfiguration config;

    public MetaTagsClientConfigProviderTests()
    {
        config = Mock.Of<IMetaTagsConfiguration>(c => c.PageMetaTags == new PageMetaTagsRule[5] && c.GlobalMetaTags == new GlobalMetaTagsRule[6]);
        target = new MetaTagsClientConfigProvider(config);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnServerConfig()
    {
        dynamic result = await target.GetClientConfigAsync(TestContext.Current.CancellationToken); // Act

        ((object)result.PageMetaTags).Should().BeSameAs(config.PageMetaTags);
    }
}
