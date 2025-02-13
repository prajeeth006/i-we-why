using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.ServiceClients.Services.Registration.MobileAvailability;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login;

public class MobilePhoneLoginServiceTests
{
    private IMobilePhoneLoginService target;
    private readonly Mock<IMobileAvailabilityServiceClient> mobileAvailabilityServiceClient;
    private readonly Mock<IContentService> contentService;
    private readonly Mock<ILogger<MobilePhoneLoginService>> log;
    private CancellationToken ct;

    public MobilePhoneLoginServiceTests()
    {
        mobileAvailabilityServiceClient = new Mock<IMobileAvailabilityServiceClient>();
        contentService = new Mock<IContentService>();
        log = new Mock<ILogger<MobilePhoneLoginService>>();
        ct = TestCancellationToken.Get();
        target = new MobilePhoneLoginService(mobileAvailabilityServiceClient.Object, contentService.Object, log.Object);
    }

    [Fact]
    public async Task ValidateDuplicateMobileNumber_ShouldCallApiWhenMobileNumber()
    {
        mobileAvailabilityServiceClient.Setup(r => r.VerifyAsync(ct, "1", "1231231231")).Returns(Task.FromResult(true));

        await target.ValidateDuplicateMobileNumber("+1-1231231231", ct);

        mobileAvailabilityServiceClient.Verify(s => s.VerifyAsync(ct, "1", "1231231231"), Times.Once);
    }

    [Fact]
    public async Task ValidateDuplicateMobileNumber_ShouldNotCallApiWhenNotMobileNumber()
    {
        await target.ValidateDuplicateMobileNumber("TestUsername", ct);

        mobileAvailabilityServiceClient.Verify(s => s.VerifyAsync(ct, "1", "1231231231"), Times.Never);
    }

    [Fact]
    public async Task GetMobilePhoneMessageAsync_ShouldReturnErrorMessage()
    {
        var messages = new Dictionary<string, string>
        {
            ["MobilePhoneDuplicate"] = "Mobile phone duplicated",
        };

        var item = Mock.Of<IGenericListItem>(i => i.VersionedList == messages.AsContentParameters());
        contentService.Setup(s => s.GetRequiredAsync<IGenericListItem>("App-v1.0/Resources/Messages", ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(item);

        var result = await target.GetMobilePhoneMessageAsync(ct);

        result.Should().Be("Mobile phone duplicated");
    }
}
