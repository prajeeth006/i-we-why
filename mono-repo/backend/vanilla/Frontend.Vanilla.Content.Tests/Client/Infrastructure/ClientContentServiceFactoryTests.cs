using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Infrastructure;

internal interface IWrongClientContentService : IClientContentService
{
    void A();
}

public class ClientContentServiceFactoryTests
{
    private readonly IClientContentServiceFactory clientContentServiceFactory;
    private readonly Mock<IContentService> contentService;
    private readonly Mock<IMenuFactory> menuFactory;
    private readonly TestLogger<ClientContentService> log;

    public ClientContentServiceFactoryTests()
    {
        contentService = new Mock<IContentService>();
        menuFactory = new Mock<IMenuFactory>();
        log = new TestLogger<ClientContentService>();
        clientContentServiceFactory = new ClientContentServiceFactory(
            contentService.Object,
            menuFactory.Object,
            log,
            new List<ClientContentMapping>());
    }

    [Fact]
    public void CreateService_ShouldThrowErrorWhenTryingToMapToInterfaceWithAdditionalMethods()
    {
        Action action = () => clientContentServiceFactory.CreateService<IWrongClientContentService>();
        action.Should().Throw<ArgumentException>().And.Message.Should()
            .Be(
                "Error creating an instance of ClientContentService. The specified interface IWrongClientContentService cannot have any additional methods or properties, but [ A ] were found. (Parameter 'TInterface')");
    }
}
