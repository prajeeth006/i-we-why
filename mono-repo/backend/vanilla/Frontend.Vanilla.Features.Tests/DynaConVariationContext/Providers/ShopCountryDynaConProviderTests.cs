using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class ShopCountryDynaConProviderTests : DynaConProviderTestsBase
{
    private Mock<IShopDslProvider> shopDslProvider;

    public ShopCountryDynaConProviderTests()
    {
        shopDslProvider = new Mock<IShopDslProvider>();
        Target = new ShopCountryDynaConProvider(shopDslProvider.Object);
    }

    [Theory]
    [MemberData(nameof(GetShoupCountryTestCases))]
    public void GetCurrentRawValue_ShouldGetShopCountry(Task<string> getCountryTask, string expectedCountry)
    {
        shopDslProvider.Setup(p => p.GetCountryAsync(ExecutionMode.Sync)).Returns(getCountryTask);
        Target.GetCurrentRawValue().Should().Be(expectedCountry);
    }

    public static IEnumerable<object[]> GetShoupCountryTestCases()
    {
        object[] GetTestCase(Task<string> getCountryTask, string expectedCountry) =>
            new object[] { getCountryTask, expectedCountry };

        yield return GetTestCase(Task.FromResult("Test"), "Test");
        yield return GetTestCase(Task.Delay(1).ContinueWith((_) => "Test2"), "Test2");
    }
}
