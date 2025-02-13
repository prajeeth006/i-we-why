using System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers;

/// <summary>
/// Indicates that DSL method is excluded from execution on the DSL page.
/// </summary>
[AttributeUsage(AttributeTargets.Method)]
public sealed class SkipInitialValueGetOnDslPageAttribute : Attribute { }
