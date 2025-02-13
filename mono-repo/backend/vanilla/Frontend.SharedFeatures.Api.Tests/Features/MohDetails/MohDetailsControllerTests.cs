using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.MohDetails;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.MohDetails;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.MohDetails;

public class MohDetailsControllerTests
{
    private readonly Mock<IPosApiAccountServiceInternal> posApiAccountServiceInternal;
    private readonly CancellationToken ct;
    private readonly TestLogger<MohDetailsController> log;
    private readonly MohDetailsController target;

    public MohDetailsControllerTests()
    {
        ct = new CancellationTokenSource().Token;
        posApiAccountServiceInternal = new Mock<IPosApiAccountServiceInternal>();
        log = new TestLogger<MohDetailsController>();
        target = new MohDetailsController(posApiAccountServiceInternal.Object, log);
    }

    [Fact]
    public async Task Get_ShouldReturnOK_OnSuccess()
    {
        posApiAccountServiceInternal.Setup(o => o.GetMohDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()))
            .Returns(Task.FromResult(new MohDetailsResponse("test")));

        var response = await target.Get(ct);

        response.Should().BeOfType<OkObjectResult>();
        posApiAccountServiceInternal.Verify(o => o.GetMohDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()));
    }

    [Fact]
    public async Task Get_ShouldReturnError_OnPosApiException()
    {
        posApiAccountServiceInternal.Setup(o => o.GetMohDetailsAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()))
            .Throws(new PosApiException(posApiCode: 55, posApiMessage: "Error"));

        var response = await target.Get(ct);

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }
}
