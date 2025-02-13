using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class RequestDynaConProviderTests : DynaConProviderTestsBase
{
    private readonly Mock<IInternalRequestEvaluator> internalRequestEvaluatorMock;

    public RequestDynaConProviderTests()
    {
        internalRequestEvaluatorMock = new Mock<IInternalRequestEvaluator>();
        Target = new RequestDynaConProvider(internalRequestEvaluatorMock.Object);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldComeFromDefaultValue()
    {
        Target.GetCurrentRawValue().Should().Be(RequestTypes.External);
    }

    [Theory]
    [InlineData(false, RequestTypes.External)]
    [InlineData(true, RequestTypes.Internal)]
    public void GetCurrentRawValue_ShouldMapCorrectly(bool isInternal, string expected)
    {
        internalRequestEvaluatorMock.Setup(p => p.IsInternal()).Returns(isInternal);

        Target.GetCurrentRawValue().Should().Be(expected);
    }
}
