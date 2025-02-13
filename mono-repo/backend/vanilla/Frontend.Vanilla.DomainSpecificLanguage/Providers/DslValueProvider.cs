using System;
using System.ComponentModel;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers;

/// <summary>
/// Registers and describes provider of values to be used in Vanilla DSL to Autofac container.
/// </summary>
public sealed class DslValueProvider
{
    /// <summary>Gets the name.</summary>
    public Identifier Name { get; }

    /// <summary>Gets the interface of <see cref="Instance" /> which should be exposed.</summary>
    public Type ExposedType { get; }

    /// <summary>Gets the documentation of the provider.</summary>
    public string Documentation { get; }

    /// <summary>Gets the object with actual values - properties and methods.</summary>
    public object Instance { get; }

    /// <summary>
    /// Creates a new instance.
    /// </summary>
    private DslValueProvider(Identifier name, Type exposedType, object instance)
    {
        Name = name;
        Instance = instance;
        ExposedType = Guard.Interface(exposedType, nameof(exposedType));
        Documentation = exposedType.Get<DescriptionAttribute>()?.Description.WhiteSpaceToNull()
                        ?? throw new ArgumentException($"Missing {typeof(DescriptionAttribute)} on {exposedType} with valid documentation for customers.",
                            nameof(exposedType));
    }

    /// <summary>
    /// Creates a new instance. Exposed type is determined based on factory delegate type.
    /// If <paramref name="name" /> is not provided then it's derived from <typeparamref name="TProvider" />
    /// according to convention: IFooBarDslProvider -> FooBar.
    /// </summary>
    public static DslValueProvider Create<TProvider>(TProvider instance, Identifier? name = null)
        where TProvider : class
    {
        Guard.NotNull(instance, nameof(instance));

        return new DslValueProvider(name ?? GetNameByConvention<TProvider>(), typeof(TProvider), instance);
    }

    private static Identifier GetNameByConvention<TProvider>()
    {
        var name = typeof(TProvider).Name;
        const string prefix = "I";
        const string suffix = "DslProvider";

        Guard.Requires(
            name.StartsWith(prefix) && name.EndsWith(suffix),
            nameof(TProvider),
            $"Type name of DSL provider {typeof(TProvider)} must be according to the convention: starts with '{prefix}' and ends with '{suffix}'"
            + " e.g. 'IFooBarDslProvider' -> Name='FooBar'. If you want different Name then specify it explicitly.");

        return new Identifier(name.Substring(prefix.Length, name.Length - prefix.Length - suffix.Length));
    }
}
