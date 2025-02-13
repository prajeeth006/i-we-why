using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using FluentAssertions.Specialized;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Context;

public sealed class DynamicVariationContextResolverTests
{
    private Mock<IDynaConVariationContextProvider> provider1;
    private Mock<IDynaConVariationContextProvider> provider2;
    private ICurrentContextAccessor currentContextAccessor;

    private IValidChangeset changeset;
    private Dictionary<TrimmedRequiredString, ReadOnlySet<TrimmedRequiredString>> definedCtxValues;

    public DynamicVariationContextResolverTests()
    {
        provider1 = new Mock<IDynaConVariationContextProvider>();
        provider2 = new Mock<IDynaConVariationContextProvider>();
        currentContextAccessor = Mock.Of<ICurrentContextAccessor>(r => r.Items == new ConcurrentDictionary<object, Lazy<object>>());

        definedCtxValues = new Dictionary<TrimmedRequiredString, ReadOnlySet<TrimmedRequiredString>>(RequiredStringComparer.OrdinalIgnoreCase)
        {
            { "Religion", new TrimmedRequiredString[] { "Satanism", "Islam" }.ToHashSet().AsReadOnly() },
            { "Sex", new TrimmedRequiredString[] { "Male", "Female" }.ToHashSet().AsReadOnly() },
        };
        changeset = Mock.Of<IValidChangeset>(c => c.DefinedContextValues == definedCtxValues);
        provider1.SetupGet(p => p.Name).Returns("Religion");
        provider2.SetupGet(p => p.Name).Returns("Sex");
    }

    private IDynamicVariationContextResolver GetTarget()
        => new DynamicVariationContextResolver(new[] { provider1.Object, provider2.Object }, currentContextAccessor);

    [Fact]
    public void ProviderNames_ShouldGetNamesOfProviders()
        => GetTarget().ProviderNames.Should().Equal("Religion", "Sex");

    [Theory]
    [InlineData("Religion", "Satanism")]
    [InlineData("RELIGION", "Satanism")] // Should be case-insensitive
    [InlineData("Sex", "Female")]
    public void Resolve_ShouldGetValueFromProvider(string name, string expected)
    {
        provider1.Setup(p => p.GetCurrentValue(definedCtxValues["Religion"])).Returns("Satanism");
        provider2.Setup(p => p.GetCurrentValue(definedCtxValues["Sex"])).Returns("Female");

        // Act
        var result = GetTarget().Resolve(name, changeset);

        result.Should().Be(expected);
    }

    [Fact]
    public void Resolve_ShouldCacheValues()
    {
        provider1.SetupWithAnyArgs(p => p.GetCurrentValue(null)).Returns("Satanism");
        var target = GetTarget();

        for (var i = 0; i < 10; i++)
            target.Resolve("Religion", changeset).Should().Be("Satanism"); // Act

        provider1.VerifyWithAnyArgs(p => p.GetCurrentValue(null), Times.Once);
        currentContextAccessor.Items.Keys.Single().Should().BeOfType<string>().Which.Should().Contain("religion");
    }

    [Fact]
    public void Resolve_ShouldThrow_IfUnknownProvider()
    {
        provider1.SetupGet(p => p.Name).Returns("Other");

        RunResolveThrowTest(
            $"There is no registered {typeof(IDynaConVariationContextProvider)} with {nameof(IDynaConVariationContextProvider.Name)} 'Religion' to resolve particular variation context property.");
    }

    [Fact]
    public void Resolve_ShouldRethrow_IfResolutionFails()
    {
        provider1.SetupWithAnyArgs(p => p.GetCurrentValue(null)).Throws(new Exception("Provider error."));

        RunResolveThrowTest("Provider error.");
    }

    [Theory, BooleanData]
    public void Resolve_ShouldThrow_IfNoDefinedValues(bool nullValues)
    {
        definedCtxValues["Religion"] = nullValues ? null : TrimmedStrs.Empty.ToHashSet().AsReadOnly();

        RunResolveThrowTest(
            "There are no defined values for configuration variation context property 'Religion' but configuration with this property exists."
            + $" This most likely indicates race condition of fetching the changeset vs. variation hierarchy. Associated provider is {provider1.Object}.");

        provider1.VerifyWithAnyArgs(p => p.GetCurrentValue(null), Times.Never);
    }

    [Theory]
    [InlineData(null, "null")]
    [InlineData("Christianity", "'Christianity'")]
    public void Resolve_ShouldLogWarning_IfReturnedValueIsUndefined(string value, string reportedValue)
    {
        provider1.SetupWithAnyArgs(p => p.GetCurrentValue(null)).Returns(value?.AsTrimmedRequired());

        RunResolveThrowTest(
            $"Provider {provider1.Object} for configuration variation context property 'Religion' returned {reportedValue}"
            + " which is not in the list of defined values in DynaCon. Defines values: 'Satanism', 'Islam'.");
    }

    private void RunResolveThrowTest(string expectedMsg)
    {
        var target = GetTarget();

        Action act = () => target.Resolve("Religion", changeset);

        act.Should().Throw().WithMessage(expectedMsg);
    }

    [Theory]
    [InlineData("Religion")]
    [InlineData("religION")] // Should be case-insensitive
    public void Constructor_ShouldThrow_IfProviderNameConflictsWithOther(string providerName)
        => RunConstructorThrowTest<DuplicateException>(providerName)
            .Which.ConflictingValue.Should().Be(providerName);

    [Fact]
    public void Constructor_ShouldThrow_IfProviderNameIsNull()
        => RunConstructorThrowTest<ArgumentNullException>(providerName: null);

    private ExceptionAssertions<TException> RunConstructorThrowTest<TException>(TrimmedRequiredString providerName)
        where TException : Exception
    {
        provider2.SetupGet(p => p.Name).Returns(providerName);

        return new Action(() => GetTarget()).Should().Throw<TException>();
    }
}
