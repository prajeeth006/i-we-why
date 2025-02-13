using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers;

public sealed class DslValuesProviderTests
{
    [Description("Blah")]
    public interface IFooDslProvider
    {
        int Value { get; }
    }

    [Fact]
    public void ShouldExposeProviderDetails()
    {
        var foo = Mock.Of<IFooDslProvider>();
        var name = new Identifier("Test");

        // Act
        var target = DslValueProvider.Create(foo, name);

        target.Name.Should().BeSameAs(name);
        target.ExposedType.Should().Be(typeof(IFooDslProvider));
        target.Documentation.Should().Be("Blah");
        target.Instance.Should().BeSameAs(foo);
    }

    public interface IMissingDocumentation { }

    [Description("  ")]
    public interface IInvalidDocumentation { }

    public static IEnumerable<object[]> NoDocumentationTestCases => new[]
    {
        new object[] { Tuple.Create(Mock.Of<IMissingDocumentation>()) },
        new object[] { Tuple.Create(Mock.Of<IInvalidDocumentation>()) },
    };

    [Theory, MemberData(nameof(NoDocumentationTestCases))]
    public void TProvider_ShouldThrow_IfMissingOrInvalidDocumentation<TProvider>(Tuple<TProvider> provider)
        where TProvider : class
        => new Action(() => DslValueProvider.Create(provider.Item1, new Identifier("Test")))
            .Should().Throw<ArgumentException>()
            .WithMessage($"Missing System.ComponentModel.DescriptionAttribute on {typeof(TProvider)} with valid documentation for customers. (Parameter 'exposedType')");

    [Fact]
    public void Instance_ShouldThrow_IfNull()
        => new Action(() => DslValueProvider.Create((IFooDslProvider)null))
            .Should().Throw<ArgumentNullException>().Which.ParamName.Should().Be("instance");

    [Fact]
    public void Name_ShouldDetermineFromTypeName_IfNotProvided()
    {
        // Act
        var target = DslValueProvider.Create(Mock.Of<IFooDslProvider>());

        target.Name.Should().Be("Foo");
    }

    public interface IMissingSuffix { }

    [Fact]
    public void Name_ShouldThrow_IfMissingSuffix()
        => RunNotAccordingToConventionTest<IMissingSuffix>();

    [SuppressMessage("ReSharper", "SA1302", Justification = "Interface without I for purposes of the following test.")]
    public interface MissingPrefixDslProvider { }

    [Fact]
    public void Name_ShouldThrow_IfMissingPrefix()
        => RunNotAccordingToConventionTest<MissingPrefixDslProvider>();

    private void RunNotAccordingToConventionTest<TProvider>()
        where TProvider : class
    {
        var provider = Mock.Of<TProvider>();

        Action act = () => DslValueProvider.Create(provider);

        act.Should().Throw<ArgumentException>()
            .WithMessage(
                $"Type name of DSL provider {typeof(TProvider)} must be according to the convention: starts with 'I' and ends with 'DslProvider'"
                + $" e.g. 'IFooBarDslProvider' -> {nameof(DslValueProvider.Name)}='FooBar'. If you want different {nameof(DslValueProvider.Name)} then specify it explicitly. (Parameter 'TProvider')")
            .And.ParamName.Should().Be("TProvider");
    }
}
