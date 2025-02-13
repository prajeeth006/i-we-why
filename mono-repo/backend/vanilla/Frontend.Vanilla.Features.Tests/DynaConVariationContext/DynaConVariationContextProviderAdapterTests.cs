using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.DynaConVariationContext;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext;

public class DynaConVariationContextProviderAdapterTests
{
    private IDynaConVariationContextProvider target;
    private Mock<IWebDynaConVariationContextProvider> webProvider;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private TestLogger<DynaConVariationContextProviderAdapter> log;

    public DynaConVariationContextProviderAdapterTests()
    {
        webProvider = new Mock<IWebDynaConVariationContextProvider>();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        log = new TestLogger<DynaConVariationContextProviderAdapter>();
        target = new DynaConVariationContextProviderAdapter(webProvider.Object, httpContextAccessor.Object, log);

        webProvider.SetupGet(p => p.Name).Returns("Foo");
        webProvider.SetupGet(p => p.DefaultValue).Returns("val def");
        httpContextAccessor.SetupGet(a => a.HttpContext).Returns(Mock.Of<HttpContext>());
    }

    private void ActAndExpect(string expected)
    {
        var definedValues = new ReadOnlySet<TrimmedRequiredString>(new HashSet<TrimmedRequiredString>
        {
            "val a", "val b", "val c",
        });

        // Act
        var result = target.GetCurrentValue(definedValues);

        result.Should().Be(expected);
    }

    [Fact]
    public void ShouldExposeProviderName()
        => target.Name.Value.Should().Be("Foo");

    [Theory]
    [InlineData("val a", "val a")]
    [InlineData("  val b\t\r\n", "val b")]
    [InlineData("val c", "val c")]
    public void ShouldReturnCleanedValue(string webValue, string expected)
    {
        webProvider.Setup(p => p.GetCurrentRawValue()).Returns(webValue);

        ActAndExpect(expected);
        log.VerifyNothingLogged();
    }

    [Theory, ValuesData(null, "", "  ")]
    public void ShouldReturnDefaultAndLogError_IfNoValueFromProvider(string webValue)
    {
        webProvider.Setup(p => p.GetCurrentRawValue()).Returns(webValue);

        ActAndExpect("val def");
        log.Logged.Single().Verify(
            LogLevel.Error,
            ("name", "Foo"),
            ("defaultValue", "val def"));
    }

    [Fact]
    public void ShouldReturnDefaultAndLogWarning_IfNotDefinedValue()
    {
        webProvider.Setup(p => p.GetCurrentRawValue()).Returns("  val x\t");

        ActAndExpect("val def");
        log.Logged.Single().Verify(
            LogLevel.Warning,
            ("name", "Foo"),
            ("value", "val x"),
            ("defaultValue", "val def"),
            ("definedValues", "'val a', 'val b', 'val c'"));
    }

    [Fact]
    public void ShouldReturnDefault_IfNoHttpContext()
    {
        httpContextAccessor.SetupGet(a => a.HttpContext).Returns(() => null);

        ActAndExpect("val def");
        webProvider.Verify(p => p.GetCurrentRawValue(), Times.Never);
        log.VerifyNothingLogged();
    }
}
