using System;
using System.Linq;
using System.Reflection;

namespace Frontend.Vanilla.Core.Reflection;

/// <summary>
/// Extension methods of <see cref="ICustomAttributeProvider" />.
/// </summary>
public static class CustomAttributeProviderExtensions
{
    /// <summary>Gets first <typeparamref name="TAttribute" /> defined on this member. <c>Null</c> if there is no custom attribute of that.</summary>
    public static TAttribute? Get<TAttribute>(this ICustomAttributeProvider provider, bool inherit = true)
        where TAttribute : Attribute
        => (TAttribute?)provider.GetCustomAttributes(typeof(TAttribute), inherit).FirstOrDefault();

    /// <summary>Gets first mandatory <typeparamref name="TAttribute" /> defined on this member.</summary>
    public static TAttribute GetRequired<TAttribute>(this ICustomAttributeProvider provider, bool inherit = true)
        where TAttribute : Attribute
        => provider.Get<TAttribute>(inherit)
           ?? throw new Exception($"Missing mandatory {typeof(TAttribute)} on {provider} of type {provider.GetType()}.");

    /// <summary>Checks whether one or more instance of <typeparamref name="TAttribute" /> is defined on this member.</summary>
    public static bool Has<TAttribute>(this ICustomAttributeProvider provider, bool inherit = true)
        where TAttribute : Attribute
        => provider.IsDefined(typeof(TAttribute), inherit);
}
