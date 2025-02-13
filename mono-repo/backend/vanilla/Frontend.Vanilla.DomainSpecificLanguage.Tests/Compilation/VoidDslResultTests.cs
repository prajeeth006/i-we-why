using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Compilation;

public class VoidDslResultTests
{
    [Fact]
    public async Task SingletonTask_ShouldReturnSingleton()
        => (await VoidDslResult.SingletonTask).Should().BeSameAs(VoidDslResult.Singleton);
}
