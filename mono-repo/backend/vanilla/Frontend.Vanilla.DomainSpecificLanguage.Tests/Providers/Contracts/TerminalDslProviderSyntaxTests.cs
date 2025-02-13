using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class TerminalDslProviderSyntaxTests : SyntaxTestBase<ITerminalDslProvider>
{
    [Fact]
    public void TerminalIdTest()
    {
        Provider.SetupGet(p => p.TerminalId).Returns("1");
        EvaluateAndExpect("Terminal.TerminalId", "1");
    }

    [Fact]
    public void ResolutionTest()
    {
        Provider.Setup(p => p.GetResolutionAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Terminal.Resolution", "1");
    }

    [Fact]
    public void StatusTest()
    {
        Provider.Setup(p => p.GetStatusAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Terminal.Status", "1");
    }

    [Fact]
    public void TypeTest()
    {
        Provider.Setup(p => p.GetTypeAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Terminal.Type", "1");
    }

    [Fact]
    public void VolumeTest()
    {
        Provider.Setup(p => p.GetVolumeAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Terminal.Volume", "1");
    }

    [Fact]
    public void AccountNameTest()
    {
        Provider.Setup(p => p.GetAccountNameAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Terminal.AccountName", "1");
    }

    [Fact]
    public void CustomerIdTest()
    {
        Provider.Setup(p => p.GetCustomerIdAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Terminal.CustomerId", "1");
    }

    [Fact]
    public void IpAddressTest()
    {
        Provider.Setup(p => p.GetIpAddressAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Terminal.IpAddress", "1");
    }

    [Fact]
    public void LockStatusTest()
    {
        Provider.Setup(p => p.GetLockStatusAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Terminal.LockStatus", "1");
    }

    [Fact]
    public void MacIdTest()
    {
        Provider.Setup(p => p.GetMacIdAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Terminal.MacId", "1");
    }

    [Fact]
    public void TerminalStatusTest()
    {
        Provider.Setup(p => p.GetTerminalStatusAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Terminal.TerminalStatus", "1");
    }
}
