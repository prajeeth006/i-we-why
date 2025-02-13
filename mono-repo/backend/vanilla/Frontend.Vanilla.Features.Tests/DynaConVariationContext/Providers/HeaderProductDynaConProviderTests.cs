using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class HeaderProductDynaConProviderTests : DynaConProviderTestsBase
{
    private readonly Mock<IDynaConParameterExtractor> dynaconParameterExtractorMock;
    private readonly Mock<ICurrentProductResolver> currentProductResolver;

    public HeaderProductDynaConProviderTests()
    {
        currentProductResolver = new Mock<ICurrentProductResolver>();
        dynaconParameterExtractorMock = new Mock<IDynaConParameterExtractor>();
        Target = new HeaderProductDynaconProvider(dynaconParameterExtractorMock.Object, currentProductResolver.Object);
        dynaconParameterExtractorMock.SetupGet(p => p.Product).Returns("sports");
    }

    [Fact]
    public void DefaultValue_ShouldBeFromDynaCon()
    {
        Target.DefaultValue.Should().Be("sports");
    }

    [Fact]
    public void GetCurrentRawValue_ShouldComeFromResolver()
    {
        currentProductResolver.SetupGet(p => p.ProductLegacy).Returns("portal");

        Target.GetCurrentRawValue().Should().Be("portal");
    }
}
