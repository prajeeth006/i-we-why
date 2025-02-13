using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.LicenseInfo;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.LicenseInfo;

public sealed class LicenseInfoServiceInternalTests
{
    private readonly LicenseInfoServiceInternal target;
    private readonly Mock<IPosApiAccountService> accountServiceMock;
    private readonly Mock<ILicenseInfoService> licenceComplianceServiceMock;
    private readonly Mock<IProductPlaceholderReplacer> productPlaceholderReplacerMock;
    private readonly Mock<IAppDslProvider> appDslProviderMock;
    private readonly Mock<ILicenseInfoConfiguration> configMock;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessorMock;

    public LicenseInfoServiceInternalTests()
    {
        accountServiceMock = new Mock<IPosApiAccountService>();
        licenceComplianceServiceMock = new Mock<ILicenseInfoService>();
        appDslProviderMock = new Mock<IAppDslProvider>();
        configMock = new Mock<ILicenseInfoConfiguration>();
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
        productPlaceholderReplacerMock = new Mock<IProductPlaceholderReplacer>();

        target = new LicenseInfoServiceInternal(
            configMock.Object,
            licenceComplianceServiceMock.Object,
            accountServiceMock.Object,
            appDslProviderMock.Object,
            currentUserAccessorMock.Object);

        configMock.SetupGet(o => o.IsEnabled).Returns(true);
        appDslProviderMock.SetupGet(o => o.Product).Returns("sports");
        productPlaceholderReplacerMock.Setup(o => o.ReplaceAsync(It.IsAny<ExecutionMode>(), It.IsAny<string>())).ReturnsAsync("replaced");
        currentUserAccessorMock.SetupGet(o => o.User.Identity.IsAuthenticated).Returns(true);
    }

    [Fact]
    public async Task ShouldNotDoAnythingIfNotEnabled()
    {
        configMock.SetupGet(o => o.IsEnabled).Returns(false);

        var model = await target.GetLicenceComplianceAsync(ExecutionMode.Sync); // Act

        model.AcceptanceNeeded.Should().BeFalse();
    }

    [Fact]
    public async Task ShouldNotDoAnythingIfNotAuthenticated()
    {
        currentUserAccessorMock.SetupGet(o => o.User.Identity.IsAuthenticated).Returns(false);

        var model = await target.GetLicenceComplianceAsync(ExecutionMode.Sync); // Act

        model.AcceptanceNeeded.Should().BeFalse();
    }

    [Fact]
    public async Task ShouldNotDoAnythingIfThereAreNoAvailableLicences()
    {
        licenceComplianceServiceMock.Setup(o => o.GetAvailableLicences("sports")).Returns(new List<string>());

        var model = await target.GetLicenceComplianceAsync(ExecutionMode.Sync); // Act

        model.AcceptanceNeeded.Should().BeFalse();
    }

    [Fact]
    public async Task ShouldNotDoAnythingIfAllLicencesAreAccepted()
    {
        licenceComplianceServiceMock.Setup(o => o.GetAvailableLicences("sports")).Returns(new List<string> { "A_PLUS", "F_PLUS" });
        accountServiceMock.Setup(o => o.GetProductLicenceInfosAsync(It.IsAny<ExecutionMode>(), true)).Returns(Task.FromResult(
            (IReadOnlyList<ServiceClients.Services.Account.ProductLicenseInfos.LicenseInfo>)new List<ServiceClients.Services.Account.ProductLicenseInfos.LicenseInfo>
            {
                new () { LicenseCode = "A_PLUS", LicenseAccepted = true },
                new () { LicenseCode = "F_PLUS", LicenseAccepted = true },
            }));

        var model = await target.GetLicenceComplianceAsync(ExecutionMode.Sync); // Act

        model.AcceptanceNeeded.Should().BeFalse();
    }

    [Fact]
    public async Task ShouldRedirect()
    {
        configMock.SetupGet(o => o.Url).Returns("http://{portal}/url");
        licenceComplianceServiceMock.Setup(o => o.GetAvailableLicences("sports")).Returns(new List<string> { "A_PLUS", "F_PLUS" });
        accountServiceMock.Setup(o => o.GetProductLicenceInfosAsync(It.IsAny<ExecutionMode>(), true)).Returns(Task.FromResult(
            (IReadOnlyList<ServiceClients.Services.Account.ProductLicenseInfos.LicenseInfo>)new List<ServiceClients.Services.Account.ProductLicenseInfos.LicenseInfo>
            {
                new () { LicenseCode = "A_PLUS", LicenseAccepted = true },
                new () { LicenseCode = "F_PLUS", LicenseAccepted = false },
            }));

        var model = await target.GetLicenceComplianceAsync(ExecutionMode.Sync); // Act

        model.AcceptanceNeeded.Should().BeTrue();
        model.RedirectUrl.Should().Be("http://{portal}/url");
        model.Licenses.Should().Be("F_PLUS");
    }

    [Fact]
    public async Task ShouldRedirect2()
    {
        configMock.SetupGet(o => o.Url).Returns("http://{portal}/url");
        licenceComplianceServiceMock.Setup(o => o.GetAvailableLicences("sports")).Returns(new List<string> { "A_PLUS" });
        accountServiceMock.Setup(o => o.GetProductLicenceInfosAsync(It.IsAny<ExecutionMode>(), true)).Returns(Task.FromResult(
            (IReadOnlyList<ServiceClients.Services.Account.ProductLicenseInfos.LicenseInfo>)new List<ServiceClients.Services.Account.ProductLicenseInfos.LicenseInfo>
            {
                new () { LicenseCode = "A_PLUS", LicenseAccepted = false },
                new () { LicenseCode = "F_PLUS", LicenseAccepted = true },
            }));

        var model = await target.GetLicenceComplianceAsync(ExecutionMode.Sync); // Act

        model.AcceptanceNeeded.Should().BeTrue();
        model.RedirectUrl.Should().Be("http://{portal}/url");
        model.Licenses.Should().Be("A_PLUS");
    }
}
