using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class ListDslProviderTests
{
    private IListDslProvider target;
    private Mock<IPosApiCommonServiceInternal> posApiCommonService;
    private ExecutionMode mode;

    public ListDslProviderTests()
    {
        posApiCommonService = new Mock<IPosApiCommonServiceInternal>();
        mode = TestExecutionMode.Get();
        target = new ListDslProvider(posApiCommonService.Object);
    }

    [Theory]
    [InlineData("Chuck Norris", true)]
    [InlineData("Vladimir Putin", false)]
    [InlineData("Hulk,Chuck Norris,Iron Man", true)]
    [InlineData("Hulk,Iron Man", false)]
    public async Task ShouldReturnTrueIfAtLeastOneArgumentInTheList(string args, bool expected)
    {
        posApiCommonService.Setup(s => s.GetListAsync(mode, "Heroes")).ReturnsAsync(new[] { "Chuck Norris", "Batman", "Superman" });

        var result = await target.ContainsAsync(mode, "Heroes", args); // Act

        result.Should().Be(expected); // Act
    }

    [Fact]
    public async Task ShouldReturnFalseIfListIsEmpty()
    {
        posApiCommonService.Setup(s => s.GetListAsync(mode, "My Sins")).ReturnsAsync(Array.Empty<string>());

        var result = await target.ContainsAsync(mode, "My Sins", "Lust"); // Act

        result.Should().BeFalse();
    }
}
