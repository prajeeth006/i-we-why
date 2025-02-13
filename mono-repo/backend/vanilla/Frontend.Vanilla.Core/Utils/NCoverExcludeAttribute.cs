using System;

// ReSharper disable CheckNamespace
namespace Bwin.SCM.NCover;
// this namespace expected by bwin CI tools

/// <summary>
/// Allows to exclude code from Bwin continuous integration coverage tools.
/// </summary>
public sealed class NCoverExcludeAttribute : Attribute { }
