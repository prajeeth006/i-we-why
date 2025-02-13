using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm.SignUpBonuses;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.SignUpBonuses;

public class SignUpBonusServiceClientTestsBase : ServiceClientTestsBase
{
    private ISignUpBonusServiceClient target;

    protected override void Setup()
        => target = new SignUpBonusServiceClient(RestClient.Object, Cache.Object);

    [Fact]
    public async Task ShouldReturnTrue_IfSuccessResponse()
    {
        // Act
        var bonusExists = await target.BonusExistsAsync(TestMode, 666, "Hell");

        bonusExists.Should().BeTrue();
        VerifyRestClient_ExecuteAsync("CRM.svc/BonusFlowContent?trackerId=666&stage=Hell&language=sw-KE");
        VerifyCache_GetOrCreateAsync<bool>(PosApiDataType.Static, "SignUpBonusExists:Hell:666:sw-KE");
    }

    [Fact]
    public async Task ShouldReturnFalse_IfNotFoundPosApiCode()
    {
        RestClient.SetupWithAnyArgs(c => c.Execute(default, null, null)).Throws(new PosApiException(posApiCode: SignUpBonusServiceClient.BonusNotFoundPosApiCode));

        // Act
        var bonusExists = await target.BonusExistsAsync(TestMode, 666, "Hell");

        bonusExists.Should().BeFalse();
        VerifyCache_GetOrCreateAsync<bool>(PosApiDataType.Static, "SignUpBonusExists:Hell:666:sw-KE");
    }

    [Fact]
    public async Task ShouldThrow_IfOtherPosApiError()
    {
        var paex = new PosApiException(posApiCode: 666);
        RestClient.SetupWithAnyArgs(c => c.Execute(default, null, null)).Throws(paex);

        Func<Task> act = () => target.BonusExistsAsync(TestMode, 666, "Hell");

        (await act.Should().ThrowAsync<Exception>()).SameAs(paex);
    }
}
