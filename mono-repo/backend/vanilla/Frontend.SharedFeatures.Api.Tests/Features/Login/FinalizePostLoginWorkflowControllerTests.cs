using System.Security.Principal;
using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Login;
using Frontend.Vanilla.Features.Login;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Login;

public class FinalizePostLoginWorkflowControllerTests
{
    private readonly FinalizePostLoginWorkflowController target;
    private readonly Mock<IIdentity> identityMock;
    private readonly Mock<ILoginService> loginHelperServiceMock;
    private readonly Mock<ILoginResultHandlerInternal> loginResultHandlerMock;

    public FinalizePostLoginWorkflowControllerTests()
    {
        loginResultHandlerMock = new Mock<ILoginResultHandlerInternal>();
        loginHelperServiceMock = new Mock<ILoginService>();

        var userMock = new Mock<IPrincipal>();
        identityMock = new Mock<IIdentity>();
        userMock.SetupGet(u => u.Identity).Returns(identityMock.Object);
        identityMock.SetupGet(i => i.IsAuthenticated).Returns(false);

        target = new FinalizePostLoginWorkflowController(loginResultHandlerMock.Object);

        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OkObjectResult(new LoginResponse()
            {
                IsCompleted = true,
            }));
    }

    [Fact]
    public async Task Post_Succeeds_WhenFinalizingSuccessful()
    {
        var result = (OkObjectResult)await target.Post(It.IsAny<object>(), It.IsAny<CancellationToken>());
        result.Value.Should().BeEquivalentTo(new { IsCompleted = true });
    }

    [Fact]
    public async Task LoginAction_Succeeds_WhenFinalizePostLoginWorkflowSuccessful()
    {
        loginHelperServiceMock.Setup(f => f.FinalizePostLoginWorkflow(It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(new LoginInfo
            {
                Status = LoginStatus.Success,
            }));

        var result = (OkObjectResult)await target.Post(It.IsAny<object>(), It.IsAny<CancellationToken>());

        result.Should().NotBeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
        result.Value.Should().BeEquivalentTo(new LoginResponse() { IsCompleted = true });
    }
}
