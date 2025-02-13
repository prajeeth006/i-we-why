using System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers;

/// <summary>
/// Indicates that DSL provider, property or method can be evaluated only on the client
/// because there is no server-side implementation.
/// </summary>
[AttributeUsage(AttributeTargets.Interface | AttributeTargets.Property | AttributeTargets.Method)]
public sealed class ClientSideOnlyAttribute : Attribute { }

internal sealed class ClientSideOnlyException()
    : NotSupportedException("Particular provider or its member can't be evaluated on server because it's client-side only.") { }
