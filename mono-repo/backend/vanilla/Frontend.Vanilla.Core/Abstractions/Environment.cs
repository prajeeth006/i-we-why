using System;
using System.Diagnostics.CodeAnalysis;
using Bwin.SCM.NCover;

namespace Frontend.Vanilla.Core.Abstractions;

/// <summary>
/// Abstraction of <see cref="Environment" /> to ease unit testing.
/// </summary>
internal interface IEnvironment
{
    /// <summary>
    /// Gets the name of this computer.
    /// </summary>
    string MachineName { get; }

    /// <summary>
    /// Retrieves the value of an environment variable from the current process.
    /// </summary>
    string? GetEnvironmentVariable(string variable);
}

[ExcludeFromCodeCoverage, NCoverExclude]
internal sealed class EnvironmentWrapper : IEnvironment
{
    public string MachineName => Environment.MachineName;

    public string? GetEnvironmentVariable(string variable)
        => Environment.GetEnvironmentVariable(variable);
}
