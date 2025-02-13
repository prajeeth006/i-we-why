using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Infrastructure;

public class ClientContentRegionalResolverTests
{
    private IClientContentRegionalResolver target;
    private Mock<IContentRegionResolver> contentRegionResolver;

    public ClientContentRegionalResolverTests()
    {
        contentRegionResolver = new Mock<IContentRegionResolver>();

        target = new ClientContentRegionalResolver(contentRegionResolver.Object);
    }

    [Theory]
    [InlineData("en", "US", "enuspath;enstarpath;staruspath")]
    [InlineData("en", "GB", "enstarpath")]
    [InlineData("de", "GB", "")]
    [InlineData("de", "AT", "deatpath")]
    public void Resolve_ShouldResolvePathBasedOnCultureAndLanguage(string language, string country, string expectedPaths)
    {
        contentRegionResolver.Setup(r => r.GetUserCountryCode()).Returns(country);
        contentRegionResolver.Setup(r => r.GetCurrentLanguageCode()).Returns(language);

        var result = target.Resolve(
            new List<KeyValuePair<string, DocumentId>>
            {
                new KeyValuePair<string, DocumentId>("en|US", "enuspath"),
                new KeyValuePair<string, DocumentId>("en|*", "enstarpath"),
                new KeyValuePair<string, DocumentId>("*|US", "staruspath"),
                new KeyValuePair<string, DocumentId>("de|AT", "deatpath"),
            });

        result.Should().BeEquivalentTo(expectedPaths.Split(';').Where(s => !string.IsNullOrEmpty(s)).Select(s => (DocumentId)s));
    }
}
