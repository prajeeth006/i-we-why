using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ReferredFriends;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.InvitationUrl;
using Frontend.Vanilla.Testing.AbstractTests;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Crm = Frontend.Vanilla.ServiceClients.Services.Crm.ReferredFriends;

namespace Frontend.Vanilla.Features.Tests.ReferredFriends;

public class ReferredFriendsClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IVanillaClientContentService> vanillaClientContentServiceMock;
    private readonly Mock<IMenuFactory> menuFactoryMock;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmServiceInternalMock;
    private readonly Mock<ILogger<ReferredFriendsClientConfigProvider>> logMock;

    private readonly List<ClientDocument> content = [new ()];
    private readonly MenuItem menuItem = new ();
    private readonly Crm.ReferredFriends referredFriends = new ();
    private readonly InvitationUrl invitationUrl = new ();

    public ReferredFriendsClientConfigProviderTests()
    {
        vanillaClientContentServiceMock = new Mock<IVanillaClientContentService>();
        menuFactoryMock = new Mock<IMenuFactory>();
        posApiCrmServiceInternalMock = new Mock<IPosApiCrmServiceInternal>();
        logMock = new Mock<ILogger<ReferredFriendsClientConfigProvider>>();

        menuFactoryMock.Setup(c => c.GetItemAsync($"{AppPlugin.ContentRoot}/ReferredFriends/DetailsButton", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(menuItem);
        menuFactoryMock.Setup(c => c.GetItemAsync($"{AppPlugin.ContentRoot}/ReferredFriends/TrackReferralsButton", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(menuItem);
        menuFactoryMock.Setup(c => c.GetItemAsync($"{AppPlugin.ContentRoot}/ReferredFriends/ShareContent", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(menuItem);
        vanillaClientContentServiceMock.Setup(c => c.GetChildrenAsync($"{AppPlugin.ContentRoot}/ReferredFriends/Content", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(content);
        posApiCrmServiceInternalMock.Setup(s => s.GetReferredFriendsAsync(ExecutionMode.Async(Ct), It.IsAny<bool>()))
            .ReturnsAsync(referredFriends);
        posApiCrmServiceInternalMock.Setup(s => s.GetInvitationUrlAsync(ExecutionMode.Async(Ct), It.IsAny<bool>()))
            .ReturnsAsync(invitationUrl);

        Target = new ReferredFriendsClientConfigProvider(
            vanillaClientContentServiceMock.Object,
            menuFactoryMock.Object,
            posApiCrmServiceInternalMock.Object,
            logMock.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnReferredFriendsContent()
    {
        var config = await Target_GetConfigAsync();

        config["content"].Should().BeEquivalentTo(content.ToDictionary(item => item.InternalId?.ItemName ?? string.Empty));
        config["detailsButton"].Should().BeSameAs(menuItem);
        config["trackReferralsButton"].Should().BeSameAs(menuItem);
        config["shareContent"].Should().BeSameAs(menuItem);
        config["referredFriends"].Should().BeSameAs(referredFriends);
        config["invitationUrl"].Should().BeSameAs(invitationUrl);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnEmptyResult_When404()
    {
        posApiCrmServiceInternalMock.Setup(s => s.GetReferredFriendsAsync(ExecutionMode.Async(Ct), It.IsAny<bool>()))
            .ThrowsAsync(new PosApiException(message: "Not Found", posApiCode: 404));

        var config = await Target_GetConfigAsync();

        config["referredFriends"].Should().BeOfType<Crm.ReferredFriends>();
    }
}
