using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Kyc;
using Frontend.Vanilla.ServiceClients.Services.Kyc.Models;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.ServiceClients;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Kyc;

public class PosApiKycServiceClientTests
{
    private readonly Mock<IPosApiRestClient> restClientMock;
    private readonly Mock<IPosApiDataCache> cacheMock;
    private readonly Mock<IServiceClientsConfiguration> config;
    private readonly IKycServiceClient kycServiceClient;

    public PosApiKycServiceClientTests()
    {
        restClientMock = new Mock<IPosApiRestClient>();
        cacheMock = new Mock<IPosApiDataCache>();
        config = new Mock<IServiceClientsConfiguration>();
        kycServiceClient = new PosApiKycServiceClient(restClientMock.Object, cacheMock.Object, config.Object);
    }

    [Fact]
    public async Task GetKycStatusAsyncShouldBeSuccess()
    {
        config.SetupGet(c => c.CacheTimeEndpoints).Returns(new Dictionary<string, TimeSpan>
            { { "GetKycStatus", TimeSpan.FromMinutes(1) } });
        const string data =
            @"{""verificationType"":8,""verificationStatus"":6,""verificationDaysLeft"":3,""addressVerificationStatus"":""address"",""ageVerificationGraceDays"":23,""ageVerificationGracePeriod"":""\/Date(1537776907000)\/"",""ageVerificationStatus"":""status"",""amlVerificationStatus"":""aml"",""blackListVerificationStatus"":""list"",""createDate"":""\/Date(1537776907000)\/"",""idVerificationGraceDays"":45,""idVerificationStatus"":""id"",""idVerificationGracePeriod"":""\/Date(1537776907000)\/"",""kycAttempts"":5,""kycMaxAttemptsReached"":false,""kycMaxAttempts"":10,""ssnVerificationAttempts"":1,""ssnVerificationMaxAttempts"":1,""ssnVerificationMaxAttemptsReached"":true,""ssnVerificationStatus"":""ssn"",""personalIdVerificationStatus"":1,""bankIdVerificationStatus"":10,""secretPinVerificationStatus"":1,""graceDaysBeforeNextAction"":36,""accountStatus"":1,""isKycStarted"":true,""emailVerificationStatus"":0,""partiallyVerified"":false,""f2FVerificationRequired"":true,""depositGraceDays"":13,""graceDaysUnit"":""86"",""kycVerified"":true,""thirdPartyVerificationStatus"":""yes"",""custom3"":""yes"",""custom4"":""yes""}";

        var kycStatus = new KycStatus
        {
            AccountStatus = 1,
            AddressVerificationStatus = "address",
            AgeVerificationGraceDays = 23,
            AgeVerificationGracePeriod = new DateTime(2018, 9, 24, 8, 15, 7, DateTimeKind.Utc),
            AgeVerificationStatus = "status",
            AmlVerificationStatus = "aml",
            BankIdVerificationStatus = 10,
            BlackListVerificationStatus = "list",
            CreateDate = new DateTime(2018, 9, 24, 8, 15, 7, DateTimeKind.Utc),
            Custom3 = "yes",
            Custom4 = "yes",
            DepositGraceDays = 13,
            EmailVerificationStatus = 0,
            F2FVerificationRequired = true,
            GraceDaysBeforeNextAction = 36,
            GraceDaysUnit = "86",
            IdVerificationGraceDays = 45,
            IdVerificationGracePeriod = new DateTime(2018, 9, 24, 8, 15, 7, DateTimeKind.Utc),
            IdVerificationStatus = "id",
            IsKycStarted = true,
            KycAttempts = 5,
            KycMaxAttempts = 10,
            KycMaxAttemptsReached = false,
            KycVerified = true,
            PartiallyVerified = false,
            PersonalIdVerificationStatus = 1,
            SecretPinVerificationStatus = 1,
            SsnVerificationAttempts = 1,
            SsnVerificationMaxAttempts = 1,
            SsnVerificationMaxAttemptsReached = true,
            SsnVerificationStatus = "ssn",
            ThirdPartyVerificationStatus = "yes", // Custom4
            VerificationDaysLeft = 3,
            VerificationStatus = 6,
            VerificationType = 8,
        };

        var response = PosApiSerializationTester.Deserialize<KycStatus>(data);
        cacheMock.SetupWithAnyArgs(c => c.GetOrCreateAsync<PosApiKycStatus>(default, default, null, null, default, null))
            .Returns((
                ExecutionMode mode,
                PosApiDataType dataType,
                RequiredString key,
                Func<Task<PosApiKycStatus>> valueFactory,
                bool cached,
                TimeSpan? relativeExpiration) => valueFactory());

        restClientMock.Setup(s => s.ExecuteAsync<KycStatus>(ExecutionMode.Sync, It.IsAny<PosApiRestRequest>())).ReturnsAsync(response);

        // Act
        var result = kycServiceClient.GetKycStatusAsync(ExecutionMode.Sync);

        // Assert
        restClientMock.Verify(v => v.ExecuteAsync<KycStatus>(ExecutionMode.Sync,
            It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains("Kyc.svc/KycStatus") &&
                                          p.Authenticate && p.Method == HttpMethod.Get)), Times.Once);
        result.Should().NotBeNull();
        (await result).VerificationDaysLeft.Should().Be(3);
        kycStatus.Should().BeEquivalentTo(response);
    }

    [Fact]
    public async Task GetKycInfoForRibbonAsync_ShouldBeSuccess()
    {
        const string data = @"{""statusCode"":""0"",""statusMessage"":""Success""}";

        var kycInfoForRibbon = new KycInfoForRibbon
        {
            StatusCode = "0",
            StatusMessage = "Success",
        };

        var response = PosApiSerializationTester.Deserialize<KycInfoForRibbon>(data);

        cacheMock.SetupWithAnyArgs(c => c.GetOrCreateAsync<PosApiKycInfoForRibbon>(default, default, null, null, default, null))
            .Returns((
                ExecutionMode mode,
                PosApiDataType dataType,
                RequiredString key,
                Func<Task<PosApiKycInfoForRibbon>> valueFactory,
                bool cached,
                TimeSpan? relativeExpiration) => valueFactory());

        restClientMock.Setup(s => s.ExecuteAsync<KycInfoForRibbon>(ExecutionMode.Sync, It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(response);

        // Act
        var result = await kycServiceClient.GetKycInfoForRibbonAsync(ExecutionMode.Sync);

        // Assert
        restClientMock.Verify(v => v.ExecuteAsync<KycInfoForRibbon>(ExecutionMode.Sync,
            It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains("Kyc.svc/KycInfoForRibbon") &&
                                          p.Authenticate && p.Method == HttpMethod.Get)), Times.Once);

        result.StatusCode.Should().Be("0");
        result.StatusMessage.Should().Be("Success");
        kycInfoForRibbon.Should().BeEquivalentTo(response);
    }
}
