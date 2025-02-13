using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Features.ConfirmPopup;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ConfirmPopup;

public class ConfirmPopupClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IVanillaClientContentService> clientContentService;

    public ConfirmPopupClientConfigProviderTests()
    {
        clientContentService = new Mock<IVanillaClientContentService>();

        Target = new ConfirmPopupClientConfigProvider(clientContentService.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnConfig()
    {
        var message = new ClientViewTemplate();
        clientContentService.Setup(c => c.GetAsync("App-v1.0/ConfirmPopup/Resources", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(message);

        var config = await Target_GetConfigAsync(); // Act

        config.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "resources", message },
        });
        clientContentService.Verify(c => c.GetAsync(It.Is<DocumentId>(c => c.Path.Contains("App-v1.0/ConfirmPopup/Resources", StringComparison.OrdinalIgnoreCase)), Ct, It.IsAny<ContentLoadOptions>()));
    }
}
