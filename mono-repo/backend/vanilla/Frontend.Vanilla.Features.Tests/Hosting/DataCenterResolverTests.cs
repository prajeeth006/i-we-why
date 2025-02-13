using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Features.Hosting;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Hosting;

public class DataCenterResolverTests
{
    private const string ValidDataCenterSiteValue = "EU-AT";
    private const string ValidDataCenterGroupValue = "Brazil";
    private const string InvalidValue = "INVALID";

    private readonly Mock<IEnvironment> mockEnvironment;

    public DataCenterResolverTests()
    {
        mockEnvironment = new Mock<IEnvironment>();
    }

    [Fact]
    public void DataCenter_Should_Return_Valid_Values_When_Environment_Variable_Is_Set()
    {
        // Arrange
        mockEnvironment.Setup(e => e.GetEnvironmentVariable(DataCenterResolver.DataCenterEnvironmentVariableName))
            .Returns(ValidDataCenterSiteValue);
        mockEnvironment.Setup(e => e.GetEnvironmentVariable(DataCenterResolver.DataCenterGroupEnvironmentVariableName))
            .Returns(ValidDataCenterGroupValue);

        // Act
        var target = new DataCenterResolver(mockEnvironment.Object);

        // Assert
        target.Site.Should().Be(DataCenter.Austria);
        target.Group.Should().Be(DataCenterGroup.Brazil);
    }

    [Fact]
    public void DataCenter_Should_Be_Default_When_Environment_Variable_Is_Not_Set()
    {
        // Arrange
        mockEnvironment.Setup(e => e.GetEnvironmentVariable(DataCenterResolver.DataCenterEnvironmentVariableName))
            .Returns<string>(null!);
        mockEnvironment.Setup(e => e.GetEnvironmentVariable(DataCenterResolver.DataCenterGroupEnvironmentVariableName))
            .Returns<string>(null!);

        // Act
        var target = new DataCenterResolver(mockEnvironment.Object);

        // Assert
        target.Site.Should().Be(DataCenter.NonProd);
        target.Group.Should().Be(DataCenterGroup.Default);
    }

    [Fact]
    public void DataCenterSite_Should_Throw_Exception_When_Environment_Variable_Value_Is_Invalid()
    {
        // Arrange
        mockEnvironment.Setup(e => e.GetEnvironmentVariable(DataCenterResolver.DataCenterEnvironmentVariableName))
            .Returns(InvalidValue);

        // Act
        Action act = () => { _ = new DataCenterResolver(mockEnvironment.Object).Site; };

        // Assert
        act.Should().Throw<Exception>()
            .WithMessage($"Failed to setup {typeof(DataCenter)} using environment variable '{DataCenterResolver.DataCenterEnvironmentVariableName}' with value '{InvalidValue}'. Supported values are: {string.Join(", ", DataCenter.List.Select(l => l.Value))}.");
    }

    [Fact]
    public void DataCenterGroup_Should_Throw_Exception_When_Environment_Variable_Value_Is_Invalid()
    {
        // Arrange
        mockEnvironment.Setup(e => e.GetEnvironmentVariable(DataCenterResolver.DataCenterGroupEnvironmentVariableName))
            .Returns(InvalidValue);

        // Act
        Action act = () => { _ = new DataCenterResolver(mockEnvironment.Object).Group; };

        // Assert
        act.Should().Throw<Exception>()
            .WithMessage($"Failed to setup {typeof(DataCenterGroup)} using environment variable '{DataCenterResolver.DataCenterGroupEnvironmentVariableName}' with value '{InvalidValue}'. Supported values are: {string.Join(", ", DataCenterGroup.List.Select(l => l.Value))}.");
    }
}
