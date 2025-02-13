using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.CommonMessages;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.CommonMessages;

public class CommonMessagesClientConfigProviderTests
{
    [Fact]
    public async Task GetClientConfiguration_ReturnsConfig()
    {
        var clientContentService = new Mock<IContentService>();
        var viewTemplate = new Mock<IViewTemplate>();
        viewTemplate.Setup(o => o.Messages).Returns(new Dictionary<string, string> { { "TechnicalError", "general technical error" } }.AsContentParameters());
        clientContentService.Setup(o => o.GetRequiredAsync<IViewTemplate>(It.IsAny<DocumentId>(), It.IsAny<CancellationToken>(), It.IsAny<ContentLoadOptions>()))
            .Returns(Task.FromResult(viewTemplate.Object));

        var provider = new CommonMessagesClientConfigProvider(clientContentService.Object);

        var clientConfiguration = await provider.GetClientConfigAsync(CancellationToken.None);

        clientConfiguration.Should().NotBeNull();
    }
}
