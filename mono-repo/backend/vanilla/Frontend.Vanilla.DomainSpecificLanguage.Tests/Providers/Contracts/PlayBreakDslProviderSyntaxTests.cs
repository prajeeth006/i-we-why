using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class PlayBreakDslProviderSyntaxTests : SyntaxTestBase<IPlayBreakDslProvider>
{
    [Fact]
    public void IsActive_Test() => ShouldBeCompilable<bool>("PlayBreak.IsActive");

    [Fact]
    public void EndDate_Test() => ShouldBeCompilable<string>("PlayBreak.EndDate");

    [Fact]
    public void BreakType_Test() => ShouldBeCompilable<string>("PlayBreak.BreakType");
}
