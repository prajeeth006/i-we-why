using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Login;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using LoginResponse = Frontend.Vanilla.Features.Login.LoginResponse;

namespace Frontend.SharedFeatures.Api.Tests.Features.Login;

public class SkipWorkflowControllerTests
{
    private readonly SkipWorkflowController target;
    private readonly Mock<ILoginService> loginHelperServiceMock;
    private readonly Mock<ILoginResultHandlerInternal> loginResultHandlerMock;

    public SkipWorkflowControllerTests()
    {
        loginHelperServiceMock = new Mock<ILoginService>();
        loginResultHandlerMock = new Mock<ILoginResultHandlerInternal>();

        target = new SkipWorkflowController(loginResultHandlerMock.Object);
    }

    [Fact]
    public async Task Get_Succeeds_WhenSkipWorkflowSuccessful()
    {
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OkObjectResult(new LoginResponse()
            {
                IsCompleted = true,
            }));

        var result = (OkObjectResult)await target.Post(new WorkflowParameters(), It.IsAny<CancellationToken>());

        result.Value.Should().BeEquivalentTo(new { IsCompleted = true });
    }
}
