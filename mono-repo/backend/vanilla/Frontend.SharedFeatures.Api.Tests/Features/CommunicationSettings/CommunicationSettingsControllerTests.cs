using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.CommunicationSettings;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Account.CommunicationSettings;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.CommunicationSettings;

public class CommunicationSettingsControllerTests
{
    private readonly CommunicationSettingsController target;
    private readonly Mock<ICommunicationSettingsServiceClient> serviceClient;
    private readonly TestLogger<CommunicationSettingsController> log;
    private readonly CancellationToken ct;

    public CommunicationSettingsControllerTests()
    {
        serviceClient = new Mock<ICommunicationSettingsServiceClient>();
        log = new TestLogger<CommunicationSettingsController>();
        target = new CommunicationSettingsController(serviceClient.Object, log);
        ct = TestCancellationToken.Get();
    }

    [Fact]
    public async Task ShouldGetCommunicationSettings()
    {
        var communicationTypes = new[] { new CommunicationType(), new CommunicationType() };
        serviceClient.Setup(s => s.GetCachedAsync(ExecutionMode.Async(ct))).ReturnsAsync(communicationTypes);

        var result = await target.Get(ct); // Act

        var content = (object)result.GetOriginalResult().Value.settings;
        content.Should().BeSameAs(communicationTypes);
    }

    [Fact]
    public async Task ShouldReturnServerError_IfException()
    {
        var ex = new Exception("PosAPI error.");
        serviceClient.Setup(s => s.GetCachedAsync(ExecutionMode.Async(ct))).ThrowsAsync(ex);

        var result = (StatusCodeResult)await target.Get(ct); // Act

        result.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }
}
