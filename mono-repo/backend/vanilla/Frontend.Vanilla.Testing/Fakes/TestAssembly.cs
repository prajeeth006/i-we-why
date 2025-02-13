using System;
using System.Reflection;
using JetBrains.Annotations;
using Moq;

namespace Frontend.Vanilla.Testing.Fakes;

internal class TestAssembly : Assembly
{
    /// <summary>
    ///     Mock assembly for testing.
    /// </summary>
    /// <param name="name">Set name of assembly.</param>
    /// <param name="infoVersion">Set informational version attribute of assembly.</param>
    /// <param name="fileVersion">Set file version attribute of assembly.</param>
    /// <param name="isVanilla">Set product attribute of assembly.</param>
    /// <param name="assemblyVersion">Set assembly version of assembly.</param>
    /// <returns>
    ///     The assembly.
    /// </returns>
    public static TestAssembly Get(string name = null, string infoVersion = null, string fileVersion = null, bool isVanilla = false, string assemblyVersion = null)
    {
        var assembly = new Mock<TestAssembly>();

        assembly.Setup(a => a.GetName()).Returns(new AssemblyName
            { Name = isVanilla ? $"Frontend.Vanilla.{name}" : name, Version = Version.Parse(assemblyVersion ?? "0.0.1") });
        assembly.Setup(infoVersion != null ? new AssemblyInformationalVersionAttribute(infoVersion) : null);
        assembly.Setup(fileVersion != null ? new AssemblyFileVersionAttribute(fileVersion) : null);

        return assembly.Object;
    }
}

internal static class TestAssemblyExtensions
{
    public static void Setup<TProvider, TAttribute>(this Mock<TProvider> provider, [CanBeNull] TAttribute attribute)
        where TProvider : class, ICustomAttributeProvider
        where TAttribute : Attribute
    {
        provider.Setup(a => a.GetCustomAttributes(typeof(TAttribute), true))
            .Returns(attribute != null ? new object[] { attribute } : Array.Empty<object>());
    }
}
