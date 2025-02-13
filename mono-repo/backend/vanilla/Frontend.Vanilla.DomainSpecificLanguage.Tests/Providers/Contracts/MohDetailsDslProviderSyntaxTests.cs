using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class MohDetailsDslProviderSyntaxTests : SyntaxTestBase<IMohDetailsDslProvider>
{
    [Fact]
    public void CommentsAsync_Test()
    {
        Provider.Setup(p => p.GetCommentsAsync(Mode)).ReturnsAsync("comment");
        EvaluateAndExpect("MohDetails.Comments", "comment");
    }

    [Fact]
    public void CountryCodeAsync_Test()
    {
        Provider.Setup(p => p.GetCountryCodeAsync(Mode)).ReturnsAsync("GB");
        EvaluateAndExpect("MohDetails.CountryCode", "GB");
    }

    [Fact]
    public void ExclDaysAsync_Test()
    {
        Provider.Setup(p => p.GetExclDaysAsync(Mode)).ReturnsAsync(1M);
        EvaluateAndExpect("MohDetails.ExclDays", 1M);
    }

    [Fact]
    public void MohPrimaryReasonCodeAsync_Test()
    {
        Provider.Setup(p => p.GetMohPrimaryReasonCodeAsync(Mode)).ReturnsAsync(2M);
        EvaluateAndExpect("MohDetails.MohPrimaryReasonCode", 2M);
    }

    [Fact]
    public void MohPrimaryRiskBandCodeAsync_Test()
    {
        Provider.Setup(p => p.GetMohPrimaryRiskBandCodeAsync(Mode)).ReturnsAsync(3M);
        EvaluateAndExpect("MohDetails.MohPrimaryRiskBandCode", 3M);
    }

    [Fact]
    public void MohPrimaryProductCodeAsync_Test()
    {
        Provider.Setup(p => p.GetMohPrimaryProductCodeAsync(Mode)).ReturnsAsync(4M);
        EvaluateAndExpect("MohDetails.MohPrimaryProductCode", 4M);
    }

    [Fact]
    public void MohPrimaryToolCodeAsync_Test()
    {
        Provider.Setup(p => p.GetMohPrimaryToolCodeAsync(Mode)).ReturnsAsync(5M);
        EvaluateAndExpect("MohDetails.MohPrimaryToolCode", 5M);
    }

    [Fact]
    public void MohScoreAsync_Test()
    {
        Provider.Setup(p => p.GetMohScoreAsync(Mode)).ReturnsAsync(6M);
        EvaluateAndExpect("MohDetails.MohScore", 6M);
    }

    [Fact]
    public void ProcessedAsync_Test()
    {
        Provider.Setup(p => p.GetProcessedAsync(Mode)).ReturnsAsync("true");
        EvaluateAndExpect("MohDetails.Processed", "true");
    }

    [Fact]
    public void VipUserAsync_Test()
    {
        Provider.Setup(p => p.GetVipUserAsync(Mode)).ReturnsAsync("true");
        EvaluateAndExpect("MohDetails.VipUser", "true");
    }
}
