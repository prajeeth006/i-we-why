using System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Reflection.Facade;

/// <summary>
/// Instructs facade to delegate the execution to specified service and its member (method or property).
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Property)]
public sealed class DelegateToAttribute : Attribute
{
    /// <summary>Gets the interface of the service to which the execution should be delegated.</summary>
    public Type ServiceType { get; }

    /// <summary>Gets the name of method or property (according to facade member type) of <see cref="ServiceType" /> to which the execution should be delegated.</summary>
    public TrimmedRequiredString MethodOrPropertyName { get; }

    /// <summary>Creates a new instance.</summary>
    public DelegateToAttribute(Type serviceType, string methodOrPropertyName)
    {
        ServiceType = Guard.NotNull(serviceType, nameof(serviceType));
        MethodOrPropertyName = methodOrPropertyName;
    }
}
