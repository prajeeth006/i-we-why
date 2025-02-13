using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Login;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Login;

public class WorkflowDataControllerTests
{
    private Mock<IPosApiAuthenticationServiceInternal> authServiceMock;
    private TestLogger<WorkflowDataController> logMock;
    private WorkflowDataController target;

    public WorkflowDataControllerTests()
    {
        authServiceMock = new Mock<IPosApiAuthenticationServiceInternal>();
        logMock = new TestLogger<WorkflowDataController>();
        target = new WorkflowDataController(logMock, authServiceMock.Object);
    }

    [Fact]
    public async Task Post_ShouldSentWorkflowDataAndReturn200ok()
    {
        var request = new List<KeyValuePair<string, string>> { new KeyValuePair<string, string>("StubKey01", "StubValue01") };

        var response = await target.Post(request, CancellationToken.None);

        response.GetOriginalResult<OkObjectResult>().Should().NotBeNull();
    }

    [Fact]
    public async Task Post_ShouldMapExceptionToResponseError()
    {
        var request = new List<KeyValuePair<string, string>> { new KeyValuePair<string, string>("StubKey01", "StubValue01") };

        authServiceMock.Setup(m => m.AddWorkflowDataAsync(It.IsAny<IReadOnlyDictionary<string, string>>(), It.IsAny<CancellationToken>())).Throws(new Exception());

        var response = await target.Post(request, CancellationToken.None);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
        response.GetResultsOfType<TechnicalErrorMessageResult>().Should().NotBeNull();
    }
}
