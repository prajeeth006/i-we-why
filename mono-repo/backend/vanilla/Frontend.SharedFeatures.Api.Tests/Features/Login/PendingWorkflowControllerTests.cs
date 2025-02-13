using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Login;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Login;

public class PendingWorkflowControllerTests
{
    private readonly TestLogger<PendingWorkflowController> logMock;
    private readonly PendingWorkflowRequest request;
    private readonly Mock<ILoginService> workflowHandlerMock;
    private readonly Mock<IProductPlaceholderReplacer> productPlaceholderReplacerMock;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private readonly Mock<ILoginService> loginHelperServiceMock;
    private readonly Mock<ILoginResultHandlerInternal> loginResultHandlerMock;

    public PendingWorkflowControllerTests()
    {
        productPlaceholderReplacerMock = new Mock<IProductPlaceholderReplacer>();
        loginHelperServiceMock = new Mock<ILoginService>();
        logMock = new TestLogger<PendingWorkflowController>();
        loginResultHandlerMock = new Mock<ILoginResultHandlerInternal>();

        request = new PendingWorkflowRequest
        {
            NativeClientSessionKey = "sk",
            NativeClientUsertoken = "ut",
        };

        workflowHandlerMock = new Mock<ILoginService>();
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
    }

    private PendingWorkflowController GetController()
    {
        return new PendingWorkflowController(
            loginResultHandlerMock.Object,
            workflowHandlerMock.Object,
            productPlaceholderReplacerMock.Object,
            currentUserAccessorMock.Object,
            logMock);
    }

    [Fact]
    public async Task Post_Succeeds_WhenUserAuthenticated()
    {
        var controller = GetController();

        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OkObjectResult(new LoginResponse()
            {
                IsCompleted = true,
            }));

        var result = (OkObjectResult)await controller.Post(request, It.IsAny<CancellationToken>());
        result.Value.Should().BeEquivalentTo(new { IsCompleted = true });
    }

    [Fact]
    public async Task Post_Succeeds_WhenWorkflowPresent()
    {
        var controller = GetController();
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OkObjectResult(new LoginResponse()
            {
                IsCompleted = false,
            }));

        var result = (OkObjectResult)await controller.Post(request, It.IsAny<CancellationToken>());
        result.Value.Should().BeEquivalentTo(new { IsCompleted = false });
    }

    [Fact]
    public async Task Post_Fails_WithServiceException()
    {
        var controller = GetController();
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new BadRequestResult());

        var result = await controller.Post(request, It.IsAny<CancellationToken>());

        result.Should().NotBeNull();
        var response = result.GetOriginalResult<BadRequestResult>();
        response.Should().NotBeNull();
    }

    [Fact]
    public async Task Post_Succeeds_WhenNoWorkflowPresent()
    {
        var controller = GetController();
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OkObjectResult(new LoginResponse
            {
                IsCompleted = true,
            }));
        var result = (OkObjectResult)await controller.Post(request, It.IsAny<CancellationToken>());
        result.Value.Should().BeEquivalentTo(new { IsCompleted = true });
    }

    [Fact]
    public async Task PostLogin_Succeeds_WhenWorkflowPresent()
    {
        var controller = GetController();
        workflowHandlerMock.Setup(f => f.GetNextPostLoginRedirectAsync(It.IsAny<ExecutionMode>()))
            .ReturnsAsync(new KeyValuePair<string, PostLoginRedirect>("redirectTerms", new PostLoginRedirect()
            {
                Url = "testweb.com",
            }));
        productPlaceholderReplacerMock.Setup(c => c.ReplaceAsync(It.IsAny<ExecutionMode>(), "testweb.com"))
            .ReturnsAsync("https://testweb.com");

        var result = (OkObjectResult)await controller.GetPostLogin(It.IsAny<CancellationToken>());
        result.Value.Should().BeEquivalentTo(new { isCompleted = false, redirectUrl = "https://testweb.com" });
    }
}
