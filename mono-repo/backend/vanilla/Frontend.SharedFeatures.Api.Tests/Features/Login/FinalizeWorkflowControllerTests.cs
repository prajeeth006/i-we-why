using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Login;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using LoginResponse = Frontend.Vanilla.Features.Login.LoginResponse;

namespace Frontend.SharedFeatures.Api.Tests.Features.Login;

public class FinalizeWorkflowControllerTests
{
    private readonly FinalizeWorkflowController finalizeWorkflowController;
    private readonly Mock<ILoginService> loginHelperServiceMock;
    private readonly Mock<ILoginResultHandlerInternal> loginResultHandlerMock;

    public FinalizeWorkflowControllerTests()
    {
        loginResultHandlerMock = new Mock<ILoginResultHandlerInternal>();
        loginHelperServiceMock = new Mock<ILoginService>();
        finalizeWorkflowController = new FinalizeWorkflowController(loginResultHandlerMock.Object);
    }

    [Fact]
    public async Task Post_Succeeds_WhenFinalizingSuccessful()
    {
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OkObjectResult(new LoginResponse
            {
                IsCompleted = true,
            }));

        var result = (OkObjectResult)await finalizeWorkflowController.Post(new WorkflowParameters(), It.IsAny<CancellationToken>());

        result.Value.Should().BeEquivalentTo(new { IsCompleted = true });
    }

    [Fact]
    public async Task Post_ReturnsError_WhenFinalizeWorkflowFails()
    {
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new BadRequestResult().WithErrorMessage("errormessage"));

        var result = await finalizeWorkflowController.Post(new WorkflowParameters(), It.IsAny<CancellationToken>());

        result.Should().NotBeNull();
        var response = result.GetOriginalResult<BadRequestResult>();
        response.Should().NotBeNull();
    }

    [Fact]
    public async Task Post_ReturnsWithAnotherWorkflow_WhenFinalizeWorkflowFails()
    {
        const string workflowUrl = "workflow/url";

        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OkObjectResult(new LoginResponse()
            {
                IsCompleted = false,
                RedirectUrl = workflowUrl,
            }));

        var result = (OkObjectResult)await finalizeWorkflowController.Post(new WorkflowParameters(), It.IsAny<CancellationToken>());
        result.Value.Should().BeEquivalentTo(new { IsCompleted = false, RedirectUrl = workflowUrl });
    }

    [Fact]
    public async Task Post_ReturnsError_WhenFinalizeWorkflowResultsInServiceException()
    {
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new BadRequestResult().WithErrorMessage("FatalError"));

        var result = await finalizeWorkflowController.Post(new WorkflowParameters(), It.IsAny<CancellationToken>());

        result.Should().NotBeNull();
        var response = result.GetOriginalResult<BadRequestResult>();
        response.Should().NotBeNull();
    }
}
