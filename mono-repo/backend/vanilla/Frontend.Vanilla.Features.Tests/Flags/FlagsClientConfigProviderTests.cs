using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Flags;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Flags;

public class FlagsClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IContentService> contentService;
    private static readonly DocumentId FlagDocument = new ("foo");
    private IPCImage flag;

    public FlagsClientConfigProviderTests()
    {
        contentService = new Mock<IContentService>();
        Target = new FlagsClientConfigProvider(contentService.Object);
        contentService.Setup(s => s.GetChildrenAsync<IPCImage>("App-v1.0/flags", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(new[] { flag });
    }

    [Fact]
    public async Task ShouldReturnFlags()
    {
        flag = Mock.Of<IPCImage>(p => p.Metadata.Id == FlagDocument && p.Parameters == new ContentParameters(new Dictionary<string, string>()) && p.Image == new ContentImage("www.google.com", "", 50, 60));
        contentService.Setup(s => s.GetChildrenAsync<IPCImage>("App-v1.0/flags", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(new[] { flag });

        var config = await Target_GetConfigAsync();

        config["flags"].Should().BeEquivalentTo(new Dictionary<string, string> { ["foo"] = "www.google.com" });
    }
}
