using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class TimeDslProviderSyntaxTests : SyntaxTestBase<ITimeDslProvider>
{
    [Fact]
    public void Seconds_Test()
    {
        Provider.Setup(p => p.Seconds(50)).Returns(50m);
        EvaluateAndExpect("Time.Seconds(50)", 50m);
    }

    [Fact]
    public void Minutes_Test()
    {
        Provider.Setup(p => p.Minutes(5)).Returns(300m);
        EvaluateAndExpect("Time.Minutes(5)", 300m);
    }

    [Fact]
    public void Hours_Test()
    {
        Provider.Setup(p => p.Hours(1)).Returns(500m);
        EvaluateAndExpect("Time.Hours(1)", 500m);
    }

    [Fact]
    public void Days_Test()
    {
        Provider.Setup(p => p.Days(4)).Returns(150m);
        EvaluateAndExpect("Time.Days(4)", 150m);
    }

    [Fact]
    public void Weeks_Test()
    {
        Provider.Setup(p => p.Weeks(3)).Returns(321m);
        EvaluateAndExpect("Time.Weeks(3)", 321m);
    }

    [Fact]
    public void Years_Test()
    {
        Provider.Setup(p => p.Years(2)).Returns(20m);
        EvaluateAndExpect("Time.Years(2)", 20m);
    }
}
