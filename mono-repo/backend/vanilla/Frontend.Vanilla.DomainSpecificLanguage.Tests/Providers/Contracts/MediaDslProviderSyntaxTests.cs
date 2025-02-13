using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class MediaDslProviderSyntaxTests : SyntaxTestBase<IMediaDslProvider>
{
    [Fact]
    public void IsActive_Test()
        => ShouldBeCompilable<bool>("Media.IsActive('sm')");

    [Fact]
    public void Orientation_Test()
        => ShouldBeCompilable<string>("Media.Orientation");
}
