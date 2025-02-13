using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Products;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Products;

public class ProductsClientConfigProviderTests
{
    private IClientConfigProvider target;
    private IProductsConfiguration config;

    public ProductsClientConfigProviderTests()
    {
        config = Mock.Of<IProductsConfiguration>(p => p.Products == new Dictionary<string, ProductInfo>());

        target = new ProductsClientConfigProvider(config);
    }

    [Fact]
    public void ShouldHaveCorrectName()
        => target.Name.Should().Be("vnProducts");

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnServerConfig()
    {
        var result = await target.GetClientConfigAsync(TestCancellationToken.Get());

        result.Should().BeSameAs(config.Products);
    }
}
