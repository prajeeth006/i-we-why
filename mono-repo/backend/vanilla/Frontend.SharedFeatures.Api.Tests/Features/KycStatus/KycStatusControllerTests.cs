using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.KycStatus;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Kyc;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.CashierStatuses;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.ServiceClients.Services.Kyc;
using Frontend.Vanilla.ServiceClients.Services.Upload;
using Frontend.Vanilla.ServiceClients.Services.Upload.DocumentUploadStatus;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using KeyValue = Frontend.Vanilla.ServiceClients.Services.Crm2.Models.KeyValue;

namespace Frontend.SharedFeatures.Api.Tests.Features.KycStatus;

public class KycStatusControllerTests
{
    private readonly KycStatusController target;
    private readonly Mock<IKycService> kycServiceMock;
    private readonly Mock<IPosApiWalletServiceInternal> walletServiceMock;
    private readonly Mock<ICrmService> crmServiceMock;
    private readonly Mock<IPosApiUploadServiceInternal> posApiUploadServiceInternalMock;
    private readonly Mock<IPosApiAccountService> accountServiceMock;
    private readonly Mock<IPosApiAuthenticationService> authenticationService;
    private readonly Mock<IKycConfiguration> configMock;
    private readonly CancellationToken ct;
    private readonly TestLogger<KycStatusController> log;

    public KycStatusControllerTests()
    {
        kycServiceMock = new Mock<IKycService>();
        walletServiceMock = new Mock<IPosApiWalletServiceInternal>();
        crmServiceMock = new Mock<ICrmService>();
        posApiUploadServiceInternalMock = new Mock<IPosApiUploadServiceInternal>();
        accountServiceMock = new Mock<IPosApiAccountService>();
        authenticationService = new Mock<IPosApiAuthenticationService>();
        configMock = new Mock<IKycConfiguration>();
        ct = TestCancellationToken.Get();
        log = new TestLogger<KycStatusController>();

        target = new KycStatusController(
            kycServiceMock.Object,
            walletServiceMock.Object,
            crmServiceMock.Object,
            posApiUploadServiceInternalMock.Object,
            accountServiceMock.Object,
            authenticationService.Object,
            configMock.Object,
            log);

        kycServiceMock.Setup(o => o.GetKycStatusAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>()))
            .Returns(Task.FromResult<IKycStatus>(new PosApiKycStatus()));

        kycServiceMock.Setup(o => o.GetKycInfoForRibbonAsync(It.IsAny<ExecutionMode>()))
            .Returns(Task.FromResult<IKycInfoForRibbon>(new PosApiKycInfoForRibbon()));

        walletServiceMock.Setup(o => o.IsBankAccountRegisteredAsync(It.IsAny<ExecutionMode>(), false))
            .Returns(Task.FromResult(true));

        crmServiceMock.Setup(o => o.GetOfferedBonusesAsync(It.IsAny<ExecutionMode>()))
            .Returns(Task.FromResult<IReadOnlyList<Vanilla.ServiceClients.Services.Crm2.Bonus>>(
                Array.Empty<Vanilla.ServiceClients.Services.Crm2.Bonus>()));

        posApiUploadServiceInternalMock
            .Setup(o => o.GetDocumentUploadStatusAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>(), "testCase"))
            .Returns(Task.FromResult(new DocumentUploadStatusResponse(isPending: true, docsPendingWith: "CS")));

        accountServiceMock.Setup(o => o.GetCashierStatusAsync(It.IsAny<ExecutionMode>()))
            .ReturnsAsync(new CashierStatus(true));

        authenticationService.Setup(s => s.GetCommVerificationStatusAsync(ct, false))
            .ReturnsAsync(new Dictionary<string, string> { ["Email"] = "verified" });
    }

    [Fact]
    public async Task Get_ShouldReturnKycData()
    {
        var result = (OkObjectResult)await target.Get(ct, false, "testCase");

        result.Value.Should().BeEquivalentTo(new
        {
            accountStatus = "Unknown",
            accountVerificationIsRequired = false,
            AdditionalKycInfo = new List<KeyValue>(),
            addressVerificationStatus = "Unknown",
            ageVerificationStatus = "Unknown",
            AmlVerificationStatus = "Unknown",
            bankAccountIsRegistered = false,
            bankIdVerificationStatus = "Unknown",
            BlackListVerificationStatus = "Unknown",
            Custom3 = "Unknown",
            Custom4 = "Unknown",
            DepositGraceDays = -1,
            depositSuppressed = true,
            DocsPendingWith = "CS",
            documentUploadStatusIsPending = true,
            emailVerificationStatus = "Unknown",
            F2FVerificationRequired = false,
            GraceDaysBeforeNextAction = -1,
            IdVerificationGraceDays = -1,
            idVerificationStatus = "Unknown",
            isBlackListAttempted = false,
            isCommVerified = true,
            IsKycStarted = false,
            isTransitionPlayer = false,
            KycAttempts = -1,
            KycMaxAttempts = -1,
            KycMaxAttemptsReached = false,
            KycVerified = false,
            PartiallyVerified = false,
            personalIdVerificationStatus = "Unknown",
            secretPinVerificationStatus = "Unknown",
            SsnVerificationAttempts = -1,
            SsnVerificationMaxAttempts = -1,
            SsnVerificationMaxAttemptsReached = false,
            ssnVerificationStatus = "Unknown",
            ThirdPartyVerificationStatus = "Unknown",
            userHasBonuses = false,
            VerificationDaysLeft = -1,
            verificationStatus = "Unknown",
            verificationType = "Unspecified",
        });
    }

    [Fact]
    public async Task Get_IsCommVerified_ShouldBeFalseIfNothingIsVerified()
    {
        authenticationService.Setup(s => s.GetCommVerificationStatusAsync(ct, false))
            .ReturnsAsync(new Dictionary<string, string> { ["Email"] = "pending", ["Phone"] = "pending" });

        var result = (OkObjectResult)await target.Get(ct, false, "testCase");

        result.Value.Should().BeEquivalentTo(new
        {
            accountStatus = "Unknown",
            accountVerificationIsRequired = false,
            AdditionalKycInfo = new List<KeyValue>(),
            addressVerificationStatus = "Unknown",
            ageVerificationStatus = "Unknown",
            AmlVerificationStatus = "Unknown",
            bankAccountIsRegistered = false,
            bankIdVerificationStatus = "Unknown",
            BlackListVerificationStatus = "Unknown",
            Custom3 = "Unknown",
            Custom4 = "Unknown",
            DepositGraceDays = -1,
            depositSuppressed = true,
            DocsPendingWith = "CS",
            documentUploadStatusIsPending = true,
            emailVerificationStatus = "Unknown",
            F2FVerificationRequired = false,
            GraceDaysBeforeNextAction = -1,
            IdVerificationGraceDays = -1,
            idVerificationStatus = "Unknown",
            isBlackListAttempted = false,
            isCommVerified = false,
            IsKycStarted = false,
            isTransitionPlayer = false,
            KycAttempts = -1,
            KycMaxAttempts = -1,
            KycMaxAttemptsReached = false,
            KycVerified = false,
            PartiallyVerified = false,
            personalIdVerificationStatus = "Unknown",
            secretPinVerificationStatus = "Unknown",
            SsnVerificationAttempts = -1,
            SsnVerificationMaxAttempts = -1,
            SsnVerificationMaxAttemptsReached = false,
            ssnVerificationStatus = "Unknown",
            ThirdPartyVerificationStatus = "Unknown",
            userHasBonuses = false,
            VerificationDaysLeft = -1,
            verificationStatus = "Unknown",
            verificationType = "Unspecified",
        });
    }

    [Fact]
    public async Task Get_ShouldReturnRibbonData()
    {
        authenticationService.Setup(s => s.GetCommVerificationStatusAsync(ct, false))
            .ReturnsAsync(new Dictionary<string, string> { ["Email"] = "pending", ["Phone"] = "pending" });
        configMock.Setup(o => o.IsRibbonStatusEnabled).Returns(true);

        var result = (OkObjectResult)await target.Get(ct, false, "testCase");

        result.Value.Should().BeEquivalentTo(new
        {
            accountStatus = "Unknown",
            accountVerificationIsRequired = false,
            AdditionalKycInfo = new List<KeyValue>(),
            additionalRibbonInfo = new List<KeyValue>(),
            addressVerificationStatus = "Unknown",
            ageVerificationStatus = "Unknown",
            AmlVerificationStatus = "Unknown",
            bankAccountIsRegistered = false,
            bankIdVerificationStatus = "Unknown",
            BlackListVerificationStatus = "Unknown",
            Custom3 = "Unknown",
            Custom4 = "Unknown",
            DepositGraceDays = -1,
            depositSuppressed = true,
            DocsPendingWith = "CS",
            documentUploadStatusIsPending = true,
            emailVerificationStatus = "Unknown",
            F2FVerificationRequired = false,
            GraceDaysBeforeNextAction = -1,
            IdVerificationGraceDays = -1,
            idVerificationStatus = "Unknown",
            isBlackListAttempted = false,
            isCommVerified = false,
            IsKycStarted = false,
            isTransitionPlayer = false,
            KycAttempts = -1,
            KycMaxAttempts = -1,
            KycMaxAttemptsReached = false,
            KycVerified = false,
            PartiallyVerified = false,
            personalIdVerificationStatus = "Unknown",
            ribbonStatusCode = "Unknown",
            ribbonStatusMessage = "Unknown",
            secretPinVerificationStatus = "Unknown",
            SsnVerificationAttempts = -1,
            SsnVerificationMaxAttempts = -1,
            SsnVerificationMaxAttemptsReached = false,
            ssnVerificationStatus = "Unknown",
            ThirdPartyVerificationStatus = "Unknown",
            userHasBonuses = false,
            VerificationDaysLeft = -1,
            verificationStatus = "Unknown",
            verificationType = "Unspecified",
        });
    }
}
