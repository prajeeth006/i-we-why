using System;
using System.Threading.Tasks;
using Moq;
using Moq.Language;
using Moq.Language.Flow;

namespace Frontend.Vanilla.Testing;

/// <summary>
///     Extension methods for MOQ setups.
/// </summary>
public static class SetupExtensions
{
    /// <summary>
    ///     If given object is exception, configures setup to throw it. Otherwise configures setup to return it.
    /// </summary>
    public static IVerifies ThrowsOrReturns<T, TResult>(this ISetup<T, TResult> setup, object exceptionOrReturnValue)
        where T : class
    {
        if (exceptionOrReturnValue is Exception ex)
            return setup.Throws(ex);

        return setup.Returns((TResult)exceptionOrReturnValue);
    }

    internal static IVerifies ThrowsOrReturnsAsync<T, TResult>(this ISetup<T, Task<TResult>> setup, object exceptionOrReturnValue)
        where T : class
    {
        if (exceptionOrReturnValue is Exception ex)
            return setup.ThrowsAsync(ex);

        return setup.ReturnsAsync((TResult)exceptionOrReturnValue);
    }
}
