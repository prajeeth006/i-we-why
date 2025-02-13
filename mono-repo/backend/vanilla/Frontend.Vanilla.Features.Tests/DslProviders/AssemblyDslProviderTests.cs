using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.Ioc;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class AssemblyDslProviderTests
{
    private IAssemblyDslProvider target;

    public AssemblyDslProviderTests()
    {
        target = new AssemblyDslProvider(new ReferencedAssemblies(new[]
        {
            TestAssembly.Get("Assembly1", fileVersion: "6.6.6", assemblyVersion: "6.0.0"),
            TestAssembly.Get("Frontend.Vanilla.Core", fileVersion: "7.5.0", assemblyVersion: "1.0.0"),
            TestAssembly.Get("AssemblyMock", fileVersion: "7.5.9.4-589632", assemblyVersion: "1.1"),
            TestAssembly.Get("Assembly2", fileVersion: "3.8.2", assemblyVersion: "3.1.0"),
            TestAssembly.Get("Assembly3", fileVersion: "infoVersionTest", assemblyVersion: "1.1"),
            TestAssembly.Get("Assembly4", fileVersion: "7.5.", assemblyVersion: "1.1"),
            TestAssembly.Get("OnlyAssemblyVersion", assemblyVersion: "6.11.3"),
        }));
    }

    [Theory]
    [InlineData("Frontend.Vanilla.Core", "= 7.5.0", true)]
    [InlineData("Frontend.Vanilla.Core", ">= 7.4.0", true)]
    [InlineData("Frontend.Vanilla.Core", "> 7.4.9", true)]
    [InlineData("Frontend.Vanilla.Core", "< 7.5.1", true)]
    [InlineData("Frontend.Vanilla.Core", "<=7.5.0", true)]
    [InlineData("Frontend.Vanilla.Core", "=7.5", false)]
    [InlineData("Frontend.Vanilla.Core", ">7.5.0.1", false)]
    public void HasVersion_ValidNameAndVersion_ShouldReturnTrueOrFalse(string name, string version, bool expected)
    {
        target.HasVersion(name, version).Should().Be(expected);
    }

    [Fact]
    public void HasVersion_AssemblyNotExist_ShouldReturnFalse()
    {
        target.HasVersion("Assembly5", "= 5.12.0").Should().Be(false);
    }

    [Theory, MemberData(nameof(NullAndEmptyString))]
    public void HasVersion_NameIsNull_ShouldReturnArgumentException(string name)
    {
        Action action = () => target.HasVersion(name, "1.1.1");

        action.Should().Throw<ArgumentException>();
    }

    [Theory, MemberData(nameof(NullAndEmptyString))]
    public void HasVersion_OperatorAndVersionIsNull_ShouldReturnArgumentException(string operatorAndVersion)
    {
        Action action = () => target.HasVersion("Assembly", operatorAndVersion);

        action.Should().Throw<ArgumentException>();
    }

    [Theory, ValuesData("=", "= 7.5.", "7")]
    public void HasVersion_OperatorAndVersionInvalid_ShouldReturnArgumentException(string version)
    {
        Action action = () => target.HasVersion("Assembly", version);

        action.Should().Throw<ArgumentException>()
            .WithMessage($"Unable to parse valid comparison operator or assembly version from value '{version}'. (Parameter 'operatorAndVersion')");
    }

    [Fact]
    public void HasVersion_AssemblyVersionNotValid_ShouldReturnArgumentException()
    {
        Action action = () => target.HasVersion("Assembly3", "= 3.5.6");

        action.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void HasAtLeastVersion_AssemblyVersionNotInValidFormat_ShouldReturnArgumentException()
    {
        Action action = () => target.HasVersion("Assembly4", "= 3.5.6");

        action.Should().Throw<ArgumentException>();
    }

    public static readonly IEnumerable<object[]> NullAndEmptyString = new[]
    {
        new object[] { null },
        new object[] { "" },
        new object[] { "  " },
    };
}
